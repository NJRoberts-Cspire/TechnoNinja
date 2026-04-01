# Quest Bound Draft: The Forged

Use these tables as TSV-ready source by copying each table into a spreadsheet and exporting per entity.

## attributes.tsv (draft)

| id | title | type | default | category | description |
|---|---|---|---|---|---|
| attr_species | Species | text | Forged | identity | Character species label. |
| attr_heritage | Forged Heritage | list | Unaligned | identity | Heritage branch: Ironhold, Wire Market, Ashlands, Unaligned. |
| attr_integrated_resistance | Integrated Resistance | list | bludgeoning | defense | Damage resistance selected at character creation. |
| attr_forged_aug_1 | Augmentation Slot 1 | list | reinforced_limb | augmentation | Primary augmentation selected at level 1. |
| attr_forged_aug_2 | Augmentation Slot 2 | list | none | augmentation | Secondary augmentation selected at level 5. |
| attr_maintenance_state | Maintenance State | list | serviced | system | Tracks maintenance dependency: serviced or degraded. |
| attr_chassis_intact | Chassis Intact | boolean | true | system | Enables Forged Resilience death-save bonus logic. |
| attr_forged_resilience_used | Forged Resilience Used | boolean | false | combat | Once-per-long-rest tracker. |
| attr_carry_capacity_mult | Carry Capacity Multiplier | number | 1 | derived | Set to 2 when Hydraulic Frame is active. |
| attr_unarmed_damage_die | Unarmed Damage Die | text | 1d4 | combat | Raised to 1d6 when Reinforced Limb is active. |
| attr_darkvision_range | Darkvision Range | number | 0 | senses | 60 (or 90 extension) when Optical Suite is active. |
| attr_natural_ac_base | Natural AC Base | number | 0 | defense | Set to 13 when Subdermal Plating is active. |
| attr_ready_bonus_uses | Ready Bonus Uses | number | 0 | combat | Set to 1/short rest when Neural Accelerator is active. |
| attr_poison_save_adv | Poison Save Advantage | boolean | false | defense | Enabled by Intake Filter. |
| attr_poison_resistance | Poison Resistance | boolean | false | defense | Enabled by Intake Filter. |
| attr_chassis_memory_window_hours | Chassis Memory Window Hours | number | 24 | utility | Memory recall window from Chassis Memory. |

## charts.tsv (draft)

| id | title | columns | rows |
|---|---|---|---|
| chart_forged_heritage_options | Forged Heritage Options | key,name,asi_bonus,notes | ironhold,wire_market,ashlands,unaligned |
| chart_forged_augmentation_options | Forged Augmentation Options | key,name,effect_summary,requires_level | reinforced_limb,optical_suite,vox_modulator,subdermal_plating,neural_accelerator,intake_filter,hydraulic_frame |
| chart_maintenance_states | Maintenance States | key,label,mechanical_effect | serviced,degraded |

## actions.tsv (draft)

| id | title | category | description |
|---|---|---|---|
| act_forged_select_heritage | Select Forged Heritage | character_creation | Choose one heritage branch and apply linked ASI profile and lore tag. |
| act_forged_select_integrated_resistance | Select Integrated Resistance | character_creation | Choose bludgeoning/slashing/piercing resistance source from chassis configuration. |
| act_forged_select_aug_slot_1 | Select Augmentation Slot 1 | character_creation | Choose one augmentation at level 1. |
| act_forged_select_aug_slot_2 | Select Augmentation Slot 2 | level_up | At level 5, choose a second augmentation from list. |
| act_forged_replace_augmentation | Replace Augmentation | level_up | At level 10, replace one prior augmentation with another list option. |
| act_forged_maintenance_check | Maintenance Check | rest | On long rest, verify maintenance tools or assistance; otherwise apply degradation/exhaustion effect per system rules. |
| act_forged_resilience_trigger | Forged Resilience Trigger | reaction | When reduced to 0 HP but not killed outright, drop to 1 HP if not used this rest. |
| act_forged_vox_mimic | Vox Mimic Voice | utility | Perfectly mimic a voice heard for at least 1 minute; opposed by Insight check. |
| act_forged_neural_ready | Neural Accelerator Ready | combat | Take Ready as a bonus action once per short rest. |

## items.tsv (draft)

| id | title | category | description | inventory_width | inventory_height |
|---|---|---|---|---|---|
| item_basic_maintenance_kit | Basic Maintenance Tools | gear | Required for proper long-rest servicing of Forged chassis. | 1 | 1 |
| item_forged_reinforced_limb | Reinforced Limb Module | augmentation | Grants stronger unarmed strikes and athletics leverage. | 1 | 1 |
| item_forged_optical_suite | Optical Suite Module | augmentation | Grants darkvision and surprise protection behavior. | 1 | 1 |
| item_forged_vox_modulator | Vox Modulator Module | augmentation | Grants precision vocal mimic capability. | 1 | 1 |
| item_forged_subdermal_plating | Subdermal Plating Module | augmentation | Grants natural AC baseline while unarmored. | 1 | 1 |
| item_forged_neural_accelerator | Neural Accelerator Module | augmentation | Grants bonus-action Ready capability cadence. | 1 | 1 |
| item_forged_intake_filter | Intake Filter Module | augmentation | Grants poison/disease defense package. | 1 | 1 |
| item_forged_hydraulic_frame | Hydraulic Frame Module | augmentation | Doubles carry capacity and improves grapple profile. | 1 | 1 |

## archetypes.tsv (draft)

| id | title | category | description |
|---|---|---|---|
| arc_race_forged_base | Race: The Forged (Base) | race | Applies baseline species metadata and core Forged trait package. |
| arc_race_forged_heritage_ironhold | Forged Heritage: Ironhold | race_variant | +2 CON, +1 STR profile and Ironhold flavor package. |
| arc_race_forged_heritage_wire_market | Forged Heritage: Wire Market | race_variant | +2 INT, +1 DEX profile and Wire Market flavor package. |
| arc_race_forged_heritage_ashlands | Forged Heritage: Ashlands | race_variant | +1 CON, +1 DEX, +1 WIS profile and Ashlands flavor package. |
| arc_race_forged_heritage_unaligned | Forged Heritage: Unaligned | race_variant | +1 to any two different ability scores. |

## documents.tsv (draft)

| id | title | category | source_file | description |
|---|---|---|---|---|
| doc_race_forged_overview | The Forged - Overview | character_options | races/01_the_forged.md | Lore-forward race reference text for players. |
| doc_race_forged_roleplay | The Forged - Roleplaying Notes | character_options | races/01_the_forged.md | Guidance on identity, upgrades, and social positioning. |
| doc_race_forged_war_context | The Forged - Ascension War Context | reference | races/01_the_forged.md | Faction pressure and campaign integration notes. |

## scripts.tsv (draft hooks)

| id | title | trigger | purpose |
|---|---|---|---|
| scr_forged_on_add_initialize | Forged On Add Initialize | on_archetype_add | Set species, initialize maintenance/chassis flags, prompt resistance and augmentation picks. |
| scr_forged_on_level_5_unlock | Forged Level 5 Unlock | on_level_change | Unlock and prompt second augmentation selection. |
| scr_forged_on_level_10_replace | Forged Level 10 Replace | on_level_change | Offer one-time augmentation replacement workflow. |
| scr_forged_on_long_rest_maintenance | Forged Long Rest Maintenance | on_long_rest | Validate maintenance kit/support and apply degradation effect if missing. |
| scr_forged_on_zero_hp_resilience | Forged Resilience Handler | on_hp_change | Process drop-to-1 behavior and consume rest-limited usage flag. |

## Source Crosswalk

| source_feature | target_entity | target_id |
|---|---|---|
| Integrated Chassis | attribute + action | attr_integrated_resistance + act_forged_select_integrated_resistance |
| Modular Augmentation | attributes + actions + items + chart | attr_forged_aug_1/2 + act_forged_select_aug_* + item_forged_* + chart_forged_augmentation_options |
| Maintenance Dependent | attribute + action + script | attr_maintenance_state + act_forged_maintenance_check + scr_forged_on_long_rest_maintenance |
| Chassis Memory | attribute | attr_chassis_memory_window_hours |
| Forged Resilience | attribute + action + script | attr_forged_resilience_used + act_forged_resilience_trigger + scr_forged_on_zero_hp_resilience |

## Card Combat Compatibility (AP Turn System)

Race content in this file is mostly passive, but these rows make it compatible with card combat.

### actions.tsv (race cards)

| id | title | category | ap_cost | play_limit_per_turn | is_card | is_basic_attack | description |
|---|---|---|---|---|---|---|---|
| act_forged_basic_attack_override | Basic Attack (Forged Chassis) | combat_card | 0 | 1 | true | true | Uses global free-basic-attack rule; can carry chassis-specific tags for animation/effects. |
| act_forged_neural_ready | Neural Accelerator Ready | combat_card | 1 | 1 | true | false | Card version of Neural Accelerator utility. |
| act_forged_vox_mimic | Vox Mimic Voice | utility_card | 1 | 1 | true | false | Social/utility card; costed for turn-economy consistency. |

### scripts.tsv (race hooks)

| id | title | trigger | purpose |
|---|---|---|---|
| scr_forged_card_tag_init | Forged Card Tag Initialize | on_archetype_add | Apply race tags/effect modifiers used by card resolution scripts. |
