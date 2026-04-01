# Tesshari -> Quest Bound Migration Plan

This plan converts the existing campaign content into a Quest Bound custom ruleset while preserving your tone, factions, and class/race design.

## 1) Quest Bound Model (What Matters)

- `Ruleset` is the container for all game content.
- Core entities: `attributes`, `archetypes`, `items`, `actions`, `charts`, `windows`, `pages`, `documents`, `scripts`.
- Imports/exports are file-based (zip + TSV), so spreadsheet-driven migration is practical.

## 1.1) System Pivot: Card/AP Turn Combat

Core combat loop for Tesshari custom system:

- Combat is strictly turn-based.
- Every ability is a `card` (including basic attack).
- Cards spend `AP` unless otherwise noted.
- Basic attack costs `0 AP` but can be played only once per turn.
- A character may play any number of cards on their turn if they can pay AP.
- Each individual card can be played only once per turn.
- No dice in combat resolution (card effects resolve through deterministic values and scripted checks).

Implementation model in QB:

- Represent playable abilities as `actions` with card metadata.
- Track turn state using attributes (`ap_current`, `ap_max`, `basic_attack_used_this_turn`).
- Enforce once-per-turn-per-card via a turn-play log attribute and script validation.
- Run turn reset script to refresh AP and clear per-turn card usage flags.

## 2) Content Mapping From This Repo

- `world/` -> `documents` + `charts` (timeline, faction matrix, geography references)
- `campaign/` -> `documents` (GM/player docs) + campaign use in QB sessions/scenes
- `races/` -> `archetypes` modules (race packages) + shared `attributes`
- `classes/` -> `archetypes` modules (class packages) + class `actions` + class `items`
- `items/` -> `items` (+ optional linked `actions` for activatable gear)
- `claimants/` and `npcs/` -> `documents` now; optional later as `items/actions/charts` if you want mechanical actors
- `monsters/` -> either `documents` (lore-first) or mechanical packages via `archetypes + actions + attributes`
- `locations/` -> `documents` + `charts` (travel, encounter, supply, rumor)
- `image_prompts/` -> art production source docs only (outside runtime rules)

## 3) Mechanical Decomposition Strategy

For each race/class markdown file, split into:

- `Flavor Text` -> QB `documents`
- `Persistent stats/resources` -> QB `attributes`
- `Selectable packages` (subclass paths, heritage branches) -> QB `archetypes`
- `Do-a-thing abilities` -> QB `actions`
- `Physical/equippable objects` -> QB `items`
- `Rule formulas/automation` -> QB `scripts`

Rule of thumb from QB docs:

- Use `attributes` for values that change and are tracked/calculated.
- Use `actions` for verbs (abilities, maneuvers, spells).
- Use `items` for nouns (carry/equip/consume).

## 4) Recommended First Pass Scope

Ship a thin vertical slice before full conversion:

1. One race: `The Forged`
2. One class: `Ironclad Samurai`
3. Core world primer docs (`world/00_world_overview.md`, `campaign/00_session_zero.md`)
4. Minimal character sheet windows/pages for:
   - identity and caste
   - core stats and resources
   - actions list
   - inventory

This gives you a playable alpha ruleset quickly.

## 5) Suggested Attribute Starter Set

Define a stable naming pattern early (snake_case recommended), for example:

- `level`, `xp`, `proficiency_bonus`
- `max_hp`, `current_hp`, `temp_hp`
- `ac`, `speed`
- Core stats: `str`, `dex`, `con`, `int`, `wis`, `cha`
- Setting stats: `resonance`, `echomind_stability`, `caste_tier`
- Trackers: `exhaustion`, `maintenance_state`, `voiding_state`

Add combat-card attributes:

- `ap_max`, `ap_current`
- `turn_number`, `active_combatant_id`
- `basic_attack_used_this_turn`
- `cards_played_this_turn` (serialized list/text)

Note: finalize exact fields after exporting a sample QB ruleset to confirm canonical TSV column names.

## 6) Archetype Structure Proposal

- Base archetype layer 1: `Race Archetype` (Forged, Tethered, etc.)
- Base archetype layer 2: `Class Archetype` (Ironclad Samurai, Ronin, etc.)
- Optional layer 3: `Subclass/Path` packages (for level-gated class path features)
- Optional layer 4: `Background/Caste` package (Resonant, Ashwalker, Voided, etc.)

This keeps race/class/caste modular and reusable.

## 7) Document Migration Buckets

Create four document categories in QB:

- `Player Primer` (world intro, session zero, safety)
- `Character Options` (race/class flavor and rules references)
- `GM Secrets` (claimant truths, hidden clocks, campaign branches)
- `Reference` (timelines, faction maps, terminology)

## 8) Automation Roadmap (After Manual Data Entry)

Phase A (no scripting):

- Manual stat tracking and action reference text.

Phase B (light scripting):

- Derived stats (`max_hp`, save DCs, passive scores).
- Action cost validation (resource checks and card-per-turn checks).

Phase C (full scripting):

- On-add archetype setup (auto grant starting attributes/actions/items).
- Level-up automation by class path.
- Conditional effects (stance/oath states, fracture penalties).
- Turn engine scripts (start turn AP refresh, card usage clearing, AP spend enforcement).

## 9) Migration Workflow

1. Create a new QB ruleset: `Tesshari: Seventh Convergence`.
2. Export once immediately and inspect TSV schema.
3. Build spreadsheets for attributes/actions/items/archetypes.
4. Convert one vertical slice (Forged + Ironclad) and import.
5. Create a test character and validate sheet flow.
6. Iterate until the slice is stable.
7. Batch-convert remaining races/classes in waves.

## 10) Risks To Manage

- Over-automating too early before naming conventions settle.
- Mixing lore text with runtime mechanics in the same entity.
- Inconsistent IDs/names across imported TSV files.
- Trying to convert all 25 classes before proving one complete pipeline.

## 11) Immediate Next Editing Tasks In This Repo

- Create a normalization pass for race/class files with explicit mechanical blocks:
  - `Passive Traits`
  - `Active Abilities`
  - `Resources`
  - `Level Progression`
- Add stable internal IDs for every ability/feature to simplify TSV imports later.
- Mark each feature with target QB entity (`attribute`, `action`, `item`, `script`, `document`).

---

If you want, the next step is to generate the first conversion pack for:

- `races/01_the_forged.md`
- `classes/01_ironclad_samurai.md`

into draft TSV-ready tables directly in this repo.
