# Quest Bound Draft: Status Effects and Keywords (Card/AP Turn System)

This file defines shared combat language for all player and monster cards.

Design goals:

- Deterministic, no-dice resolution support.
- Clear, reusable effect vocabulary.
- Turn-based duration handling.
- Script-friendly keyword IDs.

## attributes.tsv (draft)

| id | title | type | default | category | description |
|---|---|---|---|---|---|
| attr_status_list | Active Status List | text |  | status | Serialized list of active status IDs on this unit. |
| attr_status_stacks_map | Status Stacks Map | text |  | status | Serialized key/value of status stack counts. |
| attr_status_duration_map | Status Duration Map | text |  | status | Serialized key/value of remaining turn durations. |
| attr_guard_value | Guard Value | number | 0 | status_derived | Flat damage prevention from Guard-family effects. |
| attr_exposed_value | Exposed Value | number | 0 | status_derived | Flat damage amplification from Expose-family effects. |
| attr_staggered | Staggered | boolean | false | status_derived | Restricts AP/card options while active. |
| attr_overheat_stacks | Overheat Stacks | number | 0 | status_derived | Heat pressure tracker for machine-intensive actions. |
| attr_marked_target | Marked Target | boolean | false | status_derived | Unit is marked for focused interactions. |
| attr_shield_temp | Shield Temp HP | number | 0 | status_derived | Temporary shield pool from shield keywords. |

## charts.tsv (draft: status catalog)

| id | title | columns | rows |
|---|---|---|---|
| chart_status_catalog | Status Catalog | status_id,name,type,default_duration,max_stacks,stack_rule,summary | guard,fortify,expose,stagger,bleed,burn,overheat,mark,root,silence,veil,taunt,vulnerable,regen,shielded |
| chart_status_timing | Status Timing Rules | timing_key,description | on_apply,on_turn_start,on_turn_end,on_hit,on_damaged,on_card_play,on_expire |
| chart_status_dispel_groups | Status Dispel Groups | group_id,members | defensive_buffs,offensive_debuffs,mobility_locks,resource_pressure |

## statuses.tsv (draft)

| status_id | name | category | default_duration_turns | max_stacks | stack_rule | dispel_group | rules_text |
|---|---|---|---|---|---|---|---|
| st_guard | Guard | defensive_buff | 1 | 5 | add | defensive_buffs | Reduce incoming damage by Guard Value, then decrement one stack at end of owner turn. |
| st_fortify | Fortify | defensive_buff | 2 | 3 | refresh | defensive_buffs | Incoming control effects have reduced potency while active. |
| st_expose | Expose | offensive_debuff | 2 | 5 | add | offensive_debuffs | Increase incoming damage by Exposed Value. |
| st_stagger | Stagger | offensive_debuff | 1 | 1 | refresh | offensive_debuffs | Unit cannot play power cards this turn. |
| st_bleed | Bleed | damage_over_time | 2 | 5 | add | offensive_debuffs | Take fixed damage at end of turn per stack. |
| st_burn | Burn | damage_over_time | 2 | 5 | add | offensive_debuffs | Take fixed damage at end of turn; burns remove one Guard stack before damage. |
| st_overheat | Overheat | resource_pressure | 3 | 6 | add | resource_pressure | At threshold, reduce AP max by 1 until stacks drop below threshold. |
| st_mark | Mark | tactical_debuff | 2 | 1 | refresh | offensive_debuffs | Marked target receives bonus effects from mark-synergy cards. |
| st_root | Root | mobility_lock | 1 | 1 | refresh | mobility_locks | Unit cannot reposition via mobility cards. |
| st_silence | Silence | casting_lock | 1 | 1 | refresh | mobility_locks | Unit cannot play utility/control card categories. |
| st_veil | Veil | defensive_buff | 1 | 1 | refresh | defensive_buffs | First incoming hostile card this turn loses bonus riders. |
| st_taunt | Taunt | aggro_control | 1 | 1 | refresh | offensive_debuffs | Unit must target taunt source when possible. |
| st_vulnerable | Vulnerable | offensive_debuff | 1 | 3 | add | offensive_debuffs | Increase final damage multiplier by fixed step per stack. |
| st_regen | Regeneration | sustain_buff | 2 | 3 | add | defensive_buffs | Recover fixed HP at start of turn per stack. |
| st_shielded | Shielded | defensive_buff | 2 | 1 | refresh | defensive_buffs | Gain shield temp pool that is consumed before HP. |

## keywords.tsv (draft)

| keyword_id | keyword | rules_text |
|---|---|---|
| kw_guard | Guard X | Gain X Guard Value (or X Guard stacks depending on card template). |
| kw_fortify | Fortify | Apply Fortify status. |
| kw_expose | Expose X | Apply X Expose value/stacks to target. |
| kw_stagger | Stagger | Apply Stagger (locks power cards for 1 turn). |
| kw_bleed | Bleed X | Apply X Bleed stacks. |
| kw_burn | Burn X | Apply X Burn stacks. |
| kw_overheat | Overheat X | Add X Overheat stacks. |
| kw_mark | Mark | Apply Mark to target. |
| kw_root | Root | Apply Root for 1 turn. |
| kw_silence | Silence | Apply Silence for 1 turn. |
| kw_veil | Veil | Apply Veil for 1 turn. |
| kw_taunt | Taunt | Apply Taunt to target. |
| kw_vulnerable | Vulnerable X | Apply X Vulnerable stacks. |
| kw_regen | Regen X | Apply X Regeneration stacks. |
| kw_shield | Shield X | Gain X temporary shield pool. |
| kw_pierce | Pierce X | Ignore X Guard/Shield when dealing damage. |
| kw_cleanse | Cleanse | Remove one removable debuff from target. |
| kw_dispel | Dispel | Remove one removable buff from target. |
| kw_echo | Echo | Repeat a card's base effect once (no additional riders). |
| kw_overclock | Overclock | Increase card effect this turn; then apply Overheat. |

## actions.tsv (draft: status utility cards)

| id | title | category | ap_cost | play_limit_per_turn | is_card | is_basic_attack | description |
|---|---|---|---|---|---|---|---|
| card_status_guard_protocol | Guard Protocol | defense_card | 1 | 1 | true | false | Apply Guard to self or ally. |
| card_status_expose_weakpoint | Expose Weakpoint | control_card | 1 | 1 | true | false | Apply Expose to enemy target. |
| card_status_stagger_strike | Stagger Strike | combat_card | 1 | 1 | true | false | Deal fixed damage and apply Stagger. |
| card_status_cleanse_cycle | Cleanse Cycle | utility_card | 1 | 1 | true | false | Remove one debuff from ally target. |
| card_status_heat_purge | Heat Purge | utility_card | 1 | 1 | true | false | Remove Overheat stacks from self. |
| card_status_mark_target | Mark Target | control_card | 1 | 1 | true | false | Apply Mark to enemy target. |
| card_status_overclock_drive | Overclock Drive | power_card | 2 | 1 | true | false | Empower next card this turn and add Overheat stacks. |

## scripts.tsv (draft hooks)

| id | title | trigger | purpose |
|---|---|---|---|
| scr_status_apply | Status Apply Resolver | on_action_resolve | Add status, initialize duration/stacks, and handle refresh/add stack rule. |
| scr_status_tick_start | Status Tick Start | on_turn_start | Process start-of-turn effects (regen, AP pressure, etc.). |
| scr_status_tick_end | Status Tick End | on_turn_end | Process end-of-turn effects (bleed/burn) and decrement durations. |
| scr_status_expire_cleanup | Status Expire Cleanup | on_turn_end | Remove expired statuses and zero derived fields. |
| scr_status_damage_pipeline | Status Damage Pipeline | on_damage_calculation | Apply Guard/Expose/Vulnerable/Pierce interactions in deterministic order. |
| scr_status_card_lock_checks | Status Card Lock Checks | on_action_attempt | Enforce Stagger/Silence/Root restrictions against card categories/tags. |
| scr_status_cleanse_dispel | Status Cleanse/Dispel | on_action_resolve | Remove eligible status by dispel group rules. |

## Deterministic Resolution Order

| step | rule |
|---|---|
| 1 | Read base card effect value. |
| 2 | Apply attacker-side modifiers (keyword amplifiers, overclock bonuses). |
| 3 | Apply defender-side prevention (shield, guard, fortify reductions). |
| 4 | Apply defender-side amplification (expose, vulnerable). |
| 5 | Clamp to minimum 0 final damage/effect where applicable. |
| 6 | Commit HP/status/AP changes and write combat log event. |

## Naming Convention Notes

| scope | format | example |
|---|---|---|
| status IDs | `st_<name>` | `st_overheat` |
| keyword IDs | `kw_<name>` | `kw_pierce` |
| status cards | `card_status_<name>` | `card_status_expose_weakpoint` |
| scripts | `scr_status_<name>` | `scr_status_tick_end` |
