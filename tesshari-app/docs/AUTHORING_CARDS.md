# Adding Cards (Abilities) to Tesshari

All card data lives in a single source of truth:

```
c:/Users/nroberts/TechnoNinja/questbound/import_tsv/aligned_for_qb/actions_READY.tsv
```

The React app regenerates `src/data/generated.ts` from this TSV every time you run `npm run dev` or `npm run build`. Add a row — restart dev — card appears in the pool.

## TSV columns

| Column | Required | Example | Notes |
|---|---|---|---|
| `id` | ✅ | `card_ronin_dirty_finish` | Must start with `act_<classprefix>_` or `card_<classprefix>_` for the app to group it with a class. Must be unique. |
| `title` | ✅ | `Dirty Finish` | Display name. |
| `description` | ✅ | `Finish a foe off with a gutter-strike. Deal bonus damage against Staggered targets.` | One sentence preferred. |
| `category` | ✅ | `combat_card` | Drives unlock level + color. See **Categories** below. |
| `inventoryHeight` | optional | `1` | Only used for inventory grid display. |
| `inventoryWidth` | optional | `1` | Same. |
| `image` | optional | `` | Asset filename. Leave blank. |
| `customProperties` | optional | `{"apCost":"2","playLimitPerTurn":"1","isCard":"true","isBasicAttack":"false","aiTag":""}` | JSON-inside-TSV; see **AP & flags** below. |

## Class prefix → class mapping

The `id` prefix determines which class the card belongs to:

| Prefix | Class |
|---|---|
| `act_ironclad_*` / `card_ironclad_*` | Ironclad Samurai |
| `act_ronin_*` / `card_ronin_*` | Ronin |
| `act_iron_monk_*` / `card_iron_monk_*` | Iron Monk |
| `act_fracture_knight_*` / `card_fracture_knight_*` | Fracture Knight |
| `act_ashfoot_*` / `card_ashfoot_*` | Ashfoot |
| `act_veilblade_*` / `card_veilblade_*` | Veilblade |
| `act_oni_hunter_*` / `card_oni_hunter_*` | Oni Hunter |
| `act_shell_dancer_*` / `card_shell_dancer_*` | Shell Dancer |
| `act_curse_eater_*` / `card_curse_eater_*` | Curse Eater |
| `act_hollow_*` / `card_hollow_*` | The Hollow |
| `act_forge_tender_*` / `card_forge_tender_*` | Forge Tender |
| `act_wireweave_*` / `card_wireweave_*` | Wireweave |
| `act_chrome_shaper_*` / `card_chrome_shaper_*` | Chrome Shaper |
| `act_pulse_caller_*` / `card_pulse_caller_*` | Pulse Caller |
| `act_sutensai_*` / `card_sutensai_*` | Sutensai |
| `act_flesh_shaper_*` / `card_flesh_shaper_*` | Flesh Shaper |
| `act_echo_speaker_*` / `card_echo_speaker_*` | Echo Speaker |
| `act_void_walker_*` / `card_void_walker_*` | Void Walker |
| `act_blood_smith_*` / `card_blood_smith_*` | Blood Smith |
| `act_iron_herald_*` / `card_iron_herald_*` | Iron Herald |
| `act_shadow_daimyo_*` / `card_shadow_daimyo_*` | Shadow Daimyo |
| `act_voice_of_debt_*` / `card_voice_of_debt_*` | Voice of Debt |
| `act_merchant_knife_*` / `card_merchant_knife_*` | Merchant Knife |
| `act_puppet_binder_*` / `card_puppet_binder_*` | Puppet Binder |
| `act_unnamed_*` / `card_unnamed_*` | The Unnamed |

## Subclass-specific cards

For a card that only appears when the character picks a specific subclass path, put the **path slug** inside the id anywhere after the class prefix:

```
card_ironclad_iron_lord_rally_banner       ← appears for Oath Iron Lord only
card_wireweave_combat_weave_signal_spike   ← appears for Combat Weave only
```

The subclass slugs live in `build-data.mjs` under `SUBCLASS_BY_CLASS`. Match them exactly (they use underscores, no spaces).

## Categories → unlock level

The `category` column drives which level tier a card unlocks in:

| Category pattern | Tier |
|---|---|
| `*capstone*` (e.g. `capstone_card`) | **L20** |
| `*subclass_power*` | **L9** |
| `*subclass*` (e.g. `subclass_card`, `subclass_iron_lord`) | **L3** |
| `*power*` (e.g. `power_card`) | **L5** |
| `*level_up*` | **L2** |
| everything else (`combat_card`, `defense_card`, `utility_card`, `control_card`, `mobility_card`, `reaction_card`, `passive`, `unnamed_card`, ...) | **L1** |

Category also drives the color bar on the card in the UI (combat = red, defense = blue, control = purple, mobility = green, utility = yellow, reaction = cyan, passive = grey, power = pink, capstone = orange, subclass = gold).

## AP & flags (`customProperties`)

`customProperties` is a JSON string stored inside a TSV cell. Escape double quotes by doubling them (`""`). Example:

```
"{""apCost"":""2"",""playLimitPerTurn"":""1"",""isCard"":""true"",""isBasicAttack"":""false"",""aiTag"":""""}"
```

| Key | Type | Effect |
|---|---|---|
| `apCost` | string number | AP badge on the card. `0` means free. |
| `playLimitPerTurn` | string number | Shows "X/turn" on the card. |
| `isCard` | `"true"` / `"false"` | Card vs. basic action. Unused by UI today but preserved for export. |
| `isBasicAttack` | `"true"` / `"false"` | Renders a "Basic" chip on the card. |

## Adding a card — example

Append to `actions_READY.tsv`:

```
card_curse_eater_stacks_overflow	Stacks Overflow	Release all stored Loaded stacks as a single blast; damage scales with stack count.	power_card	1	1		"{""apCost"":""2"",""playLimitPerTurn"":""1"",""isCard"":""true"",""isBasicAttack"":""false"",""aiTag"":""""}"
```

Then in `tesshari-app/`:

```bash
npm run data   # regenerate src/data/generated.ts
npm run dev    # see the new card in Curse Eater's pool
```

## Content targets (rough guidance)

The pick system assumes players at max level (L20) pick ~22 cards from the class pool. For a class to feel rich at every level, aim for:

| Tier | Recommended count per class |
|---|---|
| L1 core | 10-14 |
| L2 | 2-3 |
| L3 subclass (per subclass) | 4-6 |
| L5 power | 3-4 |
| L9 subclass power (per subclass) | 2-3 |
| L20 capstone | 1-2 |

So a class with 3 subclasses should have roughly 30-40 class cards + 6-9 subclass cards per path. Current classes have **8-32 total**; most need expansion.

Running `node tesshari-app/scripts/coverage.mjs` prints a per-class breakdown so you can see where to add content first.
