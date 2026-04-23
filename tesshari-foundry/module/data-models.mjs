/**
 * Tesshari DataModels — schemas for Actor and Item sub-types.
 *
 * V12 pattern: extend foundry.abstract.TypeDataModel and return a schema from
 * static defineSchema() built from foundry.data.fields classes. Registered in
 * CONFIG.Actor.dataModels / CONFIG.Item.dataModels from tesshari.mjs.
 */

const { StringField, NumberField, BooleanField, SchemaField, ArrayField, HTMLField, ObjectField } =
  foundry.data.fields;

/* ─── shared field factories ─────────────────────────────────────────── */

const statField = (initial = 3) =>
  new NumberField({ required: true, integer: true, min: 1, max: 10, initial });

const sixStats = () =>
  new SchemaField({
    iron:      statField(3),
    edge:      statField(3),
    frame:     statField(3),
    signal:    statField(3),
    resonance: statField(3),
    veil:      statField(3),
  });

const resourcePool = (initial) =>
  new SchemaField({
    value: new NumberField({ required: true, integer: true, min: 0, initial }),
    max:   new NumberField({ required: true, integer: true, min: 0, initial }),
  });

const requiredHTML = () => new HTMLField({ required: false, blank: true, initial: "" });

/* ─── actor: character ───────────────────────────────────────────────── */

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      stats: sixStats(),
      hp: resourcePool(30),
      ap: resourcePool(3),
      handSize: new NumberField({ required: true, integer: true, min: 1, max: 12, initial: 6 }),
      level: new NumberField({ required: true, integer: true, min: 1, max: 20, initial: 1 }),
      species: new StringField({ required: true, initial: "Forged" }),
      speciesBonusStat: new StringField({ required: false, blank: true, initial: "" }),
      className: new StringField({ required: true, initial: "Ironclad Samurai" }),
      subclass: new StringField({ required: false, blank: true, initial: "" }),
      background: new SchemaField({
        reach:     new StringField({ blank: true, initial: "" }),
        caste:     new StringField({ blank: true, initial: "" }),
        faction:   new StringField({ blank: true, initial: "" }),
        heritage:  new StringField({ blank: true, initial: "" }),
        whoIOwe:   requiredHTML(),
        whatINeed: requiredHTML(),
      }),
      turn: new SchemaField({
        basicAttackUsed:     new BooleanField({ initial: false }),
        reactionUsed:        new BooleanField({ initial: false }),
        cardsPlayedThisTurn: new ArrayField(new StringField()),
        usedThisCombat:      new ArrayField(new StringField()),
        deathSaves: new SchemaField({
          successes: new NumberField({ required: true, integer: true, min: 0, max: 3, initial: 0 }),
          failures:  new NumberField({ required: true, integer: true, min: 0, max: 3, initial: 0 }),
        }),
      }),
      // Derived-at-runtime pools for Guard/Shield so sheets can display them
      // without walking the ActiveEffect collection every render.
      pools: new SchemaField({
        guard:  new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        shield: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      }),
      // Per-class resource tracking. Keys are resource ids (e.g. "between_points").
      // Shape: { value: number }. `max` is derived each render from the class
      // definition + current stats, so it stays in sync as stats change.
      classResources: new ObjectField({ initial: {} }),
      biography: requiredHTML(),
      notes:     requiredHTML(),
    };
  }
}

/* ─── actor: monster ─────────────────────────────────────────────────── */

export class MonsterDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      stats: sixStats(),
      hp: resourcePool(20),
      ap: resourcePool(2),
      handSize: new NumberField({ required: true, integer: true, min: 1, max: 12, initial: 4 }),
      role: new StringField({
        required: true,
        initial: "skirmisher",
        choices: ["skirmisher", "brute", "controller", "support", "boss"],
      }),
      tier: new StringField({
        required: true,
        initial: "standard",
        choices: ["minion", "standard", "elite", "boss"],
      }),
      threatState: new StringField({
        required: true,
        initial: "neutral",
        choices: ["neutral", "pressured", "advantaged", "desperate"],
      }),
      targetLock: new StringField({ blank: true, initial: "" }),
      immunities:  new ArrayField(new StringField()),
      resistances: new ArrayField(new StringField()),
      senses:      new ArrayField(new StringField()),
      turn: new SchemaField({
        basicAttackUsed:     new BooleanField({ initial: false }),
        reactionUsed:        new BooleanField({ initial: false }),
        cardsPlayedThisTurn: new ArrayField(new StringField()),
        usedThisCombat:      new ArrayField(new StringField()),
      }),
      pools: new SchemaField({
        guard:  new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        shield: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      }),
      biography: requiredHTML(),
      ai:        requiredHTML(),
    };
  }
}

/* ─── actor: npc ─────────────────────────────────────────────────────── */

export class NpcDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      faction: new StringField({ blank: true, initial: "" }),
      reach:   new StringField({ blank: true, initial: "" }),
      caste:   new StringField({ blank: true, initial: "" }),
      biography: requiredHTML(),
      notes:     requiredHTML(),
    };
  }
}

/* ─── item: card ─────────────────────────────────────────────────────── */

export class CardDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      tier: new NumberField({ required: true, integer: true, min: 0, max: 4, initial: 1 }),
      apCost: new NumberField({ required: true, integer: true, min: 0, max: 4, initial: 1 }),
      category: new StringField({
        required: true,
        initial: "attack",
        choices: [
          "attack", "defense", "control", "power", "reaction",
          "passive", "mobility", "utility", "signature", "boss",
        ],
      }),
      primaryStat: new StringField({
        required: false, blank: true, initial: "",
        choices: ["", "iron", "edge", "frame", "signal", "resonance", "veil", "mixed"],
      }),
      baseDamage: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      pierce:     new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      keywords:   new ArrayField(new StringField()),
      unlockLevel: new NumberField({ required: true, integer: true, min: 1, max: 20, initial: 1 }),
      className:  new StringField({ blank: true, initial: "" }),
      subclass:   new StringField({ blank: true, initial: "" }),
      isRaceCard: new BooleanField({ initial: false }),
      race:       new StringField({ blank: true, initial: "" }),
      isStartingHand: new BooleanField({ initial: false }),
      isReaction:     new BooleanField({ initial: false }),
      usesPerCombat:  new NumberField({ required: false, nullable: true, integer: true, min: 0, initial: null }),
      description: requiredHTML(),
    };
  }
}

/* ─── item: race ─────────────────────────────────────────────────────── */

export class RaceDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      statBonuses: new ObjectField({ initial: {} }),       // { iron: 1, edge: 0, ... , any: 1 }
      handMod: new NumberField({ required: true, integer: true, min: -2, max: 2, initial: 0 }),
      heritageBranches: new ArrayField(new StringField()),
      raceCardSlugs: new ArrayField(new StringField()),
      passives:    requiredHTML(),
      description: requiredHTML(),
    };
  }
}

/* ─── item: class ────────────────────────────────────────────────────── */

/**
 * Class resource definition — per-class "charge pool" that gives the class a
 * unique on-sheet mechanic (Between Points, Forge Charges, Void Charges, etc.).
 * Max can be flat, stat-derived, or stat + flat bonus. Regain is automated for
 * per_turn / per_combat; short_rest / long_rest / on_condition are hooks the
 * sheet and combat engine invoke on the right triggers.
 */
const classResourceField = () => new ArrayField(new SchemaField({
  id:          new StringField({ required: true, blank: false }),  // slug, unique within class
  name:        new StringField({ required: true, blank: false }),  // display name
  description: new StringField({ blank: true, initial: "" }),
  icon:        new StringField({ blank: true, initial: "" }),

  initial:  new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

  // max derivation: "flat" → maxValue; "stat" → stats[maxStat]; "stat_plus" → stats[maxStat] + maxValue
  maxMode: new StringField({
    required: true, initial: "flat",
    choices: ["flat", "stat", "stat_plus"],
  }),
  maxValue: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
  maxStat:  new StringField({
    blank: true, initial: "",
    choices: ["", "iron", "edge", "frame", "signal", "resonance", "veil"],
  }),

  // regain automation
  regain: new StringField({
    required: true, initial: "manual",
    choices: ["manual", "per_turn", "per_combat", "short_rest", "long_rest", "on_condition"],
  }),
  regainAmount: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),  // 0 = refill to max
  regainCondition: new StringField({
    blank: true, initial: "",
    choices: ["", "below_half_hp", "on_hit_dealt", "on_hit_taken", "on_kill"],
  }),
  // If true, per_turn / per_combat / short_rest regain resets to `initial`
  // instead of refilling. Used by classes where the pool is earned during
  // combat (e.g. Echo Speaker's Resonance Echoes).
  resetToInitial: new BooleanField({ initial: false }),
}));

export class ClassDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      hpTier: new StringField({
        required: true,
        initial: "balanced",
        choices: ["heavy", "martial", "balanced", "technical", "social", "unique"],
      }),
      handBase: new NumberField({ required: true, integer: true, min: 3, max: 12, initial: 6 }),
      primaryStats: new ArrayField(new StringField()), // ["iron","resonance"]
      startingHandSlugs: new ArrayField(new StringField()),
      unlockList: new ObjectField({ initial: {} }),    // { "1": [...], "2": [...], ... }
      subclassSlugs: new ArrayField(new StringField()),
      classResources: classResourceField(),
      description: requiredHTML(),
    };
  }
}

/* ─── item: subclass ─────────────────────────────────────────────────── */

export class SubclassDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      className: new StringField({ required: true, initial: "" }),
      pathKey:   new StringField({ required: true, initial: "" }),
      features: new ObjectField({ initial: {} }),       // { "3": "text", "6": "text", ... }
      description: requiredHTML(),
    };
  }
}

/* ─── item: cybernetic ───────────────────────────────────────────────── */

export class CyberneticDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      slot: new StringField({ blank: true, initial: "" }),
      statMods: new ObjectField({ initial: {} }),       // { iron: 1, signal: 2 }
      handMod:  new NumberField({ required: true, integer: true, min: -2, max: 2, initial: 0 }),
      cardUnlockSlug: new StringField({ blank: true, initial: "" }),
      equipped: new BooleanField({ initial: false }),
      description: requiredHTML(),
    };
  }
}

/* ─── items: gear (weapon / armor / consumable) ──────────────────────── */

/**
 * Card modification shape — used by weapons, armor, consumables.
 * Each mod is a free-form object so per-card rules can be encoded without
 * a combinatorial explosion of typed fields. Interpreted by the card engine.
 * Example: { targetCardSlug: "vein_strike", damageBonus: 3 }
 */
const cardModsField = () => new ArrayField(new ObjectField());

export class WeaponDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      weaponType: new StringField({ blank: true, initial: "" }),
      equipped:  new BooleanField({ initial: false }),
      cardMods:  cardModsField(),
      description: requiredHTML(),
    };
  }
}

export class ArmorDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      armorType: new StringField({ blank: true, initial: "" }),
      equipped:  new BooleanField({ initial: false }),
      cardMods:  cardModsField(),
      description: requiredHTML(),
    };
  }
}

export class ConsumableDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      charges: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
      maxCharges: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
      cardMods: cardModsField(),
      description: requiredHTML(),
    };
  }
}

/* ─── item: status (reference entry, not the runtime ActiveEffect) ───── */

export class StatusDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      statusType: new StringField({
        required: true,
        initial: "debuff",
        choices: ["buff", "debuff", "state", "modifier", "action"],
      }),
      stackable: new BooleanField({ initial: false }),
      stripsGuard: new BooleanField({ initial: false }),
      ignoresGuard: new BooleanField({ initial: false }),
      summary: new StringField({ blank: true, initial: "" }),
      description: requiredHTML(),
    };
  }
}
