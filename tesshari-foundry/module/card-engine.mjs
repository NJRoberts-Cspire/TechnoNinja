/**
 * Tesshari Card Engine
 * --------------------
 * Glue between a player clicking a card and the damage/status/chat effects
 * landing. Reads a `card` Item, enforces Tesshari's play gates (AP cost, once
 * per turn, Stagger/Silence/Root, once-per-combat), resolves damage via
 * TesshariDamage, applies keyword riders via StatusEngine, handles Veil
 * consumption on defenders, and commits turn state.
 *
 * Consumes:
 *   - card.system.tier           0..4
 *   - card.system.apCost         AP cost (usually = tier)
 *   - card.system.category       attack | defense | control | ... (see data-models)
 *   - card.system.primaryStat    iron | edge | frame | signal | resonance | veil | mixed | ""
 *   - card.system.baseDamage     flat number
 *   - card.system.pierce         flat number
 *   - card.system.keywords       ["Bleed 3", "Expose 2", "Echo", ...]
 *   - card.system.isReaction     boolean
 *   - card.system.usesPerCombat  number | null
 *
 * Produces chat output via TesshariDamage. Rider applications are per-target.
 */

import { StatusEngine } from "./status-effects.mjs";
import { TesshariDamage } from "./damage-pipeline.mjs";

const SYSTEM_ID = "tesshari";

/** Foundry's 15 keyword IDs that map to status applications via StatusEngine. */
const STATUS_KEYWORDS = new Set([
  "guard", "shield", "fortify", "regen", "veil",
  "bleed", "burn", "expose", "vulnerable", "overheat",
  "stagger", "root", "silence", "taunt", "mark",
]);

/** Modifier keywords consumed by the damage pipeline, not by the rider loop. */
const MODIFIER_KEYWORDS = new Set(["pierce", "echo", "overclock"]);

/** Action keywords that trigger removal effects on targets. */
const ACTION_KEYWORDS = new Set(["cleanse", "dispel"]);

export class CardEngine {

  /**
   * Main entry: play a card.
   * @param {Actor} actor              The card's owner (attacker).
   * @param {Item}  card               A `card`-type item.
   * @param {object} [opts]
   * @param {Actor[]|null} [opts.targets]    Explicit target list. null → uses game.user.targets tokens.
   * @param {boolean}      [opts.overclock]  Apply Overclock amplification (2× base) + Overheat 2 to self.
   * @param {boolean}      [opts.dryRun]     Validate only, don't commit.
   * @returns {Promise<{ok: boolean, reason?: string, results?: object[]}>}
   */
  static async play(actor, card, opts = {}) {
    const { targets: explicitTargets = null, overclock = false, dryRun = false } = opts;

    if (!actor) {
      ui.notifications?.error("Card play: no attacker actor (select a token first).");
      return this.#fail("No attacker actor.");
    }
    if (!card) {
      ui.notifications?.error("Card play: card is null/undefined. Check the card name or drag it onto the actor.");
      return this.#fail("No card item.");
    }
    if (card.type !== "card") {
      ui.notifications?.error(`Card play: item "${card.name}" is type "${card.type}", not "card".`);
      return this.#fail("Not a card item.");
    }

    console.log(`tesshari | playing ${card.name} by ${actor.name}`, {
      baseDamage: card.system.baseDamage,
      apCost: card.system.apCost,
      primaryStat: card.system.primaryStat,
      keywords: card.system.keywords,
    });

    const targets = this.#resolveTargets(explicitTargets);

    // ─── gates ────────────────────────────────────────────────────────
    const gate = this.canPlay(actor, card);
    if (!gate.ok) {
      ui.notifications?.warn(`${card.name}: ${gate.reason}`);
      return gate;
    }

    // If the card has damage or rider effects but no target, warn and bail
    // before spending AP. Self-only / passive cards (no damage, no riders)
    // can play without targets.
    const kwCount = (card.system.keywords ?? []).length;
    const hasOutwardEffect = (card.system.baseDamage ?? 0) > 0 || kwCount > 0;
    if (targets.length === 0 && hasOutwardEffect) {
      ui.notifications?.warn(
        `${card.name}: no targets. Hover a token and press T to target, then retry.`
      );
      return this.#fail("No targets.");
    }

    if (dryRun) return { ok: true, reason: "dry-run ok" };

    // ─── spend AP ─────────────────────────────────────────────────────
    // Basic attacks (apCost 0, isBasicAttack flag) use a different tracker.
    const apCost = card.system.apCost ?? card.system.tier ?? 0;
    if (apCost > 0) {
      const ok = await actor.spendAP(apCost);
      if (!ok) return this.#fail("AP deduction failed at commit time.");
    }

    // ─── parse keywords once ──────────────────────────────────────────
    const keywords = (card.system.keywords ?? []).map(parseKeyword).filter(Boolean);
    const hasEcho = keywords.some(k => k.name === "echo");
    const hasCleanse = keywords.some(k => k.name === "cleanse");
    const hasDispel  = keywords.some(k => k.name === "dispel");
    const statusRiders = keywords.filter(k => STATUS_KEYWORDS.has(k.name));

    // ─── attacker-side modifiers ──────────────────────────────────────
    const statValue = this.#resolveStatValue(actor, card);
    let effectiveBase = card.system.baseDamage ?? 0;
    let attackerBonus = 0;

    if (overclock) {
      effectiveBase = effectiveBase * 2;  // simple amplification; specific cards may override
    }

    // ─── per-target resolution ────────────────────────────────────────
    const results = [];
    for (const defender of targets) {
      const targetResult = { defender: defender.name, damage: null, riders: [], cleansed: [], dispelled: [], veilConsumed: false };

      // Damage pass
      if ((card.system.baseDamage ?? 0) > 0 || (card.system.primaryStat && card.system.primaryStat !== "")) {
        targetResult.damage = await TesshariDamage.resolve(defender, {
          baseDamage: effectiveBase,
          statValue,
          pierce: card.system.pierce ?? 0,
          attackerBonus,
          echo: hasEcho,
          attacker: actor,
          card,
          label: card.name,
        });
      }

      // Veil consumption — defender's first-hit-loses-riders. Consumed even if
      // the card has no riders (rules §Veil: "the card has no effect at all"
      // when targeting a Veil'd defender with pure-control).
      const defenderHasVeil = StatusEngine.hasStatus(defender, "veil");
      if (defenderHasVeil) {
        await StatusEngine.remove(defender, "veil");
        targetResult.veilConsumed = true;
      } else {
        // Status riders
        for (const rider of statusRiders) {
          await StatusEngine.apply(defender, rider.name, rider.value);
          targetResult.riders.push(`${rider.name} ${rider.value}`);
        }

        // Cleanse on defender (typically for self/ally cards — the caller's
        // responsibility to pick the right target list; engine just runs it)
        if (hasCleanse) {
          const removed = await StatusEngine.cleanse(defender, 1);
          targetResult.cleansed = removed;
        }
        // Dispel from defender
        if (hasDispel) {
          const removed = await StatusEngine.dispel(defender, 1);
          targetResult.dispelled = removed;
        }
      }

      results.push(targetResult);
    }

    // ─── self-applied modifiers ───────────────────────────────────────
    if (overclock) {
      await StatusEngine.apply(actor, "overheat", 2);
    }

    // ─── commit turn-state trackers ───────────────────────────────────
    await this.#commitTurnState(actor, card);

    console.log(`tesshari | played ${card.name}`, { results });
    return { ok: true, results };
  }

  /**
   * Tactics-mode hover preview. Pure — commits nothing, posts no chat, mutates
   * no state. Returns a structured "what would happen" summary for the UI.
   *
   * Shape:
   *   {
   *     canPlay:   { ok, reason? },
   *     apCost, apAfter,
   *     statValue, primaryStat, effectiveBase,
   *     targets: [
   *       { name, hpBefore, hpAfter, damage, echoDamage, guardConsumed,
   *         shieldConsumed, vulnerableStacks, exposeAdded, riders: [{id,value}],
   *         cleansed: boolean, dispelled: boolean, veilWouldConsume: boolean,
   *         steps: [{step,label,value}] }
   *     ],
   *     selfRiders: [{id,value}],   // e.g. Overclock → Overheat 2
   *     keywords: {riders, actions, modifiers}
   *   }
   */
  static preview(actor, card, opts = {}) {
    const { targets: explicitTargets = null, overclock = false } = opts;
    if (!actor || !card || card.type !== "card") {
      return { canPlay: { ok: false, reason: "Invalid card." }, targets: [] };
    }

    const canPlay = this.canPlay(actor, card);
    const targets = this.#resolveTargets(explicitTargets);

    const apCost = card.system.apCost ?? card.system.tier ?? 0;
    const apValue = actor.system?.ap?.value ?? 0;
    const apAfter = Math.max(0, apValue - apCost);

    const keywords = (card.system.keywords ?? []).map(parseKeyword).filter(Boolean);
    const hasEcho    = keywords.some(k => k.name === "echo");
    const hasCleanse = keywords.some(k => k.name === "cleanse");
    const hasDispel  = keywords.some(k => k.name === "dispel");
    const statusRiders = keywords.filter(k => STATUS_KEYWORDS.has(k.name));
    const modifiers    = keywords.filter(k => MODIFIER_KEYWORDS.has(k.name));
    const actions      = keywords.filter(k => ACTION_KEYWORDS.has(k.name));

    const statValue = this.#resolveStatValue(actor, card);
    const primaryStat = (card.system?.primaryStat ?? "").toLowerCase();
    let effectiveBase = card.system.baseDamage ?? 0;
    if (overclock) effectiveBase *= 2;

    const hasDamage = effectiveBase > 0 || (primaryStat && primaryStat !== "");

    const targetBlocks = targets.map(defender => {
      const veilWouldConsume = StatusEngine.hasStatus(defender, "veil");
      const dmgResult = hasDamage
        ? TesshariDamage.preview(defender, {
            baseDamage: effectiveBase,
            statValue,
            pierce: card.system.pierce ?? 0,
            attackerBonus: 0,
            echo: hasEcho,
          })
        : null;

      return {
        name: defender.name,
        hpBefore: defender.system?.hp?.value ?? 0,
        hpAfter:  dmgResult?.hpAfter ?? (defender.system?.hp?.value ?? 0),
        damage:   dmgResult?.finalDamage ?? 0,
        echoDamage: dmgResult?.echoDamage ?? 0,
        totalDamage: dmgResult?.totalDamage ?? 0,
        guardConsumed:  dmgResult?.guardConsumed ?? 0,
        shieldConsumed: dmgResult?.shieldConsumed ?? 0,
        vulnerableStacks: dmgResult?.vulnerableStacks ?? 0,
        exposeAdded:      dmgResult?.exposeAdded ?? 0,
        steps: dmgResult?.steps ?? [],
        veilWouldConsume,
        riders: veilWouldConsume ? [] : statusRiders.map(r => ({ id: r.name, value: r.value })),
        cleansed:  !veilWouldConsume && hasCleanse,
        dispelled: !veilWouldConsume && hasDispel,
      };
    });

    const selfRiders = [];
    if (overclock) selfRiders.push({ id: "overheat", value: 2 });

    return {
      canPlay,
      apCost, apAfter,
      statValue, primaryStat, effectiveBase,
      overclocked: overclock,
      hasDamage,
      targets: targetBlocks,
      selfRiders,
      keywords: { riders: statusRiders, modifiers, actions },
    };
  }

  /**
   * Validate whether the actor can legally play the card right now. No state
   * mutations. Returns { ok, reason }.
   */
  static canPlay(actor, card) {
    const sys = card.system ?? {};
    const turn = actor.system?.turn ?? {};
    const apCost = sys.apCost ?? sys.tier ?? 0;
    const tier = sys.tier ?? 0;
    const category = (sys.category ?? "").toLowerCase();
    const primaryStat = (sys.primaryStat ?? "").toLowerCase();

    // AP
    if (apCost > 0 && (actor.system?.ap?.value ?? 0) < apCost) {
      return this.#fail(`Not enough AP (${actor.system?.ap?.value} / need ${apCost}).`);
    }

    // Once-per-turn — basic attacks use a separate tracker
    if (card.system?.isBasicAttack) {
      if (turn.basicAttackUsed) return this.#fail("Basic Attack already used this turn.");
    } else {
      const played = turn.cardsPlayedThisTurn ?? [];
      if (played.includes(card.id)) return this.#fail("Already played this turn.");
    }

    // Once-per-combat
    if (sys.usesPerCombat != null && sys.usesPerCombat > 0) {
      const used = (turn.usedThisCombat ?? []).filter(id => id === card.id).length;
      if (used >= sys.usesPerCombat) {
        return this.#fail(`Already used ${used}/${sys.usesPerCombat} times this combat.`);
      }
    }

    // Status gates — Basic Attacks bypass Stagger/Silence/Root
    if (!card.system?.isBasicAttack) {
      if (StatusEngine.hasStatus(actor, "stagger") && tier >= 2) {
        return this.#fail("Staggered — cannot play Tier 2–3 cards.");
      }
      if (StatusEngine.hasStatus(actor, "silence") && (primaryStat === "signal" || primaryStat === "resonance")) {
        return this.#fail("Silenced — cannot play Signal or Resonance cards.");
      }
      if (StatusEngine.hasStatus(actor, "root") && category === "mobility") {
        return this.#fail("Rooted — cannot play Mobility cards.");
      }
    }

    // Reactions must have reaction available this round
    if (sys.isReaction && turn.reactionUsed) {
      return this.#fail("Reaction already used this round.");
    }

    return { ok: true };
  }

  /* ──────────────────────────────────────────────────────────────────
   * Internal helpers
   * ────────────────────────────────────────────────────────────────── */

  static #resolveTargets(explicit) {
    if (Array.isArray(explicit) && explicit.length) return explicit;
    // Fall back to current user's targets
    const tokens = Array.from(game.user?.targets ?? []);
    return tokens.map(t => t.actor).filter(Boolean);
  }

  static #resolveStatValue(actor, card) {
    const key = (card.system?.primaryStat ?? "").toLowerCase();
    if (!key) return 0;
    const stats = actor.system?.stats ?? {};
    if (key === "mixed") {
      // No explicit mixed-stat field in the schema yet; fall back to highest
      // of IRON and EDGE (common default). Cards that need something else
      // should set primaryStat explicitly.
      return Math.max(stats.iron ?? 0, stats.edge ?? 0);
    }
    return stats[key] ?? 0;
  }

  static async #commitTurnState(actor, card) {
    const turn = actor.system?.turn ?? {};
    const updates = {};

    if (card.system?.isBasicAttack) {
      updates["system.turn.basicAttackUsed"] = true;
    } else {
      const played = [...(turn.cardsPlayedThisTurn ?? []), card.id];
      updates["system.turn.cardsPlayedThisTurn"] = played;
    }

    if (card.system?.isReaction) {
      updates["system.turn.reactionUsed"] = true;
    }

    if (card.system?.usesPerCombat != null && card.system.usesPerCombat > 0) {
      const usedThisCombat = [...(turn.usedThisCombat ?? []), card.id];
      updates["system.turn.usedThisCombat"] = usedThisCombat;
    }

    if (Object.keys(updates).length) await actor.update(updates);
  }

  static #fail(reason) { return { ok: false, reason }; }
}

/**
 * Parse a keyword string into { name, value }.
 * Accepts: "Bleed 3" → { name: "bleed", value: 3 }
 *          "Stagger" → { name: "stagger", value: 1 }
 *          "Pierce 6 (on kata)" → { name: "pierce", value: 6 }
 * Returns null on empty/whitespace input.
 */
export function parseKeyword(raw) {
  if (raw == null) return null;
  const m = String(raw).trim().match(/^([A-Za-z]+)(?:\s+(\d+))?/);
  if (!m) return null;
  return { name: m[1].toLowerCase(), value: m[2] ? parseInt(m[2], 10) : 1 };
}

/** Re-exports for macros/tests. */
export { STATUS_KEYWORDS, MODIFIER_KEYWORDS, ACTION_KEYWORDS };
