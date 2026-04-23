# Tesshari — Foundry VTT System

Scaffold for the Tesshari TTRPG system. Targets **Foundry V12**.

## What's in this scaffold

| Path | Purpose |
| --- | --- |
| `system.json` | Manifest. Declares id, version, actor/item types, initiative, esmodules. |
| `tesshari.mjs` | Entry point. Registers document classes, data models, initiative formula, trackable attributes. |
| `module/data-models.mjs` | Schemas for 3 Actor sub-types (character / monster / npc) and 9 Item sub-types (card / race / class / subclass / cybernetic / weapon / armor / consumable / status). |
| `module/documents.mjs` | `TesshariActor` (HP/AP clamp), `TesshariItem`, `TesshariCombat` (turn/round hooks call StatusEngine). |
| `module/status-effects.mjs` | 15 keyword definitions + `StatusEngine` — apply/reduce/remove/stacksOf/cleanse/dispel + Bleed/Burn/Regen/duration ticks. |
| `module/damage-pipeline.mjs` | `TesshariDamage.resolve` — deterministic 7-step resolver with Pierce/Guard/Shield/Vulnerable/Expose + optional Echo pass + chat breakdown. |
| `module/card-engine.mjs` | `CardEngine.play` — read card item, enforce AP/once-per-turn/Stagger/Silence/Root gates, run damage, apply keyword riders, handle Veil. |
| `module/sheets/card-sheet.mjs` + `templates/item/card-sheet.hbs` | Custom ItemSheetV2 for the `card` item type. Edits tier, AP cost, base damage, pierce, category, primary stat, keywords, flags, description. |
| `module/sheets/character-sheet.mjs` + `templates/actor/character-sheet.hbs` | Custom ActorSheetV2 for `character`. Stats grid, HP/AP/Hand resources, clickable hand tiles, inventory, status tray, Basic Attack / End Turn buttons, item-drop zone. |
| `lang/en.json` | Minimal English localization. |
| `styles/tesshari.css` | Empty — styles land with sheets. |
| `templates/` | Empty — Handlebars partials land with sheets. |
| `packs/` | LevelDB compendium output (populated by `foundryvtt-cli`). |
| `packs-src/` | YAML source for compendium content (generated from existing Tesshari data). |

## What is NOT in this scaffold yet

- Custom Actor / Item sheets — Foundry uses its core fallback sheets
- Card-play actions and AP spending (UI + macro hooks)
- Compendium content (cards, items, classes, races, monsters)
- CSS styling
- Rich chat card templates (the pipeline posts a minimal breakdown for now)

These land in follow-up passes.

## Status engine

`game.tesshari.status` exposes the `StatusEngine` for macros and the eventual
damage pipeline:

```js
// Apply Guard 5 to the selected token
await game.tesshari.status.apply(token.actor, "guard", 5);

// Stack another Guard — total becomes 8
await game.tesshari.status.apply(token.actor, "guard", 3);

// Query
game.tesshari.status.stacksOf(token.actor, "guard");   // → 8

// Apply a timed status (Regen 2 for 3 turns)
await game.tesshari.status.apply(token.actor, "regen", 2, 3);

// Cleanse one debuff
await game.tesshari.status.cleanse(token.actor, 1);

// Cleanse specifically targeting Bleed
await game.tesshari.status.cleanse(token.actor, 1, { preferId: "bleed" });

// Dispel one buff from an enemy
await game.tesshari.status.dispel(enemy.actor, 1);
```

Automated ticks fire via the combat tracker:

- **Turn start**: AP reset (minus Overheat penalty), per-turn trackers cleared, Regen heals
- **Turn end**: Bleed ticks (ignores Guard), Burn ticks (strips Guard first), turn-scoped durations decrement
- **Round end**: reactions reset, round-scoped durations decrement (Fortify, Taunt)

## Damage pipeline

`game.tesshari.damage.resolve(defender, inputs)` runs the full 7-step
deterministic resolver and posts a chat breakdown. Card-play code reads base
damage, the attacker's primary stat, and any modifiers, then passes them in:

```js
// Select attacker token, target a defender token, then run this macro.
const attacker = canvas.tokens.controlled[0]?.actor;
const defender = game.user.targets.first()?.actor;

const card = attacker.items.find(i => i.name === "Blade of Obligation");

await game.tesshari.damage.resolve(defender, {
  baseDamage:    card.system.baseDamage,            // 22
  statValue:     attacker.system.stats.iron,        // e.g. 5
  pierce:        card.system.pierce,                // 6
  attackerBonus: 0,
  echo:          false,
  attacker, card,
  label: card.name,
});
```

Alternatively via the actor convenience method:

```js
await defender.applyCardDamage({ baseDamage: 22, statValue: 5, pierce: 6, attacker, card });
```

Other helpers on `TesshariActor`:

- `applyFlatDamage(n)` — bypasses all mitigation (narrative damage)
- `applyHealing(n)` — heals, clamped to max
- `spendAP(n)` — returns false + warns on shortfall
- `playCard(cardOrId, opts)` — plays one of this actor's card items via CardEngine

## Card-play engine

`game.tesshari.cards.play(actor, card, opts)` is the full card-play flow:

1. **Gates** — AP, once-per-turn, Stagger/Silence/Root, once-per-combat, reaction used
2. **Spend AP**
3. **Per target** — damage via TesshariDamage, then keyword riders via StatusEngine
4. **Veil** — if a defender has Veil, strip it and skip that defender's riders
5. **Self-modifiers** — Overclock applies Overheat 2 to attacker
6. **Commit turn state** — push card id to `cardsPlayedThisTurn`, mark reaction/basic-attack used

Supported keyword types on `card.system.keywords[]`:

- **Status riders** (Bleed, Burn, Expose, Vulnerable, Overheat, Stagger, Root, Silence, Taunt, Mark, Guard, Shield, Fortify, Regen, Veil) — applied to each defender
- **Modifiers** (Echo, Pierce) — handled by the damage pipeline
- **Actions** (Cleanse, Dispel) — remove one debuff / buff from each target

Options:

- `targets: Actor[] | null` — explicit target list. null → uses `game.user.targets`
- `overclock: boolean` — doubles base damage and applies Overheat 2 to self
- `dryRun: boolean` — validate only

### Minimal card test (no compendium content yet)

Until compendium packs are shipped, you can hand-build a test card:

1. Create an Item in the Items sidebar → type **Card**
2. Open it — the Tesshari Card Sheet shows fields for tier, AP cost, base damage, pierce, category, primary stat, keywords, flags, description. Set:
   - Tier: 3 · AP Cost: 3 · Base Damage: 22 · Pierce: 6
   - Category: attack · Primary Stat: iron
   - Keywords: `Bleed 3, Expose 2`
3. Drag it onto a character actor so it's an owned item on that actor
4. Select the attacker token, target another token with `T`, then run:

```js
const attacker = canvas.tokens.controlled[0]?.actor;
const card = attacker.items.find(i => i.type === "card");
await game.tesshari.cards.play(attacker, card);
```

The chat log should show the damage breakdown, and the defender should pick up
Bleed 3 and Expose 2 in its status tray.

## Install

Copy the entire `tesshari-foundry/` directory into your Foundry user data:

```text
{userdata}/Data/systems/tesshari/
```

On Windows this is typically:

```text
%LOCALAPPDATA%\FoundryVTT\Data\systems\tesshari\
```

The directory must be named `tesshari` exactly — it must match `system.json → id`.

After copying, start Foundry. "Tesshari" should appear in the World creation system dropdown. Create a test world to verify no errors in the console.

## Verifying the scaffold

1. Create a new world with system = Tesshari
2. Open the world; the game should load without console errors
3. Try creating an Actor — all three sub-types (`character`, `monster`, `npc`) should appear in the type picker
4. Try creating an Item — all nine sub-types should appear
5. Each created document will render with Foundry's **default** sheet (expected — we haven't written custom sheets yet). The `system` field should show structured sub-fields from our DataModels
6. Token bars 1 and 2 should default to `hp` and `ap` on character/monster actors

If any of that fails, check the Foundry console (F12) for errors.

## Development workflow

For iterating without copying files every time, either:

1. **Symlink** (Windows, admin PowerShell):

    ```powershell
    New-Item -ItemType SymbolicLink -Path "$env:LOCALAPPDATA\FoundryVTT\Data\systems\tesshari" -Target "C:\Users\nroberts\TechnoNinja\tesshari-foundry"
    ```

2. **Junction point** (Windows, no admin required):

    ```batch
    mklink /J "%LOCALAPPDATA%\FoundryVTT\Data\systems\tesshari" "C:\Users\nroberts\TechnoNinja\tesshari-foundry"
    ```

Either way, edits in this repo reflect immediately; reload the world (F5) to pick them up.

## Compendium pipeline

Content flows: `tesshari-app/src/data/generated.ts` → `packs-src/<name>/*.json`
→ `packs/<name>/` (LevelDB). Foundry loads from `packs/` at startup based on
the `packs` declarations in `system.json`.

The Foundry CLI is a local dev dependency (`@foundryvtt/foundryvtt-cli`). Run
`npm install` once in this directory to pull it.

### npm scripts

```bash
npm install             # once, installs foundryvtt-cli locally
npm run build-packs     # TS → JSON under packs-src/
npm run pack:all        # JSON → LevelDB under packs/
npm run all             # both steps
npm run sync            # mirror repo → Foundry save location (skips node_modules)
```

After any card/item data change: `npm run all && npm run sync`, then F5 in
Foundry to reload compendia.

### Current packs

| Pack | Contents | Count |
| --- | --- | --- |
| `cards` | All cards across 25 classes + 8 races (from ACTIONS where isCard) | ~1,700 |
| `items` | All Tesshari items — routed to cybernetic/consumable/weapon/armor | ~600 |

Users access these via the Compendium Packs sidebar → drag items directly
onto character/monster sheets. The card sheet lets them tweak per-card fields
(baseDamage, primaryStat, keywords) if the source data was sparse.

## References

- Consolidated KB notes: [../foundry_notes/00_kb_master_notes.md](../foundry_notes/00_kb_master_notes.md)
- V12 API followups: [../foundry_notes/01_api_followups.md](../foundry_notes/01_api_followups.md)
- Source rules: [../system/](../system/), [../classes/](../classes/), [../races/](../races/)
- Existing structured data (395 cards, 606 items): [../tesshari-app/src/data/generated.ts](../tesshari-app/src/data/generated.ts)
