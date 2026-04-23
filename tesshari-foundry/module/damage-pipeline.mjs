/**
 * Tesshari Damage Pipeline
 * ------------------------
 * Deterministic 7-step damage resolution from system/02_keywords_and_status.md:
 *
 *   1. Read card base damage
 *   2. Add attacker's primary stat
 *   3. Apply attacker-side modifiers (Overclock, items, class passives)
 *   4. Apply defender-side prevention (Pierce → Guard → Shield)
 *   5. Apply defender-side amplification (× Vulnerable, + Expose)
 *   6. Clamp to minimum 0
 *   7. Commit HP loss and status-pool reductions, log the event
 *
 * Pure math — reads stacks via StatusEngine, writes reductions via StatusEngine,
 * writes HP directly on the defender. No UI concerns beyond an optional
 * minimal chat card.
 *
 * Separation of concerns: this module does NOT read cards or attackers directly.
 * The caller (card-play engine, macros) reads card.system.baseDamage,
 * attacker.system.stats[primaryStat], attacker+card bonuses, and passes them
 * in explicitly. That keeps the pipeline testable and unaware of data shapes.
 */

import { StatusEngine } from "./status-effects.mjs";

const SYSTEM_ID = "tesshari";

/**
 * @typedef {object} DamageInputs
 * @property {number}  [baseDamage=0]     Card base damage (step 1)
 * @property {number}  [statValue=0]      Attacker's primary-stat value (step 2)
 * @property {number}  [attackerBonus=0]  Item/passive/Overclock additions (step 3)
 * @property {number}  [pierce=0]         Pierce value (step 4, consumed against Guard then Shield)
 * @property {boolean} [echo=false]       If true, repeat base+stat with no riders
 * @property {boolean} [ignoreMitigation=false] Skip steps 4–5 entirely (flat damage like Bleed)
 * @property {Actor|null}   [attacker]   Optional — only used for chat speaker / logging
 * @property {Item|null}    [card]       Optional — only used for chat flags / logging
 * @property {string}  [label="damage"]   Short label for chat output
 * @property {boolean} [chat=true]        Emit a chat message with the breakdown
 */

/**
 * @typedef {object} DamageResult
 * @property {number} baseDamage
 * @property {number} statValue
 * @property {number} attackerBonus
 * @property {number} pierce
 * @property {number} guardConsumed
 * @property {number} shieldConsumed
 * @property {number} vulnerableStacks
 * @property {number} exposeAdded
 * @property {number} preClampDamage
 * @property {number} finalDamage
 * @property {number} echoDamage
 * @property {number} totalDamage
 * @property {{step: number, label: string, value: number}[]} steps
 */

export class TesshariDamage {

  /**
   * Resolve damage against the defender and commit results.
   * @param {Actor} defender
   * @param {DamageInputs} inputs
   * @returns {Promise<DamageResult>}
   */
  static async resolve(defender, inputs = {}) {
    const {
      baseDamage = 0,
      statValue = 0,
      attackerBonus = 0,
      pierce = 0,
      echo = false,
      ignoreMitigation = false,
      attacker = null,
      card = null,
      label = "damage",
      chat = true,
    } = inputs;

    if (!defender) {
      const msg = "TesshariDamage.resolve: defender is null/undefined. Did you set a target (T on a hovered token)?";
      ui.notifications?.error(msg);
      throw new Error(msg);
    }

    const steps = [];
    let dmg = baseDamage;
    steps.push({ step: 1, label: "base", value: dmg });

    // Step 2 — add primary stat
    dmg += statValue;
    steps.push({ step: 2, label: `+ stat (${statValue})`, value: dmg });

    // Step 3 — attacker modifiers
    if (attackerBonus !== 0) {
      dmg += attackerBonus;
      steps.push({ step: 3, label: `+ mods (${attackerBonus})`, value: dmg });
    }

    let guardConsumed = 0;
    let shieldConsumed = 0;
    let vuln = 0;
    let expose = 0;

    if (!ignoreMitigation) {
      // Step 4 — Pierce reduces effective Guard, then Shield; then absorb
      let guard = StatusEngine.stacksOf(defender, "guard");
      let shield = StatusEngine.stacksOf(defender, "shield");

      const pierceVsGuard = Math.min(pierce, guard);
      guard -= pierceVsGuard;
      const pierceVsShield = Math.min(pierce - pierceVsGuard, shield);
      shield -= pierceVsShield;

      const absorbedByGuard = Math.min(guard, dmg);
      dmg -= absorbedByGuard;
      guardConsumed = absorbedByGuard + pierceVsGuard;
      if (pierceVsGuard || absorbedByGuard) {
        steps.push({
          step: 4, label: `− guard (−${absorbedByGuard}, pierced ${pierceVsGuard})`, value: dmg,
        });
      }

      const absorbedByShield = Math.min(shield, dmg);
      dmg -= absorbedByShield;
      shieldConsumed = absorbedByShield + pierceVsShield;
      if (pierceVsShield || absorbedByShield) {
        steps.push({
          step: 4, label: `− shield (−${absorbedByShield}, pierced ${pierceVsShield})`, value: dmg,
        });
      }

      // Step 5 — Vulnerable × then Expose +
      vuln = StatusEngine.stacksOf(defender, "vulnerable");
      expose = StatusEngine.stacksOf(defender, "expose");
      if (vuln > 0) {
        dmg = Math.floor(dmg * (1 + 0.1 * vuln));
        steps.push({ step: 5, label: `× vulnerable ${vuln}`, value: dmg });
      }
      if (expose > 0) {
        dmg += expose;
        steps.push({ step: 5, label: `+ expose ${expose}`, value: dmg });
      }
    }

    const preClampDamage = dmg;

    // Step 6 — clamp
    dmg = Math.max(0, dmg);
    if (dmg !== preClampDamage) steps.push({ step: 6, label: "clamp ≥ 0", value: dmg });

    // Step 7 — commit
    await this.#commit(defender, dmg, guardConsumed, shieldConsumed);

    // Echo pass — repeat base+stat against residual defenses, no Pierce, no riders
    let echoDamage = 0;
    if (echo) {
      echoDamage = await this.#resolveEcho(defender, baseDamage + statValue);
    }

    const result = {
      baseDamage,
      statValue,
      attackerBonus,
      pierce,
      guardConsumed,
      shieldConsumed,
      vulnerableStacks: vuln,
      exposeAdded: expose,
      preClampDamage,
      finalDamage: dmg,
      echoDamage,
      totalDamage: dmg + echoDamage,
      steps,
    };

    if (chat) await this.#postChat(attacker, defender, card, label, result);
    return result;
  }

  /**
   * Echo repeat — from keywords_and_status.md §Echo:
   *   "the repeated hit does not apply rider effects... the Echo hit can be
   *    blocked by remaining Guard/Shield... Expose and Vulnerable affect
   *    the Echo hit (they apply to all incoming damage)."
   */
  static async #resolveEcho(defender, baseStat) {
    let dmg = baseStat;
    let guard = StatusEngine.stacksOf(defender, "guard");
    let shield = StatusEngine.stacksOf(defender, "shield");
    const absG = Math.min(guard, dmg);  dmg -= absG;
    const absS = Math.min(shield, dmg); dmg -= absS;
    const vuln = StatusEngine.stacksOf(defender, "vulnerable");
    const expose = StatusEngine.stacksOf(defender, "expose");
    dmg = Math.max(0, Math.floor(dmg * (1 + 0.1 * vuln)) + expose);
    await this.#commit(defender, dmg, absG, absS);
    return dmg;
  }

  static async #commit(defender, hpDamage, guardConsumed, shieldConsumed) {
    if (guardConsumed > 0)  await StatusEngine.reduce(defender, "guard",  guardConsumed);
    if (shieldConsumed > 0) await StatusEngine.reduce(defender, "shield", shieldConsumed);
    if (hpDamage > 0) {
      const hp = defender.system.hp;
      await defender.update({ "system.hp.value": Math.max(0, hp.value - hpDamage) });
    }
  }

  /**
   * Minimal chat card showing the damage breakdown. Upgradeable to a rich
   * template when sheets land.
   */
  static async #postChat(attacker, defender, card, label, r) {
    const title = card?.name ?? label;
    const attackerName = attacker?.name ?? "Attacker";
    const defenderName = defender?.name ?? "Target";
    const stepsHtml = r.steps.map(s => `<li>${s.label}: <strong>${s.value}</strong></li>`).join("");
    const echoLine = r.echoDamage > 0
      ? `<p>Echo: <strong>${r.echoDamage}</strong> (total <strong>${r.totalDamage}</strong>)</p>`
      : "";
    const content = `
      <div class="tesshari-damage-card">
        <header><strong>${attackerName}</strong> → ${title} → <strong>${defenderName}</strong></header>
        <p>Final damage: <strong>${r.finalDamage}</strong></p>
        ${echoLine}
        <details><summary>breakdown</summary><ol>${stepsHtml}</ol></details>
      </div>`;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: attacker ?? defender }),
      content,
      flags: {
        [SYSTEM_ID]: {
          kind: "damage",
          cardId: card?.id ?? null,
          attackerId: attacker?.id ?? null,
          defenderId: defender?.id ?? null,
          result: r,
        },
      },
    });
  }
}
