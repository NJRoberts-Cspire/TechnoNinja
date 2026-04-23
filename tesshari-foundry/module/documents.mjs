/**
 * Tesshari document classes — Actor, Item, Combat.
 *
 * Registered from `init` in tesshari.mjs via CONFIG.{Actor,Item,Combat}.documentClass.
 * Real behavior lives here; schemas live in ./data-models.mjs.
 */

import { StatusEngine } from "./status-effects.mjs";
import { TesshariDamage } from "./damage-pipeline.mjs";
import { CardEngine } from "./card-engine.mjs";
import { ClassResources } from "./class-resources.mjs";

export class TesshariActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();
    // Clamp HP/AP within bounds. prepareDerivedData runs every update.
    const s = this.system;
    if (s?.hp) s.hp.value = Math.clamp(s.hp.value, 0, s.hp.max);
    if (s?.ap) s.ap.value = Math.clamp(s.ap.value, 0, s.ap.max);

    // Class resources: derive max per resource def + clamp stored value.
    // Items may not be populated during early prepare cycles — guard for that.
    const cls = this.items?.find?.(i => i.type === "class");
    const defs = cls?.system?.classResources ?? [];
    if (defs.length && s?.classResources) {
      for (const def of defs) {
        const entry = s.classResources[def.id] ?? (s.classResources[def.id] = { value: def.initial ?? 0 });
        const max = ClassResources.computeMax(def, this);
        entry.max = max;
        entry.value = Math.max(0, Math.min(max, Number.isFinite(entry.value) ? entry.value : (def.initial ?? 0)));
      }
    }
  }

  /**
   * Fire resource hooks when HP crosses thresholds. preUpdate gives us the
   * prior value so we can detect "transitioned below half HP" etc.
   */
  async _preUpdate(changes, options, user) {
    const prevHp = this.system?.hp?.value;
    const prevMax = this.system?.hp?.max;
    options.tesshariPrevHp = { value: prevHp, max: prevMax };
    return super._preUpdate(changes, options, user);
  }

  _onUpdate(changes, options, user) {
    super._onUpdate(changes, options, user);
    // Only run the owning GM / player once — guard by userId.
    if (game.userId !== user) return;
    const prev = options?.tesshariPrevHp;
    if (prev != null && changes?.system?.hp?.value != null) {
      ClassResources.onHpChange(this, prev.value, prev.max).catch(err =>
        console.error("tesshari | onHpChange failed:", err)
      );
    }
  }

  /**
   * Convenience wrapper around the damage pipeline. Card-play code will call
   * this after reading card data; macros can call it directly.
   * @see TesshariDamage.resolve
   */
  async applyCardDamage(inputs = {}) {
    return TesshariDamage.resolve(this, inputs);
  }

  /**
   * Flat HP damage that bypasses all mitigation. Used by Bleed ticks (which
   * StatusEngine already handles) and one-off narrative damage.
   */
  async applyFlatDamage(amount) {
    if (!amount || amount <= 0) return 0;
    const hp = this.system.hp;
    const actual = Math.min(amount, hp.value);
    if (actual > 0) await this.update({ "system.hp.value": hp.value - actual });
    return actual;
  }

  /** Heal up to `amount` HP, clamped to max. */
  async applyHealing(amount) {
    if (!amount || amount <= 0) return 0;
    const hp = this.system.hp;
    const actual = Math.min(amount, hp.max - hp.value);
    if (actual > 0) await this.update({ "system.hp.value": hp.value + actual });
    return actual;
  }

  /** Spend AP; returns true on success, false and warns on shortfall. */
  async spendAP(cost) {
    if (!cost || cost <= 0) return true;
    const ap = this.system.ap;
    if (ap.value < cost) {
      ui.notifications?.warn(`${this.name}: not enough AP (have ${ap.value}, need ${cost}).`);
      return false;
    }
    await this.update({ "system.ap.value": ap.value - cost });
    return true;
  }

  /**
   * Play one of this actor's card items. Resolves targets from the current
   * user's targeted tokens unless passed explicitly.
   * @param {Item|string} cardOrId  A card Item or its id
   * @param {object}      [opts]
   */
  async playCard(cardOrId, opts = {}) {
    const card = typeof cardOrId === "string" ? this.items.get(cardOrId) : cardOrId;
    if (!card) {
      ui.notifications?.error(`playCard: card not found (${cardOrId}).`);
      return { ok: false, reason: "card-not-found" };
    }
    return CardEngine.play(this, card, opts);
  }
}

export class TesshariItem extends Item {
  get isCard() { return this.type === "card"; }
}

export class TesshariCombat extends Combat {
  /**
   * _onStartTurn / _onEndTurn / _onStartRound / _onEndRound run only for one
   * designated GM user — safe place for state mutations that must fire once.
   */

  /**
   * Turn start:
   *   1. Reset AP to max, minus Overheat penalty (−1 at 3+, −2 at 6+).
   *   2. Clear per-turn trackers (basic attack used, cards played this turn).
   *   3. Apply Regen stacks (heal HP).
   */
  async _onStartTurn(combatant) {
    await super._onStartTurn(combatant);
    const actor = combatant?.actor;
    if (!actor) return;

    const penalty = StatusEngine.overheatPenalty(actor);
    const newAP = Math.max(0, (actor.system.ap?.max ?? 0) - penalty);

    await actor.update({
      "system.ap.value": newAP,
      "system.turn.basicAttackUsed": false,
      "system.turn.cardsPlayedThisTurn": [],
    });

    await StatusEngine.tickRegen(actor);
    await ClassResources.onTurnStart(actor);
  }

  /**
   * Combat start: refill per_combat class resources for every combatant.
   * Foundry calls _onStartRound at round 1 start — that's our combat-start
   * signal. We detect first-round by checking round number.
   */
  async _onStartRound() {
    await super._onStartRound();
    if (this.round !== 1) return;
    for (const c of this.combatants) {
      const actor = c.actor;
      if (!actor) continue;
      await ClassResources.onCombatStart(actor);
    }
  }

  /**
   * Turn end:
   *   1. Tick Bleed (flat damage, ignores Guard).
   *   2. Tick Burn (strips Guard first, remainder to HP).
   *   3. Decrement turn-scoped status durations.
   */
  async _onEndTurn(combatant) {
    await super._onEndTurn(combatant);
    const actor = combatant?.actor;
    if (!actor) return;

    await StatusEngine.tickBleed(actor);
    await StatusEngine.tickBurn(actor);
    await StatusEngine.tickTurnDurations(actor);
  }

  /**
   * Round end: reset each combatant's once-per-round reaction, decrement
   * round-scoped status durations (Fortify, Taunt).
   */
  async _onEndRound() {
    await super._onEndRound();
    for (const c of this.combatants) {
      const actor = c.actor;
      if (!actor) continue;
      await actor.update({ "system.turn.reactionUsed": false });
      await StatusEngine.tickRoundDurations(actor);
    }
  }
}
