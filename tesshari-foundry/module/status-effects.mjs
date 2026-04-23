/**
 * Tesshari Status Engine
 * ----------------------
 * Implements the 15 Tesshari keywords on top of Foundry's ActiveEffect system,
 * plus Down/Dying HP states.
 *
 * Model: one ActiveEffect per (actor, statusId) pair. Stack count lives in
 * `effect.flags.tesshari.stacks`. Duration uses `effect.duration.rounds` /
 * `.turns`. Stack semantics, tick behavior, and removal rules come from the
 * TESSHARI_STATUSES table below — authoritative source for the engine.
 *
 * All damage/healing/stack changes route through StatusEngine static methods
 * so we have one place that enforces rules. Sheets and the damage pipeline
 * query via `StatusEngine.stacksOf(actor, id)`, never by reaching into effects
 * directly.
 *
 * References:
 *   ../../system/02_keywords_and_status.md     — canonical rules text
 *   ../../foundry_notes/01_api_followups.md §4  — ActiveEffect API notes
 */

const SYSTEM_ID = "tesshari";

/* ────────────────────────────────────────────────────────────────────────
 * Status definition table
 * ────────────────────────────────────────────────────────────────────────
 * Each entry drives CONFIG.statusEffects AND the engine's per-status logic.
 *
 *   id              lowercase identifier used by Foundry + the engine
 *   name            i18n key for display
 *   img             icon path (Foundry's built-in svg set — placeholders)
 *   type            "buff" | "debuff" | "state"
 *   stacking        true → stacks combine additively; false → binary
 *   durationKind    "none" | "turns" | "rounds" | "until-consumed"
 *   defaultDuration default duration value when not specified by card
 *   flags.tesshari  hints for UI / engine (summary, tickHook, ignoresGuard)
 *
 * NOTE: changes[] is intentionally left empty on each entry. ActiveEffect
 * data-modification changes don't model stack-driven math well; we do the
 * math in the damage pipeline instead. Effects exist to carry the status
 * icon, the stack count, and the duration.
 */

export const TESSHARI_STATUSES = [
  // ─── buffs ──────────────────────────────────────────────────────────
  {
    id: "guard",
    name: "TESSHARI.Status.Guard",
    img: "icons/svg/shield.svg",
    type: "buff",
    stacking: true,
    durationKind: "until-consumed",
    summary: "Absorbs N damage; expires at next turn start unless persistent.",
  },
  {
    id: "shield",
    name: "TESSHARI.Status.Shield",
    img: "icons/svg/mage-shield.svg",
    type: "buff",
    stacking: true,
    durationKind: "until-consumed",
    summary: "Absorbs N damage; persists across turns until depleted.",
  },
  {
    id: "fortify",
    name: "TESSHARI.Status.Fortify",
    img: "icons/svg/upgrade.svg",
    type: "buff",
    stacking: false,
    durationKind: "rounds",
    defaultDuration: 1,
    summary: "1 round — single-stack control fails, multi-stack halved.",
  },
  {
    id: "regen",
    name: "TESSHARI.Status.Regen",
    img: "icons/svg/regen.svg",
    type: "buff",
    stacking: true,
    durationKind: "turns",
    defaultDuration: 2,
    tickHook: "start-of-turn",
    summary: "Recover N HP at turn start per stack.",
  },
  {
    id: "veil",
    name: "TESSHARI.Status.Veil",
    img: "icons/svg/invisible.svg",
    type: "buff",
    stacking: false,
    durationKind: "until-consumed",
    summary: "First hostile card targeting you loses riders (consumed).",
  },

  // ─── debuffs ────────────────────────────────────────────────────────
  {
    id: "bleed",
    name: "TESSHARI.Status.Bleed",
    img: "icons/svg/blood.svg",
    type: "debuff",
    stacking: true,
    durationKind: "none",
    tickHook: "end-of-turn",
    ignoresGuard: true,
    summary: "N damage at turn end; ignores Guard.",
  },
  {
    id: "burn",
    name: "TESSHARI.Status.Burn",
    img: "icons/svg/fire.svg",
    type: "debuff",
    stacking: true,
    durationKind: "none",
    tickHook: "end-of-turn",
    stripsGuard: true,
    summary: "N damage at turn end; strips Guard first.",
  },
  {
    id: "expose",
    name: "TESSHARI.Status.Expose",
    img: "icons/svg/target.svg",
    type: "debuff",
    stacking: true,
    durationKind: "none",
    summary: "+N to incoming damage (additive, post-mitigation).",
  },
  {
    id: "vulnerable",
    name: "TESSHARI.Status.Vulnerable",
    img: "icons/svg/pawn.svg",
    type: "debuff",
    stacking: true,
    durationKind: "none",
    summary: "Incoming damage × (1 + 0.1·N).",
  },
  {
    id: "overheat",
    name: "TESSHARI.Status.Overheat",
    img: "icons/svg/stoned.svg",
    type: "debuff",
    stacking: true,
    durationKind: "none",
    summary: "3+ stacks: −1 AP Max; 6+: −2.",
  },
  {
    id: "stagger",
    name: "TESSHARI.Status.Stagger",
    img: "icons/svg/daze.svg",
    type: "debuff",
    stacking: false,
    durationKind: "turns",
    defaultDuration: 1,
    summary: "Cannot play Tier 2–3 cards this turn.",
  },
  {
    id: "root",
    name: "TESSHARI.Status.Root",
    img: "icons/svg/net.svg",
    type: "debuff",
    stacking: false,
    durationKind: "turns",
    defaultDuration: 1,
    summary: "Cannot play Mobility cards this turn.",
  },
  {
    id: "silence",
    name: "TESSHARI.Status.Silence",
    img: "icons/svg/silenced.svg",
    type: "debuff",
    stacking: false,
    durationKind: "turns",
    defaultDuration: 1,
    summary: "Cannot play Signal or Resonance cards this turn.",
  },
  {
    id: "taunt",
    name: "TESSHARI.Status.Taunt",
    img: "icons/svg/sound.svg",
    type: "debuff",
    stacking: false,
    durationKind: "rounds",
    defaultDuration: 1,
    summary: "Must target the taunter if able.",
  },
  {
    id: "mark",
    name: "TESSHARI.Status.Mark",
    img: "icons/svg/eye.svg",
    type: "debuff",
    stacking: false,
    durationKind: "none",
    summary: "Tagged for Mark-synergy effects.",
  },

  // ─── HP states ──────────────────────────────────────────────────────
  {
    id: "down",
    name: "TESSHARI.Status.Down",
    img: "icons/svg/falling.svg",
    type: "state",
    stacking: false,
    durationKind: "none",
    summary: "At 0 HP — unconscious.",
  },
  {
    id: "dying",
    name: "TESSHARI.Status.Dying",
    img: "icons/svg/skull.svg",
    type: "state",
    stacking: false,
    durationKind: "none",
    summary: "Making death saves.",
  },
];

/**
 * Build the CONFIG.statusEffects array from the table above. Registered from
 * the `init` hook in tesshari.mjs.
 */
export function buildStatusEffectsConfig() {
  return TESSHARI_STATUSES.map(def => ({
    id: def.id,
    name: def.name,
    img: def.img,
    changes: [],
    flags: {
      [SYSTEM_ID]: {
        type:         def.type,
        stacking:     def.stacking,
        durationKind: def.durationKind,
        defaultDuration: def.defaultDuration ?? null,
        summary:      def.summary,
        tickHook:     def.tickHook     ?? null,
        ignoresGuard: def.ignoresGuard ?? false,
        stripsGuard:  def.stripsGuard  ?? false,
      },
    },
  }));
}

/** Lookup table for fast access. */
const BY_ID = Object.fromEntries(TESSHARI_STATUSES.map(s => [s.id, s]));

/* ────────────────────────────────────────────────────────────────────────
 * StatusEngine — the programmatic surface for all status changes.
 * ──────────────────────────────────────────────────────────────────────── */

export class StatusEngine {

  /** Get the status definition, or null if unknown. */
  static definition(statusId) {
    return BY_ID[statusId] ?? null;
  }

  /** Find the ActiveEffect on the actor matching this status id, or null. */
  static findEffect(actor, statusId) {
    if (!actor) return null;
    return actor.effects.find(e => e.statuses.has(statusId)) ?? null;
  }

  /** Stack count for this status on the actor; 0 if not present. */
  static stacksOf(actor, statusId) {
    const effect = this.findEffect(actor, statusId);
    if (!effect) return 0;
    return effect.flags?.[SYSTEM_ID]?.stacks ?? 1;
  }

  /** Presence check — true if any stack exists. */
  static hasStatus(actor, statusId) {
    return !!this.findEffect(actor, statusId);
  }

  /**
   * Apply a status. Stacks combine for stacking types; non-stacking types
   * refresh duration. Duration defaults from the status definition if not
   * explicitly passed.
   *
   * @param {Actor} actor
   * @param {string} statusId
   * @param {number} [stacks=1]      stacks to add (ignored for non-stacking)
   * @param {number|null} [duration] rounds or turns depending on durationKind
   * @returns {ActiveEffect}
   */
  static async apply(actor, statusId, stacks = 1, duration = null) {
    if (!actor) {
      const msg = `StatusEngine.apply: actor is ${actor}. Did you select a token / set a target?`;
      ui.notifications?.error(msg);
      throw new Error(msg);
    }
    const def = this.definition(statusId);
    if (!def) {
      const msg = `Unknown Tesshari status: ${statusId}`;
      ui.notifications?.error(msg);
      throw new Error(msg);
    }

    const existing = this.findEffect(actor, statusId);
    const useDuration = duration ?? def.defaultDuration ?? null;

    if (existing) {
      const current = existing.flags?.[SYSTEM_ID]?.stacks ?? 1;
      const newStacks = def.stacking ? current + stacks : 1;
      await existing.update({
        [`flags.${SYSTEM_ID}.stacks`]: newStacks,
        duration: this.#buildDuration(def, useDuration),
      });
      return existing;
    }

    const [created] = await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: game.i18n.localize(def.name),
      img: def.img,
      statuses: [statusId],
      duration: this.#buildDuration(def, useDuration),
      changes: [],
      flags: {
        [SYSTEM_ID]: {
          stacks: def.stacking ? stacks : 1,
          type:         def.type,
          stacking:     def.stacking,
          durationKind: def.durationKind,
          summary:      def.summary,
          ignoresGuard: def.ignoresGuard ?? false,
          stripsGuard:  def.stripsGuard  ?? false,
        },
      },
    }]);
    return created;
  }

  /** Remove N stacks of a status, or delete entirely if stacks drop to 0. */
  static async reduce(actor, statusId, stacks = 1) {
    const effect = this.findEffect(actor, statusId);
    if (!effect) return;
    const current = effect.flags?.[SYSTEM_ID]?.stacks ?? 1;
    const next = current - stacks;
    if (next <= 0) {
      await effect.delete();
    } else {
      await effect.update({ [`flags.${SYSTEM_ID}.stacks`]: next });
    }
  }

  /** Remove all stacks of a status from the actor. */
  static async remove(actor, statusId) {
    const effect = this.findEffect(actor, statusId);
    if (effect) await effect.delete();
  }

  /**
   * Cleanse — remove up to `count` debuffs. For Overheat specifically, a
   * single Cleanse removes ALL Overheat stacks (rule §Section 3).
   * @returns {string[]} ids of statuses that were fully removed
   */
  static async cleanse(actor, count = 1, { preferId = null } = {}) {
    const debuffs = actor.effects.filter(e => {
      const t = e.flags?.[SYSTEM_ID]?.type;
      return t === "debuff";
    });

    // Prefer removing the specified status if present
    if (preferId) {
      const hit = debuffs.find(e => e.statuses.has(preferId));
      if (hit) { await hit.delete(); return [preferId]; }
    }

    const removed = [];
    for (const effect of debuffs) {
      if (removed.length >= count) break;
      await effect.delete();
      removed.push([...effect.statuses][0]);
    }
    return removed;
  }

  /** Dispel — remove up to `count` buffs from a target. */
  static async dispel(actor, count = 1, { preferId = null } = {}) {
    const buffs = actor.effects.filter(e => e.flags?.[SYSTEM_ID]?.type === "buff");

    if (preferId) {
      const hit = buffs.find(e => e.statuses.has(preferId));
      if (hit) { await hit.delete(); return [preferId]; }
    }

    const removed = [];
    for (const effect of buffs) {
      if (removed.length >= count) break;
      await effect.delete();
      removed.push([...effect.statuses][0]);
    }
    return removed;
  }

  /* ──────────────────────────────────────────────────────────────────
   * Tick helpers — invoked from TesshariCombat turn hooks.
   * ────────────────────────────────────────────────────────────────── */

  /** Turn start: heal Regen stacks. Runs before the turn's actions. */
  static async tickRegen(actor) {
    const regen = this.findEffect(actor, "regen");
    if (!regen) return 0;
    const amount = regen.flags?.[SYSTEM_ID]?.stacks ?? 0;
    if (amount <= 0) return 0;

    const hp = actor.system.hp;
    const newValue = Math.min(hp.value + amount, hp.max);
    const healed = newValue - hp.value;
    if (healed > 0) {
      await actor.update({ "system.hp.value": newValue });
    }
    return healed;
  }

  /**
   * Turn end tick 1: Bleed deals flat damage, ignores Guard.
   * Returns damage dealt for chat logging.
   */
  static async tickBleed(actor) {
    const bleed = this.findEffect(actor, "bleed");
    if (!bleed) return 0;
    const amount = bleed.flags?.[SYSTEM_ID]?.stacks ?? 0;
    if (amount <= 0) return 0;

    const hp = actor.system.hp;
    await actor.update({ "system.hp.value": Math.max(0, hp.value - amount) });
    return amount;
  }

  /**
   * Turn end tick 2: Burn strips Guard first, remainder to HP.
   * Runs after Bleed (rules order).
   */
  static async tickBurn(actor) {
    const burn = this.findEffect(actor, "burn");
    if (!burn) return { guardStripped: 0, hpDamage: 0 };

    let amount = burn.flags?.[SYSTEM_ID]?.stacks ?? 0;
    if (amount <= 0) return { guardStripped: 0, hpDamage: 0 };

    const guardStacks = this.stacksOf(actor, "guard");
    let guardStripped = 0;

    if (guardStacks > 0) {
      guardStripped = Math.min(guardStacks, amount);
      await this.reduce(actor, "guard", guardStripped);
      amount -= guardStripped;
    }

    let hpDamage = 0;
    if (amount > 0) {
      const hp = actor.system.hp;
      hpDamage = Math.min(amount, hp.value);
      await actor.update({ "system.hp.value": hp.value - hpDamage });
    }

    return { guardStripped, hpDamage };
  }

  /**
   * Decrement duration on every effect that has one; delete expired.
   * Rounds tick at end-of-round; turns tick at end-of-turn. This method
   * handles the "turns" decrement; call at end of turn.
   */
  static async tickTurnDurations(actor) {
    for (const effect of actor.effects) {
      const dur = effect.duration;
      if (!dur?.turns || dur.turns <= 0) continue;
      const remaining = dur.turns - 1;
      if (remaining <= 0) {
        await effect.delete();
      } else {
        await effect.update({ "duration.turns": remaining });
      }
    }
  }

  /** End-of-round: decrement round-scoped durations. */
  static async tickRoundDurations(actor) {
    for (const effect of actor.effects) {
      const dur = effect.duration;
      if (!dur?.rounds || dur.rounds <= 0) continue;
      const remaining = dur.rounds - 1;
      if (remaining <= 0) {
        await effect.delete();
      } else {
        await effect.update({ "duration.rounds": remaining });
      }
    }
  }

  /** Overheat penalty to AP Max (−1 at 3+, −2 at 6+). */
  static overheatPenalty(actor) {
    const stacks = this.stacksOf(actor, "overheat");
    if (stacks >= 6) return 2;
    if (stacks >= 3) return 1;
    return 0;
  }

  /* ──────────────────────────────────────────────────────────────────
   * Internal helpers
   * ────────────────────────────────────────────────────────────────── */

  static #buildDuration(def, value) {
    if (!value || def.durationKind === "none" || def.durationKind === "until-consumed") {
      return { rounds: null, turns: null };
    }
    if (def.durationKind === "rounds") return { rounds: value, turns: null };
    if (def.durationKind === "turns")  return { rounds: null, turns: value };
    return { rounds: null, turns: null };
  }
}
