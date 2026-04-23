/**
 * Tesshari Class Resources
 * ------------------------
 * Per-class charge pools that give each class a unique sheet mechanic.
 * Iron Monk → Between Points. Blood Smith → Forge Charges. Void Walker →
 * Void Charges. Echo Speaker → Resonance Echoes. Etc.
 *
 * Definitions live on the class item (ClassDataModel.classResources).
 * Per-character `value` lives on CharacterDataModel.classResources; `max`
 * is derived each render from the definition + current stats.
 *
 * Life cycle:
 *   - init(actor, classItem)  → on class drop, seed `value = initial` for each resource
 *   - clear(actor, classItem) → on class remove, strip the entries
 *   - deriveMax(actor)        → per-render, re-computes `max` from the definition
 *                                (stat-backed maxes auto-track stat changes)
 *   - spend / gain / reset    → sheet buttons, card scripts, macros
 *   - onTurnStart / onCombatStart → automated regain triggers from TesshariCombat
 *
 * All mutations funnel through `actor.update()` so Foundry propagates to clients.
 */

const SYSTEM_ID = "tesshari";

export class ClassResources {

  /**
   * Fetch the class item on an actor, or null.
   * @param {Actor} actor
   */
  static classItem(actor) {
    return actor?.items?.find(i => i.type === "class") ?? null;
  }

  /**
   * Definitions from the actor's class item (array; [] if no class).
   * @param {Actor} actor
   * @returns {object[]}
   */
  static definitions(actor) {
    const cls = this.classItem(actor);
    return cls?.system?.classResources ?? [];
  }

  /**
   * Compute the derived `max` for a given resource definition against an actor's stats.
   * @param {object} def    one entry from classResources
   * @param {Actor}  actor
   */
  static computeMax(def, actor) {
    const stats = actor?.system?.stats ?? {};
    switch (def.maxMode) {
      case "stat":       return stats[def.maxStat] ?? 0;
      case "stat_plus":  return (stats[def.maxStat] ?? 0) + (def.maxValue ?? 0);
      case "flat":
      default:           return def.maxValue ?? 0;
    }
  }

  /**
   * Merge persisted `value` with derived `max` and the definition itself.
   * Returns an array of `{id, name, description, icon, value, max, def}`
   * suitable for template rendering. Out-of-range values are clamped.
   */
  static view(actor) {
    const defs = this.definitions(actor);
    const state = actor?.system?.classResources ?? {};
    return defs.map(def => {
      const max   = this.computeMax(def, actor);
      const raw   = state?.[def.id]?.value;
      const value = Math.max(0, Math.min(max, Number.isFinite(raw) ? raw : (def.initial ?? 0)));
      return {
        id: def.id,
        name: def.name,
        description: def.description ?? "",
        icon: def.icon ?? "",
        regain: def.regain,
        value, max, def,
      };
    });
  }

  /**
   * Read a single resource view by id. Returns null if not defined on this actor.
   */
  static get(actor, id) {
    return this.view(actor).find(r => r.id === id) ?? null;
  }

  /**
   * Spend N. Returns false + warns on shortfall.
   */
  static async spend(actor, id, amount = 1) {
    const r = this.get(actor, id);
    if (!r) { ui.notifications?.warn(`Unknown class resource: ${id}`); return false; }
    if (amount <= 0) return true;
    if (r.value < amount) {
      ui.notifications?.warn(`${actor.name}: not enough ${r.name} (have ${r.value}, need ${amount}).`);
      return false;
    }
    await actor.update({ [`system.classResources.${id}.value`]: r.value - amount });
    return true;
  }

  /**
   * Gain N, clamped to max. Returns the new value (post-clamp).
   */
  static async gain(actor, id, amount = 1) {
    const r = this.get(actor, id);
    if (!r) { ui.notifications?.warn(`Unknown class resource: ${id}`); return 0; }
    if (amount <= 0) return r.value;
    const next = Math.min(r.max, r.value + amount);
    await actor.update({ [`system.classResources.${id}.value`]: next });
    return next;
  }

  /**
   * Reset a resource to its `initial`, clamped to max.
   */
  static async reset(actor, id) {
    const r = this.get(actor, id);
    if (!r) return;
    const init = Math.max(0, Math.min(r.max, r.def.initial ?? 0));
    await actor.update({ [`system.classResources.${id}.value`]: init });
  }

  /**
   * Refill a resource to its max (regainAmount = 0 → full refill).
   */
  static async refill(actor, id, amount = 0) {
    const r = this.get(actor, id);
    if (!r) return;
    const delta = amount > 0 ? amount : r.max - r.value;
    if (delta <= 0) return;
    await this.gain(actor, id, delta);
  }

  /**
   * Seed an actor's classResources from the class item's definitions. Called
   * on class drop. Preserves any existing `value` for resources whose id
   * carries over (so re-dropping the same class doesn't reset them).
   */
  static async init(actor, classItem) {
    const defs = classItem?.system?.classResources ?? [];
    if (!defs.length) return;
    const prior = actor.system?.classResources ?? {};
    const next = {};
    for (const def of defs) {
      const existing = prior?.[def.id]?.value;
      next[def.id] = { value: Number.isFinite(existing) ? existing : (def.initial ?? 0) };
    }
    await actor.update({ "system.classResources": next });
  }

  /**
   * Strip all classResources when the class is cleared.
   */
  static async clear(actor) {
    await actor.update({ "system.classResources": {} });
  }

  /* ──────────────────────────────────────────────────────────────────
   * Automated regain hooks — called by TesshariCombat
   * ────────────────────────────────────────────────────────────────── */

  /** Apply a definition's regain policy to the actor right now. */
  static async #applyRegain(actor, def) {
    if (def.resetToInitial) return this.reset(actor, def.id);
    return this.refill(actor, def.id, def.regainAmount ?? 0);
  }

  /** Turn start: per_turn resources regain. */
  static async onTurnStart(actor) {
    for (const def of this.definitions(actor)) {
      if (def.regain === "per_turn") await this.#applyRegain(actor, def);
    }
  }

  /** Combat start: per_combat resources regain. */
  static async onCombatStart(actor) {
    for (const def of this.definitions(actor)) {
      if (def.regain === "per_combat") await this.#applyRegain(actor, def);
    }
  }

  /**
   * Fire on HP change — grants resources whose regainCondition is
   * `below_half_hp` when the actor crosses below half HP. Idempotent: only
   * grants on the transition, not continuously.
   *
   * Caller is responsible for passing the previous HP ratio (for the
   * crossed-the-threshold check).
   */
  static async onHpChange(actor, prevHpValue, prevHpMax) {
    const hp = actor.system?.hp;
    if (!hp) return;
    const nowBelow  = hp.value > 0 && hp.value * 2 <= hp.max;
    const wasBelow  = prevHpValue > 0 && prevHpValue * 2 <= (prevHpMax ?? hp.max);
    if (!nowBelow || wasBelow) return;  // only fire on the transition into below-half

    const defs = this.definitions(actor);
    for (const def of defs) {
      if (def.regain === "on_condition" && def.regainCondition === "below_half_hp") {
        await this.refill(actor, def.id, def.regainAmount ?? 0);
      }
    }
  }
}
