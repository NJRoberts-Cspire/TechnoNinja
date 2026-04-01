# Quest Bound Draft: Core Monsters Card Combat (AP Turn System)

This file standardizes monster behavior under the same player-facing combat rules:

- Turn-based only.
- Monster abilities are cards.
- Cards cost AP unless cost is 0.
- Basic attack is free but once per turn.
- A monster can play multiple cards in one turn only if AP allows.
- Each card can only be played once per turn.

## attributes.tsv (draft)

| id | title | type | default | category | description |
|---|---|---|---|---|---|
| attr_monster_role | Monster Role | list | skirmisher | combat_ai | Archetypal role: skirmisher, brute, controller, support, boss. |
| attr_monster_tier | Monster Tier | list | standard | combat_ai | minion, standard, elite, boss. |
| attr_monster_ap_max | Monster AP Max | number | 2 | combat_core | AP refreshed at monster turn start. |
| attr_monster_ap_current | Monster AP Current | number | 2 | combat_core | AP available for card play on current turn. |
| attr_monster_basic_attack_used_this_turn | Monster Basic Attack Used This Turn | boolean | false | combat_core | Enforces one free basic attack card per monster turn. |
| attr_monster_cards_played_this_turn | Monster Cards Played This Turn | text |  | combat_core | Serialized list of monster card IDs played this turn. |
| attr_monster_threat_state | Threat State | list | neutral | combat_ai | neutral, pressured, advantaged, desperate. |
| attr_monster_target_lock | Target Lock | text |  | combat_ai | Current preferred target identifier. |
| attr_monster_reaction_card_used | Reaction Card Used | boolean | false | combat_core | Optional once-per-round reaction limiter. |

## charts.tsv (draft)

| id | title | columns | rows |
|---|---|---|---|
| chart_monster_ap_by_tier | Monster AP by Tier | tier,ap_max_default | minion=1,standard=2,elite=3,boss=4 |
| chart_monster_role_card_weights | Monster Role Card Weights | role,attack_weight,defense_weight,control_weight,sustain_weight | skirmisher,brute,controller,support,boss |
| chart_monster_turn_priority | Monster Turn Priority | priority,condition,card_type | finish_kill,escape_pressure,apply_control,damage_cycle,setup |
| chart_monster_card_tags | Monster Card Tags | tag,description | attack,defense,control,mobility,sustain,finisher,reaction |

## actions.tsv (draft: universal monster cards)

| id | title | category | ap_cost | play_limit_per_turn | is_card | is_basic_attack | ai_tag | description |
|---|---|---|---|---|---|---|---|---|
| card_monster_basic_attack | Monster Basic Attack | combat_card | 0 | 1 | true | true | attack | Free baseline attack card, once per turn. |
| card_monster_guarded_step | Guarded Step | defense_card | 1 | 1 | true | false | mobility | Reposition while applying a brief defensive state. |
| card_monster_pressure_strike | Pressure Strike | combat_card | 1 | 1 | true | false | attack | Standard AP attack card for damage cycling. |
| card_monster_crushing_blow | Crushing Blow | power_card | 2 | 1 | true | false | finisher | High-damage card, usually for low-health targets. |
| card_monster_suppressive_howl | control_card | control_card | 2 | 1 | true | false | control | Applies debuff/control state to one or more enemies. |
| card_monster_harden_plating | defense_card | defense_card | 1 | 1 | true | false | defense | Gain temporary mitigation for incoming damage. |
| card_monster_recover_cycle | sustain_card | sustain_card | 1 | 1 | true | false | sustain | Recover limited HP or cleanse one minor status. |
| card_monster_reactive_counter | reaction_card | reaction_card | 1 | 1 | true | false | reaction | Triggered response card for basic anti-focus behavior. |
| card_monster_end_turn | End Turn | combat_core | 0 | 1 | false | false | system | Explicit turn end action for script flow. |

## actions.tsv (draft: boss pattern cards)

| id | title | category | ap_cost | play_limit_per_turn | is_card | is_basic_attack | ai_tag | description |
|---|---|---|---|---|---|---|---|---|
| card_boss_phase_shift | Phase Shift | boss_card | 2 | 1 | true | false | control | Transition behavior/state between boss phases. |
| card_boss_field_pressure | boss_card | 2 | 1 | true | false | control | Battlefield-wide pressure effect. |
| card_boss_execution_window | boss_finisher_card | 3 | 1 | true | false | finisher | Heavy strike card used under threshold conditions. |
| card_boss_reinforcement_call | boss_summon_card | 2 | 1 | true | false | support | Summon/add allied units based on encounter script. |

## archetypes.tsv (draft)

| id | title | category | description |
|---|---|---|---|
| arc_monster_base_minion | Monster Base: Minion | monster_base | Low AP, simple card loop. |
| arc_monster_base_standard | Monster Base: Standard | monster_base | Default AP and balanced card profile. |
| arc_monster_base_elite | Monster Base: Elite | monster_base | Higher AP and expanded card set. |
| arc_monster_base_boss | Monster Base: Boss | monster_base | Multi-card turns, phase scripting, encounter control hooks. |
| arc_monster_role_skirmisher | Monster Role: Skirmisher | monster_role | Mobility and pressure-focused card choices. |
| arc_monster_role_brute | Monster Role: Brute | monster_role | Damage-forward card choices. |
| arc_monster_role_controller | Monster Role: Controller | monster_role | Control/debuff-heavy card choices. |
| arc_monster_role_support | Monster Role: Support | monster_role | Sustain and ally enablement card choices. |

## scripts.tsv (draft hooks)

| id | title | trigger | purpose |
|---|---|---|---|
| scr_monster_turn_start_refresh_ap | Monster Turn Start AP Refresh | on_turn_start | Set `attr_monster_ap_current = attr_monster_ap_max` and clear per-turn card trackers. |
| scr_monster_validate_card_play | Monster Card Validator | on_action_attempt | Enforce active turn, AP availability, once-per-turn-per-card, and basic attack limit. |
| scr_monster_apply_ap_cost | Monster AP Cost Apply | on_action_resolve | Subtract AP cost after successful monster card play. |
| scr_monster_mark_card_played | Monster Card Played Log | on_action_resolve | Append card ID to `attr_monster_cards_played_this_turn`; set basic attack usage when relevant. |
| scr_monster_ai_choose_cards | Monster AI Card Choice | on_turn_start | Select card sequence based on role, threat state, and AP budget. |
| scr_monster_ai_target_selection | Monster AI Target Selection | on_turn_start | Determine target lock using threat/position/health heuristics. |
| scr_monster_end_turn | Monster End Turn | on_action_resolve:card_monster_end_turn | Finalize turn, reset temporary decision flags, and pass initiative. |
| scr_monster_reaction_reset | Monster Reaction Reset | on_round_start | Reset `attr_monster_reaction_card_used` for new round. |

## Encounter Builder Notes

| id | topic | guidance |
|---|---|---|
| enc_note_01 | AP budget baseline | Start minions at AP 1, standards at AP 2, elites at AP 3, bosses at AP 4. |
| enc_note_02 | Card count per unit | Use 3-5 cards for standard monsters, 6-8 for elites, 8-12 for bosses. |
| enc_note_03 | Boss turn identity | Boss turns should include 1 pressure card plus 1-2 identity cards when AP allows. |
| enc_note_04 | Deterministic combat | Resolve card effects with fixed values and scripted checks; avoid dice. |
| enc_note_05 | Once-per-turn clarity | Keep `play_limit_per_turn = 1` for most monster cards to preserve readable turn states. |
