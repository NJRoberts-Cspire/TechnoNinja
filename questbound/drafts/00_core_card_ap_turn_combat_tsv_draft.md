# Quest Bound Draft: Core Card/AP Turn Combat

This file defines the shared combat engine for Tesshari.

System rules encoded here:

- Turn-based combat only.
- All abilities are cards.
- Cards spend AP unless AP cost is 0.
- Basic attack is free (0 AP) but can be used only once per turn.
- You may play as many cards as you want in one turn if AP is available.
- You may only play each card once per turn.

## attributes.tsv (draft)

| id | title | type | default | category | description |
|---|---|---|---|---|---|
| attr_ap_max | AP Max | number | 3 | combat_core | Maximum AP refreshed at start of turn. |
| attr_ap_current | AP Current | number | 3 | combat_core | Spendable AP during active turn. |
| attr_turn_number | Turn Number | number | 0 | combat_core | Global/encounter turn counter. |
| attr_active_turn | Active Turn | boolean | false | combat_core | True while this unit is the active combatant. |
| attr_basic_attack_used_this_turn | Basic Attack Used This Turn | boolean | false | combat_core | Enforces one free basic attack per turn. |
| attr_cards_played_this_turn | Cards Played This Turn | text |  | combat_core | Serialized list of card action IDs played this turn. |
| attr_card_play_locked | Card Play Locked | boolean | false | combat_core | Prevents play when outside valid turn state. |

## charts.tsv (draft)

| id | title | columns | rows |
|---|---|---|---|
| chart_card_action_schema | Card Action Schema | field,description | card_id,title,ap_cost,play_limit_per_turn,is_basic_attack,resolution_type |
| chart_resolution_types | Resolution Types | key,description | attack,defense,utility,status,mobility |
| chart_turn_sequence | Turn Sequence | step,script_hook | start_turn,play_card,end_turn |

## actions.tsv (draft)

| id | title | category | ap_cost | play_limit_per_turn | is_card | is_basic_attack | description |
|---|---|---|---|---|---|---|---|
| act_core_basic_attack_card | Basic Attack | combat_card | 0 | 1 | true | true | Free basic attack card. Can be played once per turn. |
| act_core_end_turn | End Turn | combat_core | 0 | 1 | false | false | Ends active combatant turn and advances turn flow. |

## scripts.tsv (draft hooks)

| id | title | trigger | purpose |
|---|---|---|---|
| scr_core_turn_start_refresh_ap | Turn Start AP Refresh | on_turn_start | Set `ap_current = ap_max`, clear per-turn card trackers, unlock card play. |
| scr_core_validate_card_play | Validate Card Play | on_action_attempt | Block if not active turn, insufficient AP, or card already played this turn. |
| scr_core_apply_card_cost | Apply Card Cost | on_action_resolve | Subtract AP cost from `ap_current` for played card. |
| scr_core_mark_card_played | Mark Card Played | on_action_resolve | Append action ID to `cards_played_this_turn` and set basic attack flag when relevant. |
| scr_core_end_turn | End Turn Handler | on_action_resolve:act_core_end_turn | Lock card play and pass initiative to next combatant. |

## windows/pages notes (implementation)

| id | target | note |
|---|---|---|
| ui_window_combat_hand | window | Show all available cards for active combatant with AP cost and disabled state when not playable. |
| ui_window_ap_tracker | window | Display AP current/max and per-turn basic attack usage. |
| ui_page_combat | page | Contains hand window, AP tracker, and turn controls. |
