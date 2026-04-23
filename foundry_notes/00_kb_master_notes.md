# Foundry VTT Knowledge Base — Master Notes for Tesshari

Source: https://foundryvtt.com/kb/ (fetched 2026-04-23).
This is my working reference while building the Tesshari system. Facts here come straight from the KB; Tesshari-specific implications are called out as **Tesshari:**.

---

## 0. Target version

- Foundry ships in four channels: **Stable / Testing / Development / Prototype**. Build against Stable.
- Each manifest declares `compatibility.{minimum, verified, maximum}`. `minimum` and `maximum` are hard-enforced; `verified` is guidance.
- KB hedges on "which version to target today" — V10+ introduced DataModels, V11+ added module sub-types, V12+ redesigned Audio/Grid/Primary Canvas Objects. KB examples use V11/V12.
- **Tesshari:** target **V12** (verified) with `minimum: 12`. Revisit after V13 stabilizes.

---

## 1. Package layout (system vs module)

A **System** = game rules (Actor/Item types, core mechanics). Tesshari is a system.
A **Module** = plug-in that rides on top of a system.

### System file structure (recommended)

```
{userData}/Data/systems/tesshari/
├── system.json                 # required manifest
├── tesshari.mjs                # entry point
├── module/
│   ├── data-models.mjs
│   └── documents.mjs
├── styles/
│   └── tesshari.css
├── packs/                      # LevelDB compendium packs
│   ├── cards/
│   ├── items/
│   ├── monsters/
│   ├── classes/
│   └── races/
├── lang/
│   └── en.json
└── templates/                  # Handlebars sheets
    ├── actor/
    └── item/
```

Rules:
- Folder name **must match** `system.json → id` exactly.
- Use lowercase hyphen-separated file/folder names.
- CSS + language paths are relative to system root.

---

## 2. `system.json` manifest

### Required fields

```json
{
  "id": "tesshari",
  "title": "Tesshari",
  "description": "Deterministic card-based cyberpunk TTRPG — Broken Reaches setting.",
  "version": "0.1.0"
}
```

`id` must be all-lowercase, no special characters, match folder name.

### Key optional fields

| Field | Purpose |
|---|---|
| `compatibility.{minimum,verified,maximum}` | Foundry version gating |
| `esmodules` | JS entry points (ES modules) |
| `scripts` | Legacy JS scripts (prefer esmodules) |
| `styles` | CSS files |
| `languages` | `[{lang, name, path}]` |
| `packs` | Compendium pack declarations |
| `documentTypes` | Actor/Item sub-types + their htmlFields/filePathFields |
| `primaryTokenAttribute` | Default token bar 1 (e.g. `"resources.health"`) |
| `secondaryTokenAttribute` | Default token bar 2 |
| `initiative` | Default initiative formula |
| `grid` | `{distance, units}` |
| `url` / `manifest` / `download` | Distribution URLs |
| `relationships` | Dependencies on other packages |

### `documentTypes` example (Tesshari-flavored)

```json
"documentTypes": {
  "Actor": {
    "character": { "htmlFields": ["biography", "notes"] },
    "monster":   { "htmlFields": ["biography", "ai"] },
    "npc":       { "htmlFields": ["biography"] }
  },
  "Item": {
    "card":       { "htmlFields": ["description"] },
    "race":       { "htmlFields": ["description"] },
    "class":      { "htmlFields": ["description"] },
    "subclass":   { "htmlFields": ["description"] },
    "cybernetic": { "htmlFields": ["description"] },
    "weapon":     { "htmlFields": ["description"] },
    "armor":      { "htmlFields": ["description"] },
    "consumable": { "htmlFields": ["description"] },
    "status":     { "htmlFields": ["description"] }
  }
}
```

### Deprecated manifest fields (DO NOT USE)

| Old | New |
|---|---|
| `name` | `id` |
| `author` | `authors` (array) |
| `minimumCoreVersion` / `compatibleCoreVersion` | `compatibility` |
| `dependencies` | `relationships` |
| old `permission` | `ownership` |

---

## 3. DataModels (the modern schema API)

DataModels **replace** `template.json`. Build schemas with `foundry.data.fields` classes under a `TypeDataModel` subclass.

### Available field types

- `StringField` — text, with `{required, blank, choices}`
- `NumberField` — `{required, integer, min, max, initial}`
- `BooleanField`
- `SchemaField({ ... })` — nested object
- `ArrayField(innerField)` — ordered list of one type
- `ObjectField` — free-form object
- `HTMLField` — sanitized HTML
- `FilePathField({categories: ["IMAGE" | "AUDIO" | "VIDEO"]})` — extracts base64 → files
- `EmbeddedCollectionField` — embedded docs (rare for TypeDataModel)

### Example — Tesshari `character` actor

```javascript
import {
  StringField, NumberField, BooleanField, SchemaField, ArrayField, HTMLField
} from "foundry.data.fields";

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const stat = (init) => new NumberField({ required: true, integer: true, min: 1, max: 10, initial: init });

    return {
      stats: new SchemaField({
        iron:      stat(3),
        edge:      stat(3),
        frame:     stat(3),
        signal:    stat(3),
        resonance: stat(3),
        veil:      stat(3)
      }),
      hp: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 30 }),
        max:   new NumberField({ required: true, integer: true, min: 0, initial: 30 })
      }),
      ap: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
        max:   new NumberField({ required: true, integer: true, min: 0, initial: 3 })
      }),
      handSize: new NumberField({ required: true, integer: true, min: 1, max: 12, initial: 6 }),
      level:    new NumberField({ required: true, integer: true, min: 1, max: 20, initial: 1 }),
      species:  new StringField({ required: true, initial: "Forged" }),
      className: new StringField({ required: true, initial: "Ironclad Samurai" }),
      subclass: new StringField({ required: false, blank: true }),
      background: new SchemaField({
        reach:     new StringField({ blank: true }),
        caste:     new StringField({ blank: true }),
        faction:   new StringField({ blank: true }),
        whoIOwe:   new HTMLField({ blank: true }),
        whatINeed: new HTMLField({ blank: true })
      }),
      turn: new SchemaField({
        basicAttackUsed: new BooleanField({ initial: false }),
        reactionUsed:    new BooleanField({ initial: false }),
        cardsPlayedThisTurn: new ArrayField(new StringField()),
        usedThisCombat:      new ArrayField(new StringField())
      }),
      biography: new HTMLField({ blank: true }),
      notes:     new HTMLField({ blank: true })
    };
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    // clamp HP/AP
    this.hp.value = Math.clamp(this.hp.value, 0, this.hp.max);
    this.ap.value = Math.clamp(this.ap.value, 0, this.ap.max);
  }

  static migrateData(source) {
    // e.g., rename a field in a future version
    return super.migrateData(source);
  }
}
```

### Registering DataModels

```javascript
Hooks.once("init", () => {
  CONFIG.Actor.dataModels = {
    character: CharacterDataModel,
    monster:   MonsterDataModel,
    npc:       NpcDataModel
  };
  CONFIG.Item.dataModels = {
    card:       CardDataModel,
    race:       RaceDataModel,
    class:      ClassDataModel,
    subclass:   SubclassDataModel,
    cybernetic: CyberneticDataModel,
    weapon:     WeaponDataModel,
    armor:      ArmorDataModel,
    consumable: ConsumableDataModel,
    status:     StatusDataModel
  };
});
```

### Access pattern

- System data lives at `actor.system.<field>`.
- Methods can live directly on the DataModel class; access parent via `this.parent`.
- `prepareDerivedData()` runs on every document update — put clamping, derived totals, formula resolution here.
- `migrateData(source)` runs when loading from disk and on every update delta.

---

## 4. Custom Actor / Item document classes

Extend the base `Actor` / `Item` for system-specific methods. Register via `CONFIG.Actor.documentClass`.

```javascript
// documents.mjs
export class TesshariActor extends Actor {

  async spendAP(cost) {
    const ap = this.system.ap;
    if (ap.value < cost) {
      ui.notifications.warn("Not enough AP.");
      return false;
    }
    await this.update({ "system.ap.value": ap.value - cost });
    return true;
  }

  async applyDamage(raw, opts = {}) {
    // Tesshari 7-step pipeline lives here (see §11)
    const dmg = await TesshariDamage.resolve(this, raw, opts);
    await this.update({ "system.hp.value": this.system.hp.value - dmg });
    return dmg;
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    // Any cross-field derived calculation.
  }
}

export class TesshariItem extends Item {
  get isCard() { return this.type === "card"; }
}
```

```javascript
// tesshari.mjs
Hooks.once("init", () => {
  CONFIG.Actor.documentClass = TesshariActor;
  CONFIG.Item.documentClass  = TesshariItem;
  // ...register DataModels
});
```

---

## 5. Entry point (`tesshari.mjs`)

```javascript
import { TesshariActor, TesshariItem } from "./module/documents.mjs";
import * as models from "./module/data-models.mjs";

Hooks.once("init", () => {
  CONFIG.Actor.documentClass = TesshariActor;
  CONFIG.Item.documentClass  = TesshariItem;

  CONFIG.Actor.dataModels = {
    character: models.CharacterDataModel,
    monster:   models.MonsterDataModel,
    npc:       models.NpcDataModel
  };
  CONFIG.Item.dataModels = {
    card:       models.CardDataModel,
    // ...etc
  };

  CONFIG.Actor.trackableAttributes = {
    character: { bar: ["hp", "ap"], value: ["level", "handSize"] },
    monster:   { bar: ["hp", "ap"], value: ["stats.iron"] }
  };

  CONFIG.statusEffects = TESSHARI_STATUS_EFFECTS;  // see §9
  CONFIG.Combat.initiative = { formula: "@system.stats.edge", decimals: 2 };

  // Register sheets
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("tesshari", TesshariCharacterSheet, {
    types: ["character"], makeDefault: true
  });
  // ...etc for monster, npc, each item type
});

Hooks.once("ready", () => {
  console.log("Tesshari | Ready");
});
```

Debug tip: `CONFIG.debug.hooks = true;` logs every hook.

---

## 6. Actors

- `Actor` is a top-level Document; `Token` is its visual representation on scenes.
- **Prototype Token**: config on the actor sheet → defaults for new tokens.
- **Placed Token**: independent once on canvas unless "Link Actor Data" is enabled.
- Actors support token bars that reference system attributes with `value`+`max`.
- Items added to an actor become **Owned Items** — a separate copy from the world item. Changes don't sync back.
- Permission levels: None / Limited / Observer / Owner.

**Tesshari mappings:**
- `character` = PC
- `monster` = statblocks with Monster Role (Skirmisher/Brute/Controller/Support/Boss)
- `npc` = non-combatants
- Owned Items on a character = equipped gear + unlocked cards (hand) + race/class/subclass markers

---

## 7. Items

- Item types are system-defined.
- Items embedded on actors are distinct from the compendium/world original.
- ItemSheet is customizable per type.
- Item data lives at `item.system.<field>`.

**Tesshari item types:**

| Type | Purpose |
|---|---|
| `card` | The atomic card — tier, AP cost, keywords, damage formula, category, primary stat, unlock level, class/subclass |
| `race` | Passive traits + race card references |
| `class` | HP tier, hand base, primary stats, starting hand, unlock list (array of card slugs per level) |
| `subclass` | Features at L3/6/10/14/18 |
| `cybernetic` | Enhancement — modifies stats or hand size |
| `weapon` / `armor` | Gear that modifies card stats |
| `consumable` | Single-use items |
| `status` | Compendium entry describing each keyword for players (not the ActiveEffect itself) |

---

## 8. Active Effects — the key to Tesshari's 15 statuses

ActiveEffects apply temporary modifications to actor data without mutating the underlying values — remove the effect and original data restores.

### Sources of effects

1. **Actor-level** — bonus movement, stance buffs
2. **Condition-level** — toggle from Token HUD (this is where Tesshari statuses live)
3. **Item-level** — transfer when item added to actor

### Change modes

| Mode | Effect |
|---|---|
| **ADD** (2) | `+value` (use `-` prefix to subtract) |
| **MULTIPLY** (1) | `× value` |
| **OVERRIDE** (5) | replace |
| **DOWNGRADE** (3) | lower only |
| **UPGRADE** (4) | raise only |
| **CUSTOM** (0) | dispatches to a system/module hook |

### Attribute Key syntax

Dot-notation path into `actor.system` — e.g. `system.ap.max` or `system.stats.iron`.

### Tesshari statuses as ActiveEffects

Each of the 15 keywords (Guard, Shield, Fortify, Regen, Veil, Bleed, Burn, Expose, Vulnerable, Overheat, Stagger, Root, Silence, Taunt, Mark) becomes an ActiveEffect definition registered in `CONFIG.statusEffects`. Stacking statuses (Guard X, Bleed X…) store their stack count in `effect.system.stacks` or `effect.flags.tesshari.stacks` and use CUSTOM change mode to dispatch to the damage pipeline.

### Token HUD status icons

Registered via:

```javascript
CONFIG.statusEffects = [
  {
    id: "guard",
    name: "TESSHARI.Status.Guard",
    img: "systems/tesshari/icons/status/guard.svg",
    changes: [{ key: "system.guardPool", mode: 2, value: "1" }],
    flags: { tesshari: { type: "buff", stacking: true } }
  },
  // ...15 total
];
```

Then right-click token → toggle icons in the upper-left overlay.

---

## 9. Combat Tracker

- `Combat` document contains `Combatant` documents.
- Toggle combat state via right-click on token.
- Initiative formula from system's `CONFIG.Combat.initiative` or overridable per combatant.
- **Players can end their own turn; only GM/Assistant can end NPC turns.**

### Hooks (confirmed in KB but not fully detailed)

- `preUpdateCombat` / `updateCombat` — fires on turn/round change
- `createCombatant` / `deleteCombatant`
- Check `changed.turn` / `changed.round` to differentiate

### Tesshari initiative

Pure EDGE descending, IRON tiebreak. Because the KB treats initiative as a formula string, use:

```javascript
CONFIG.Combat.initiative = {
  formula: "@system.stats.edge + (@system.stats.iron / 100)",
  decimals: 2
};
```

The /100 IRON term makes it a deterministic tiebreak without visible dice.

### Turn-start / turn-end automation

Register on `updateCombat`:
- At turn start: reset `system.ap.value = system.ap.max - overheatPenalty()`, reset `turn.basicAttackUsed`, reset `turn.cardsPlayedThisTurn`, trigger Regen ticks.
- At turn end: tick Bleed, then Burn (order matters per rules), decrement status durations, drop zero-duration statuses.
- At round end: reset each combatant's `turn.reactionUsed`.

---

## 10. Cards document

KB docs describe the built-in Cards system:

- **Stack types**: Deck / Hand / Pile
- Operations: Deal / Draw / Play / Pass
- Draw modes: Top / Bottom / Random
- Each Card has type/suit/value, multiple faces, back image

**Critical Tesshari decision:** the native Cards system is built around **random draw**, which does not match Tesshari's "every card always available" model.

Recommendation: **do not use the native Cards documents as the player's combat hand.** Instead, model cards as **Items of type `card`**. Each character's hand is simply their collection of owned `card` Items, visible always, played by clicking. The native Cards system can still be used for narrative things (Fortune Tellers, hand of destiny NPC props) if useful.

This matches how most systems handle spell/ability lists.

---

## 11. Damage pipeline implementation sketch

Tesshari's 7-step pipeline from [system/02_keywords_and_status.md](../system/02_keywords_and_status.md):

```javascript
// module/damage.mjs
export const TesshariDamage = {
  async resolve(defender, card, attacker) {
    const ctx = {
      base:   card.system.baseDamage,
      stat:   attacker.system.stats[card.system.primaryStat] ?? 0,
      pierce: card.system.pierce ?? 0
    };

    // Step 1–2: base + primary stat
    let dmg = ctx.base + ctx.stat;

    // Step 3: attacker modifiers
    dmg += this.attackerMods(attacker, card);

    // Step 4: Pierce then Guard then Shield
    let guard  = defender.system.guardPool  ?? 0;
    let shield = defender.system.shieldPool ?? 0;
    const effectiveGuard  = Math.max(0, guard  - ctx.pierce);
    const pierceLeft      = Math.max(0, ctx.pierce - guard);
    const effectiveShield = Math.max(0, shield - pierceLeft);

    const absorbedByGuard  = Math.min(effectiveGuard,  dmg);
    dmg -= absorbedByGuard;
    const absorbedByShield = Math.min(effectiveShield, dmg);
    dmg -= absorbedByShield;

    // Step 5: Vulnerable (×) then Expose (+)
    const vuln = this.stacksOf(defender, "vulnerable");
    const expose = this.stacksOf(defender, "expose");
    dmg = Math.floor(dmg * (1 + 0.1 * vuln)) + expose;

    // Step 6: clamp
    dmg = Math.max(0, dmg);

    // Step 7: commit
    await this.commit(defender, dmg, absorbedByGuard, absorbedByShield);
    await this.logToChat(attacker, defender, card, dmg);
    return dmg;
  }
};
```

Commit step updates `system.hp.value`, decrements guardPool/shieldPool, and handles Burn-strips-Guard timing separately at end-of-turn.

---

## 12. Chat messages

`ChatMessage` is a Document. Build cards programmatically:

```javascript
await ChatMessage.create({
  speaker: ChatMessage.getSpeaker({ actor }),
  content: await renderTemplate("systems/tesshari/templates/chat/card-play.hbs", data),
  flags: { tesshari: { cardId: card.id, damage: dmg } }
});
```

Tesshari chat cards should show: card name, AP cost, card image, damage breakdown (base + stat − guard − shield × vuln + expose), and any applied statuses.

---

## 13. Macros

- Script macros have access to `game`, `canvas`, `actor`, `token`, `scope` globals.
- Can be auto-created when users drag items onto the hotbar — hook into `hotbarDrop`.

```javascript
Hooks.on("hotbarDrop", (bar, data, slot) => {
  if (data.type !== "Item") return;
  // Build a macro that plays the card via UUID
  const command = `game.tesshari.playCard("${data.uuid}");`;
  // ...create macro with that command, place in slot
  return false;
});
```

---

## 14. Compendium packs

### Pack types
Actor, Item, JournalEntry, Macro, Playlist, RollTable, Scene, Adventure.

### Manifest declaration

```json
"packs": [
  { "name": "cards-ironclad-samurai",
    "label": "Cards — Ironclad Samurai",
    "type": "Item",
    "system": "tesshari",
    "path": "packs/cards-ironclad-samurai" }
]
```

(In V11+ `path` points to a LevelDB **directory**, not a `.db` file.)

### LevelDB & foundryvtt-cli

- V11+ compendium packs are LevelDB directories, not single-file `.db`.
- The KB articles I pulled don't detail the CLI, but the official tool is **foundryvtt-cli** (npm `@foundryvtt/foundryvtt-cli`). It provides `package pack` / `package unpack` commands that round-trip LevelDB ↔ YAML/JSON source files.
- Typical workflow: keep canonical card/item data as YAML files in `packs-src/`, compile to `packs/` LevelDB with the CLI as a build step. **This is what we want for Tesshari** — our 395 cards and 606 items already exist as structured data, so we can generate YAML directly and `foundryvtt-cli package pack` into the compendium.

I'll verify exact CLI syntax when we get to the packaging step.

---

## 15. Tokens

- Bars linked to actor attributes with `{value, max}` — Tesshari's `hp` and `ap` qualify.
- Prototype tokens are defaults; placed tokens are independent.
- Status icons (upper-left overlay) come from `CONFIG.statusEffects`.
- Vision modes are system-customizable — Forged darkvision could be a custom mode.

---

## 16. Modules vs system (what goes where)

**Tesshari system** ships:
- All core rules (stats, HP/AP, damage pipeline, status engine)
- All 25 classes, 8 races, 15 statuses, 395 cards, 606 items
- Actor + Item sheets
- Combat tracker hooks
- Starter compendium with all content

**Separate Tesshari modules** (later) might add:
- Adventure modules (the 40-dungeon pack as scene/journal content)
- Content packs (faction-specific gear, community contributions)
- Automation modules (advanced card-play UX, 3D hand visualization)

As of V11, modules can declare their own Actor/Item sub-types via `documentTypes`, and register DataModels on them — useful if we ever want add-on homebrew content.

---

## 17. Frameworks included in Foundry

| Lib | Use |
|---|---|
| **Handlebars** | Sheet + chat templates |
| **jQuery** | DOM manipulation (sheet event wiring) |
| **PixiJS** | Canvas/WebGL |
| **GreenSock (GSAP)** | Animations |

KB does **not** mention Vue/Svelte/React as first-class options. Systems that use them (e.g., PF2E via Vue, some systems via Svelte) bundle their own runtime.

**Tesshari:** Start with **Handlebars + jQuery** — the sanctioned path. The existing React prototype in `tesshari-app/` is a reference for UX/data shape, not runtime. If we need heavy reactivity later, we can introduce Svelte or Vue per-sheet.

---

## 18. Scene Regions

V12 feature. Polygon regions fire **behaviors** on events:
- Movement: Token Enters/Exits/Moves, Animates In/Out
- Combat: Token Starts/Ends Turn/Round
- Region state changes

Built-in behaviors: Adjust Darkness, Suppress Weather, Modify Movement, Display Text, Execute Macro/Script, Pause Game, Teleport.

**Tesshari:** Can model Ashlands resonance zones (apply Overheat on enter), Between-adjacent spaces (grant Echoed race passive bonuses), consecrated ground (apply Fortify).

---

## 19. Flags and localization

- `document.flags[packageId][key]` is the sanctioned extension mechanism for any package data that doesn't fit the schema. Useful for per-card runtime state (usedThisCombat, etc.) without hardcoding into the DataModel.
- Language files: `lang/en.json` keyed like `TESSHARI.Status.Guard`, referenced in DataModels/sheets via `i18n.localize()` or `{{localize}}`.

---

## 20. Deprecated / avoid

- `isObjectEmpty()` → use `foundry.utils.isEmpty()`
- `template.json` as the primary schema definition → use DataModels
- `CompendiumCollection.db` direct reads → use `.getDocuments()` / `.getIndex()`
- Old manifest fields (`name`, `author`, `dependencies`, `minimumCoreVersion`, `permission`)
- Base64-embedded images in documents → use `FilePathField`

---

## 21. Still-open research questions

Mark these as things to verify before writing the code:

1. **Exact V12 Hooks** for turn/round start/end (KB is vague; need the API docs or a working system's source).
2. **foundryvtt-cli** usage for LevelDB pack round-tripping — verify with npm docs or GitHub README.
3. **ApplicationV2 / HandlebarsApplicationMixin** — V12 introduces a new application framework. Sheets built against the V1 `FormApplication` base still work but V2 is preferred going forward. Need to pick one before writing sheets.
4. **ActiveEffect duration** and how it interacts with combat tracker for Tesshari's "1 round" / "persists until removed" semantics.
5. **Card play hotkey/drag** UX — best patterns for clickable ability lists in the sheet.
6. **Custom change mode** — exact signature of the dispatch hook (`Hooks.on("applyActiveEffect", ...)`) for implementing Pierce/Echo/Overclock as custom modes.

Will resolve these by reading the API docs (https://foundryvtt.com/api/) or an open-source system (Shadowdark, SWADE, or the Foundry Worlds & Content Pack template) when we hit them.
