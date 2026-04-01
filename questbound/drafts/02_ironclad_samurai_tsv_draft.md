# Quest Bound Draft: Ironclad Samurai

Use these tables as TSV-ready source by copying each table into a spreadsheet and exporting per entity.

## attributes.tsv (draft)

| id | title | type | default | category | description |
|---|---|---|---|---|---|
| attr_class | Class | text | Ironclad Samurai | identity | Character class label. |
| attr_vein_oath | Vein Oath | list | loyalty | class_core | Loyalty, Restraint, Sacrifice, or Clarity. |
| attr_resonance_fracture | Resonance Fracture | boolean | false | class_core | Set true when character violates Vein Oath. |
| attr_vein_discipline_lvl1 | Vein Discipline L1 | list | between_stance | class_core | Between Stance or Iron Breath. |
| attr_vein_discipline_lvl2 | Vein Discipline L2 | list | stillness_kata | class_core | Stillness Kata, Burden Strike, or Iron Witness. |
| attr_vein_path | Vein Path | list | oath_iron_lord | subclass | Selected subclass/path. |
| attr_resonant_surge_uses | Resonant Surge Uses | number | 1 | resource | Uses per short rest (2 at level 20). |
| attr_perfect_kata_used | Perfect Kata Used | boolean | false | resource | Once-per-long-rest tracker. |
| attr_iron_endurance_used | Iron Endurance Used | boolean | false | resource | Once-per-long-rest tracker for drop-to-1 effect. |
| attr_iron_endurance_resistance_type | Iron Endurance Resistance Type | list | slashing | defense | Slashing, piercing, or bludgeoning selection. |
| attr_resonant_armor_reaction_uses | Resonant Armor Reaction Uses | number | 0 | resource | Equals proficiency bonus per long rest when unlocked. |
| attr_surge_bonus_damage_dice | Surge Bonus Damage Dice | text | 2d6 | combat | 3d6 at level 16 with Between Mastery. |
| attr_blade_sworn_bound | Blade-Sworn Bound Weapon | boolean | false | capstone_track | Tracks permanent weapon bond at level 17. |
| attr_seventh_vein_defined | Seventh Vein Defined | boolean | false | capstone_track | Tracks level 20 narrative definition completion. |

## charts.tsv (draft)

| id | title | columns | rows |
|---|---|---|---|
| chart_ironclad_level_progression | Ironclad Level Progression | level,feature_ids,notes | 1-20 |
| chart_ironclad_vein_oaths | Vein Oaths | key,name,fracture_violation_example | loyalty,restraint,sacrifice,clarity |
| chart_ironclad_vein_path_options | Vein Path Options | key,name,theme | oath_iron_lord,oath_sutensai_blade,oath_undying_debt,oath_flesh_temple |
| chart_ironclad_starting_gear | Ironclad Starting Gear | item_id,quantity,notes | resonant_blade,armor_choice,voidsteel_tanto,oath_mark,maintenance_kit,trade_metal |

## actions.tsv (draft)

| id | title | category | description |
|---|---|---|---|
| act_ironclad_select_vein_oath | Select Vein Oath | character_creation | Choose core oath anchor (Loyalty/Restraint/Sacrifice/Clarity). |
| act_ironclad_apply_resonance_fracture | Apply Resonance Fracture | state_change | Apply disadvantage state until atonement + meditation are completed. |
| act_ironclad_between_stance | Between Stance | combat_bonus_action | Attack action rider: avoid opportunity attacks and impose disadvantage on first attack against you. |
| act_ironclad_iron_breath | Iron Breath | utility_bonus_action | Suppress enhancement signature for 1 minute; once per short rest. |
| act_ironclad_resonant_strike | Resonant Strike | passive_combat | Once per turn, add Wisdom modifier to qualified melee hit damage. |
| act_ironclad_stillness_kata | Stillness Kata | combat | If you do not move, gain attack advantage this turn; PB uses/long rest. |
| act_ironclad_burden_strike | Burden Strike | reaction | Impose disadvantage on attack against nearby ally. |
| act_ironclad_iron_witness | Iron Witness | passive_combat | Gain temporary HP when nearby creature drops to 0 HP. |
| act_ironclad_enhancement_integration | Enhancement Integration | passive | Integrated weapons count magical; detect enhancement tampering since last rest. |
| act_ironclad_between_awareness | Between Awareness | passive | Cannot be surprised while conscious; advantage on initiative. |
| act_ironclad_iron_endurance | Iron Endurance | passive_reaction | Choose physical resistance; once/long rest DC 15 WIS to drop to 1 HP. |
| act_ironclad_code_sworn_precision | Code-Sworn Precision | passive | Once per turn, treat attack d20 roll 9 or lower as 10. |
| act_ironclad_resonant_surge | Resonant Surge | combat_bonus_action | 1-minute surge: +10 speed, extra resonant damage, anti-forced-movement stability. |
| act_ironclad_steel_resolve | Steel Resolve | passive | Immune frightened; reaction reroll vs charm/compulsion save failure. |
| act_ironclad_perfect_kata | Perfect Kata | combat | One Attack action with advantage on all attacks and PB bonus damage per hit; 1/long rest. |
| act_ironclad_resonant_armor | Resonant Armor | passive_reaction | Unarmored AC formula + reaction damage reduction uses per long rest. |
| act_ironclad_echomind_clarity | Echomind Clarity | passive | Advantage on WIS saves; immune to forced oath-breaking control effects. |
| act_ironclad_between_mastery | Between Mastery | passive | Dodge as bonus action; Resonant Surge upgraded duration/damage. |
| act_ironclad_blade_sworn | Blade-Sworn | passive_weapon | Weapon returns to hand, gains extra damage, anti-disarm, incorporeal strike support. |
| act_ironclad_seventh_vein | The Seventh Vein | capstone | Double WIS mod on Resonant Strike, 2 surge uses/short rest, final action on death, resonant damage immunity. |

## actions.tsv (subclass feature actions)

| id | title | category | description |
|---|---|---|---|
| act_path_iron_lord_lords_resonance | Lord's Resonance | subclass_iron_lord | Social advantage while representing lord; bonus damage while protecting designated ward. |
| act_path_iron_lord_iron_vanguard | Iron Vanguard | subclass_iron_lord | Reaction movement to interpose and become target instead of ward. |
| act_path_iron_lord_code_of_house | Code of the House | subclass_iron_lord | Anti-retreat control resistance and extend endurance protection to ward. |
| act_path_iron_lord_unbroken_fealty | Unbroken Fealty | subclass_iron_lord | Transfer HP to ward when they drop to 0 HP; once per long rest. |
| act_path_sutensai_sutras_edge | Sutra's Edge | subclass_sutensai_blade | Iron Rite kill rider blocks undeath/reanimation; bonus damage vs corrupted/displaced echominds. |
| act_path_sutensai_theological_authority | Theological Authority | subclass_sutensai_blade | Religion expertise and once/long rest pacification invocation. |
| act_path_sutensai_between_consecration | Between Consecration | subclass_sutensai_blade | Consecrate area with anti-undead pressure, ally death-save support, and perception of linked entities. |
| act_path_sutensai_final_sutra | The Final Sutra | subclass_sutensai_blade | Sutra-bind soul for questioning and deny passage/recovery window. |
| act_path_debt_debts_memory | Debt's Memory | subclass_undying_debt | Mark debt targets, gain advantage and bonus damage against them/subordinates. |
| act_path_debt_hollow_memory | Hollow Memory | subclass_undying_debt | Meditative memory-construction consultation granting targeted skill advantage. |
| act_path_debt_unfinished_business | Unfinished Business | subclass_undying_debt | At 0 HP remain at 1 briefly with offensive/stability boosts; once/long rest. |
| act_path_debt_debt_becomes_blade | The Debt Becomes the Blade | subclass_undying_debt | Manifest Debt's Blade heavy strike; auto-critical vs named debt targets. |
| act_path_flesh_temple_form | Temple Form | subclass_flesh_temple | Choose Water/Fire/Iron combat form, switchable on short rest. |
| act_path_flesh_spiritual_violence | Spiritual Violence | subclass_flesh_temple | Bonus resonant weapon damage and self-heal on dropping foes. |
| act_path_flesh_perfect_instrument | Perfect Instrument | subclass_flesh_temple | Max HP increase, CON save advantage, boosted death save profile. |
| act_path_flesh_temple_burns | The Temple Burns | subclass_flesh_temple | 1-minute overdrive: max melee damage and broad resistance with unreducible backlash. |

## items.tsv (draft)

| id | title | category | description | inventory_width | inventory_height |
|---|---|---|---|---|---|
| item_resonant_blade | Resonant Blade | weapon | Primary class weapon (long or short configuration). | 2 | 1 |
| item_voidsteel_tanto | Voidsteel Tanto | weapon | Secondary blade. | 1 | 1 |
| item_circuit_lance | Circuit Lance | weapon | Class-proficient polearm variant. | 2 | 2 |
| item_iron_whip | Iron-Whip | weapon | Flexible resonant weapon option. | 2 | 1 |
| item_force_mace | Force Mace | weapon | Class-proficient impact weapon. | 1 | 2 |
| item_wire_mesh_armor | Wire-Mesh Armor | armor | Starter armor option. | 2 | 2 |
| item_layered_plate_armor | Layered Plate Armor | armor | Heavy starter armor option. | 2 | 3 |
| item_resonant_shield | Resonant Shield | armor | Class-proficient shield. | 2 | 2 |
| item_oath_mark_lord_seal | Lord's Seal | symbol | Oath marker object for narrative and social checks. | 1 | 1 |
| item_oath_mark_sutra_medallion | Sutra Medallion | symbol | Oath marker object for narrative and social checks. | 1 | 1 |
| item_forge_maintenance_kit_basic | Forge Maintenance Kit (Basic) | gear | Required for resonance meditation and field upkeep. | 1 | 1 |
| item_trade_metal_pouch_15 | Trade-Metal Pouch (15) | currency | Starting currency bundle equivalent. | 1 | 1 |

## archetypes.tsv (draft)

| id | title | category | description |
|---|---|---|---|
| arc_class_ironclad_base | Class: Ironclad Samurai (Base) | class | Applies class progression core and level-gated feature unlocks. |
| arc_class_ironclad_path_iron_lord | Vein Path: Oath of the Iron Lord | subclass | Ward-protection and fealty-centered subclass package. |
| arc_class_ironclad_path_sutensai_blade | Vein Path: Oath of the Sutensai Blade | subclass | Theology-enforcer package with rite and consecration mechanics. |
| arc_class_ironclad_path_undying_debt | Vein Path: Oath of the Undying Debt | subclass | Vengeance-memory subclass with target-marked escalation. |
| arc_class_ironclad_path_flesh_temple | Vein Path: Oath of the Flesh Temple | subclass | Combat-as-worship subclass with form-based toolkit. |

## documents.tsv (draft)

| id | title | category | source_file | description |
|---|---|---|---|---|
| doc_class_ironclad_overview | Ironclad Samurai - Overview | character_options | classes/01_ironclad_samurai.md | Core lore and class fantasy. |
| doc_class_ironclad_world_context | Ironclad Samurai - In the World | character_options | classes/01_ironclad_samurai.md | Social and institutional role in Tesshari. |
| doc_class_ironclad_roleplay | Ironclad Samurai - Roleplaying | character_options | classes/01_ironclad_samurai.md | Obligation and code-driven roleplay guidance. |
| doc_class_ironclad_war_context | Ironclad Samurai - Ascension War Context | reference | classes/01_ironclad_samurai.md | Claimant alignment pressures and campaign stakes. |

## scripts.tsv (draft hooks)

| id | title | trigger | purpose |
|---|---|---|---|
| scr_ironclad_on_add_initialize | Ironclad On Add Initialize | on_archetype_add | Set class label, initialize resource counters, and prompt Vein Oath/discipline picks. |
| scr_ironclad_on_level_unlocks | Ironclad Level Unlocks | on_level_change | Grant level-gated actions and update unlocked resources/formulas. |
| scr_ironclad_resonance_fracture_state | Resonance Fracture State | on_tag_or_flag_change | Apply/remove disadvantage state based on oath-violation and atonement resolution. |
| scr_ironclad_resonant_surge_scaling | Resonant Surge Scaling | on_level_change | Upgrade surge duration/damage at level 16 and uses at level 20. |
| scr_ironclad_resource_reset_short_rest | Ironclad Short Rest Reset | on_short_rest | Reset short-rest resources (Resonant Surge, Iron Breath, etc.). |
| scr_ironclad_resource_reset_long_rest | Ironclad Long Rest Reset | on_long_rest | Reset long-rest resources (Perfect Kata, Iron Endurance, subclass dailies). |
| scr_ironclad_blade_sworn_bind | Blade-Sworn Bind Weapon | on_feature_unlock | Bind selected weapon and apply return/disarm/incorporeal traits. |
| scr_ironclad_final_action_on_death | Seventh Vein Final Action | on_death_pre_resolve | Permit one final action before death finalization when capstone is active. |

## Source Crosswalk

| source_feature | target_entity | target_id |
|---|---|---|
| Vein of Iron | attribute + action + script | attr_vein_oath + act_ironclad_select_vein_oath + scr_ironclad_resonance_fracture_state |
| Resonant Strike | action | act_ironclad_resonant_strike |
| Vein Discipline (L1/L2) | attributes + actions | attr_vein_discipline_lvl1/2 + act_ironclad_between_stance etc. |
| Vein Path | archetype + actions | arc_class_ironclad_path_* + act_path_* |
| Level progression (1-20) | chart + scripts | chart_ironclad_level_progression + scr_ironclad_on_level_unlocks |
| Starting equipment | items + chart | item_* + chart_ironclad_starting_gear |

## Card Combat Overrides (AP Turn System)

Use this table as the combat-card export for Ironclad abilities.

### actions.tsv (combat cards)

| id | title | category | ap_cost | play_limit_per_turn | is_card | is_basic_attack | description |
|---|---|---|---|---|---|---|---|
| card_ironclad_basic_attack | Basic Attack (Ironclad) | combat_card | 0 | 1 | true | true | Free attack card; once per turn. |
| card_ironclad_between_stance | Between Stance | combat_card | 1 | 1 | true | false | Mobility-defense attack rider card. |
| card_ironclad_iron_breath | Iron Breath | utility_card | 1 | 1 | true | false | Signature suppression card. |
| card_ironclad_resonant_strike | Resonant Strike | combat_card | 1 | 1 | true | false | Damage boost card tied to Wisdom scaling. |
| card_ironclad_stillness_kata | Stillness Kata | combat_card | 1 | 1 | true | false | If stationary this turn, gain offensive bonus. |
| card_ironclad_burden_strike | Burden Strike | reaction_card | 1 | 1 | true | false | Ally-protection reaction card. |
| card_ironclad_iron_witness | Iron Witness | combat_card | 1 | 1 | true | false | Gain temporary HP on nearby takedown trigger. |
| card_ironclad_resonant_surge | power_card | combat_card | 2 | 1 | true | false | Temporary power state; AP spend and duration tracked by script. |
| card_ironclad_perfect_kata | power_card | combat_card | 3 | 1 | true | false | High-impact burst card; once per long-rest by additional tracker. |
| card_ironclad_resonant_armor | reaction_card | defense_card | 1 | 1 | true | false | Damage reduction reaction with use tracker. |
| card_ironclad_blade_sworn | passive_card | passive_card | 0 | 1 | true | false | Passive card marker for bonded weapon behavior. |
| card_ironclad_seventh_vein | capstone_card | passive_card | 0 | 1 | true | false | Capstone card package enabling final-action logic and surge scaling. |

### actions.tsv (subclass cards)

| id | title | category | ap_cost | play_limit_per_turn | is_card | is_basic_attack | description |
|---|---|---|---|---|---|---|---|
| card_iron_lord_lords_resonance | Lord's Resonance | subclass_card | 1 | 1 | true | false | Ward-linked offense card. |
| card_iron_lord_iron_vanguard | Iron Vanguard | subclass_reaction_card | 1 | 1 | true | false | Interpose reaction card. |
| card_iron_lord_unbroken_fealty | Unbroken Fealty | subclass_power_card | 2 | 1 | true | false | Emergency ward sustain card. |
| card_sutensai_sutras_edge | Sutra's Edge | subclass_card | 1 | 1 | true | false | Rite/anti-reanimation strike card. |
| card_sutensai_between_consecration | Between Consecration | subclass_power_card | 2 | 1 | true | false | Area consecration card. |
| card_sutensai_final_sutra | The Final Sutra | subclass_power_card | 3 | 1 | true | false | Soul-bind finishing card. |
| card_debt_debts_memory | Debt's Memory | subclass_card | 1 | 1 | true | false | Mark target and apply debt bonuses. |
| card_debt_unfinished_business | Unfinished Business | subclass_power_card | 2 | 1 | true | false | Death-defiance card state. |
| card_debt_becomes_blade | The Debt Becomes the Blade | subclass_power_card | 3 | 1 | true | false | High-damage debt finisher card. |
| card_flesh_temple_form | Temple Form | subclass_card | 1 | 1 | true | false | Form selection/switch card. |
| card_flesh_spiritual_violence | Spiritual Violence | subclass_card | 1 | 1 | true | false | Damage plus sustain card. |
| card_flesh_temple_burns | The Temple Burns | subclass_power_card | 3 | 1 | true | false | Overdrive card with backlash resolution. |

### scripts.tsv (card enforcement additions)

| id | title | trigger | purpose |
|---|---|---|---|
| scr_ironclad_validate_card_once_per_turn | Ironclad Card Once/Turn Validator | on_action_attempt | Reject card play if card ID already exists in `cards_played_this_turn`. |
| scr_ironclad_validate_ap_cost | Ironclad AP Cost Validator | on_action_attempt | Ensure `ap_current >= ap_cost` for non-free cards. |
| scr_ironclad_mark_basic_attack_use | Ironclad Basic Attack Marker | on_action_resolve | Set `basic_attack_used_this_turn = true` on basic attack card play. |
