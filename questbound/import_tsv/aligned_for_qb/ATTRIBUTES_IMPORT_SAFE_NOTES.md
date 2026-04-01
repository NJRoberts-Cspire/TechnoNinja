# Attributes Import Safe Notes

Use this file for import if QB reports:

- `options array is required for list type`

## File to import

- `attributes_import_safe.tsv`

This file converts all `list` attributes to `text` so import succeeds on stricter validators.

## After import: convert these back to List in UI

Change type to `list` and set options manually for:

- `attr_heritage`: `Ironhold, Wire Market, Ashlands, Unaligned`
- `attr_integrated_resistance`: `bludgeoning, slashing, piercing`
- `attr_forged_aug_1`: `reinforced_limb, optical_suite, vox_modulator, subdermal_plating, neural_accelerator, intake_filter, hydraulic_frame`
- `attr_forged_aug_2`: `none, reinforced_limb, optical_suite, vox_modulator, subdermal_plating, neural_accelerator, intake_filter, hydraulic_frame`
- `attr_maintenance_state`: `serviced, degraded`
- `attr_vein_oath`: `loyalty, restraint, sacrifice, clarity`
- `attr_vein_discipline_lvl1`: `between_stance, iron_breath`
- `attr_vein_discipline_lvl2`: `stillness_kata, burden_strike, iron_witness`
- `attr_vein_path`: `oath_iron_lord, oath_sutensai_blade, oath_undying_debt, oath_flesh_temple`
- `attr_iron_endurance_resistance_type`: `slashing, piercing, bludgeoning`
- `attr_monster_role`: `skirmisher, brute, controller, support, boss`
- `attr_monster_tier`: `minion, standard, elite, boss`
- `attr_monster_threat_state`: `neutral, pressured, advantaged, desperate`

## Recommendation

Import all other files as-is, and only swap `attributes.tsv` with `attributes_import_safe.tsv`.
