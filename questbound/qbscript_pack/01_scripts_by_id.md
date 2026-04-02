# Tesshari QBScript Pack (All Script IDs)

This maps each `scripts.tsv` row to concrete QBScript code.

## Core

### `scr_core_turn_start_refresh_ap`

Attach: Game Manager script run at turn start, or call from your turn-advance action.

```qbscript
beginTurn()
announce('Turn started. AP refreshed to {{Owner.Attribute("AP Current").value}}.')
return
```

### `scr_core_validate_card_play`

Attach: Global utility caller from action scripts.

```qbscript
// Usage pattern inside action scripts:
// ok = runCard('card_id', 1, false)
// if !ok:
//   return
return
```

### `scr_core_apply_card_cost`

Attach: Included in `runCard()` global helper.

```qbscript
// Applied by runCard(actionKey, apCost, isBasicAttack)
return
```

### `scr_core_mark_card_played`

Attach: Included in `runCard()` global helper.

```qbscript
// Applied by runCard(actionKey, apCost, isBasicAttack)
return
```

### `scr_core_end_turn`

Attach: Action script for `act_core_end_turn` or `card_monster_end_turn`.

```qbscript
on_activate():
  endTurnLock()
  if Scene:
    Scene.advanceTurnOrder()
  return
```

## Forged

### `scr_forged_on_add_initialize`

Attach: Archetype `arc_race_forged_base` -> `on_add()`

```qbscript
on_add():
  Owner.Attribute('Species').set('Forged')
  Owner.Attribute('Maintenance State').set('serviced')
  Owner.Attribute('Chassis Intact').set(true)
  Owner.Attribute('Forged Resilience Used').set(false)
  return
```

### `scr_forged_on_level_5_unlock`

Attach: manual utility script (run on level-up workflow).

```qbscript
lvl = number(Owner.Attribute('Level').value)
if lvl >= 5:
  announce('Forged level 5 reached. Choose Augmentation Slot 2.')
return
```

### `scr_forged_on_level_10_replace`

Attach: manual utility script (run on level-up workflow).

```qbscript
lvl = number(Owner.Attribute('Level').value)
if lvl >= 10:
  announce('Forged level 10 reached. You may replace one augmentation.')
return
```

### `scr_forged_on_long_rest_maintenance`

Attach: Rest action.

```qbscript
state = text(Owner.Attribute('Maintenance State').value)
if state == 'degraded':
  ex = Owner.Attribute('Exhaustion')
  if ex:
    ex.add(1)
  announce('Maintenance missed. Exhaustion increased.')
else:
  announce('Maintenance complete.')
return
```

### `scr_forged_on_zero_hp_resilience`

Attach: Damage resolution action or GM utility.

```qbscript
hp = Owner.Attribute('Current HP')
used = Owner.Attribute('Forged Resilience Used')
if hp && used:
  if number(hp.value) <= 0 && text(used.value) != 'true':
    hp.set(1)
    used.set(true)
    announce('Forged Resilience triggered: drop to 1 HP.')
return
```

### `scr_forged_card_tag_init`

Attach: `arc_race_forged_base` on_add.

```qbscript
Owner.setProperty('race_tag', 'forged')
return
```

## Ironclad

### `scr_ironclad_on_add_initialize`

Attach: `arc_class_ironclad_base` on_add.

```qbscript
on_add():
  Owner.Attribute('Class').set('Ironclad Samurai')
  Owner.Attribute('Resonant Surge Uses').set(1)
  Owner.Attribute('Perfect Kata Used').set(false)
  Owner.Attribute('Iron Endurance Used').set(false)
  return
```

### `scr_ironclad_on_level_unlocks`

Attach: level-up utility.

```qbscript
lvl = number(Owner.Attribute('Level').value)
announce('Ironclad level {{lvl}} processed for unlock checks.')
return
```

### `scr_ironclad_resonance_fracture_state`

Attach: utility script.

```qbscript
fracture = Owner.Attribute('Resonance Fracture')
if fracture && text(fracture.value) == 'true':
  announce('Resonance Fracture active.')
return
```

### `scr_ironclad_resonant_surge_scaling`

Attach: level-up utility.

```qbscript
lvl = number(Owner.Attribute('Level').value)
if lvl >= 16:
  Owner.Attribute('Surge Bonus Damage Dice').set('3d6')
if lvl >= 20:
  Owner.Attribute('Resonant Surge Uses').set(2)
return
```

### `scr_ironclad_resource_reset_short_rest`

Attach: short rest action.

```qbscript
Owner.Attribute('Resonant Surge Uses').set(1)
return
```

### `scr_ironclad_resource_reset_long_rest`

Attach: long rest action.

```qbscript
Owner.Attribute('Perfect Kata Used').set(false)
Owner.Attribute('Iron Endurance Used').set(false)
return
```

### `scr_ironclad_blade_sworn_bind`

Attach: feature unlock action.

```qbscript
Owner.Attribute('Blade-Sworn Bound Weapon').set(true)
announce('Blade-Sworn bond established.')
return
```

### `scr_ironclad_final_action_on_death`

Attach: death-resolution utility.

```qbscript
if text(Owner.Attribute('Seventh Vein Defined').value) == 'true':
  announce('Seventh Vein active: one final action allowed.')
return
```

### `scr_ironclad_validate_card_once_per_turn`

Attach: handled by `runCard()`.

```qbscript
// Already enforced by hasCardPlayed(actionKey)
return
```

### `scr_ironclad_validate_ap_cost`

Attach: handled by `runCard()`.

```qbscript
// Already enforced by validateCardPlay(actionKey, apCost, isBasicAttack)
return
```

### `scr_ironclad_mark_basic_attack_use`

Attach: handled by `runCard()`.

```qbscript
// Already enforced by markCardPlayed(actionKey, isBasicAttack)
return
```

## Monsters

### `scr_monster_turn_start_refresh_ap`

Attach: NPC turn start utility.

```qbscript
apMax = Owner.Attribute('Monster AP Max')
apCur = Owner.Attribute('Monster AP Current')
if apMax && apCur:
  apCur.set(number(apMax.value))
Owner.Attribute('Monster Basic Attack Used This Turn').set(false)
Owner.Attribute('Monster Cards Played This Turn').set('')
return
```

### `scr_monster_validate_card_play`

Attach: monster action scripts via helper.

```qbscript
// Use runCard(cardId, apCost, isBasic) in monster action scripts too.
return
```

### `scr_monster_apply_ap_cost`

Attach: handled by helper when using AP attributes.

```qbscript
return
```

### `scr_monster_mark_card_played`

Attach: helper.

```qbscript
return
```

### `scr_monster_ai_choose_cards`

Attach: simple AI chooser utility.

```qbscript
role = text(Owner.Attribute('Monster Role').value)
if role == 'brute':
  announce('{{Owner.title}} prioritizes damage cards.')
else if role == 'controller':
  announce('{{Owner.title}} prioritizes control cards.')
else:
  announce('{{Owner.title}} uses standard card logic.')
return
```

### `scr_monster_ai_target_selection`

Attach: scene utility.

```qbscript
if !Scene:
  return
chars = Scene.characters()
if chars.count() == 0:
  return
Owner.Attribute('Monster Target Lock').set(chars.first().title)
return
```

### `scr_monster_end_turn`

Attach: monster end turn action.

```qbscript
on_activate():
  if Scene:
    Scene.advanceTurnOrder()
  return
```

### `scr_monster_reaction_reset`

Attach: round start utility.

```qbscript
Owner.Attribute('Reaction Card Used').set(false)
return
```

## Status

### `scr_status_apply`

Attach: status actions.

```qbscript
// Example: addStatus('st_expose', 1, 2)
return
```

### `scr_status_tick_start`

Attach: turn start utility.

```qbscript
// Uses getStatusStacks(statusId) from global helper.
regen = getStatusStacks('st_regen')
if regen > 0:
  hp = Owner.Attribute('Current HP')
  if hp:
    hp.set(number(hp.value) + regen)
over = getStatusStacks('st_overheat')
if over >= 4:
  apMax = Owner.Attribute('AP Max')
  if apMax:
    apMax.set(max(0, number(apMax.value) - 1))
return
```

### `scr_status_tick_end`

Attach: turn end utility.

```qbscript
// Uses getStatusStacks / setStatusStacks / getStatusDuration / setStatusDuration from global.
bleed = getStatusStacks('st_bleed')
burn = getStatusStacks('st_burn')
dot = bleed + burn
if dot > 0:
  hp = Owner.Attribute('Current HP')
  if hp:
    hp.set(max(0, number(hp.value) - dot))

// Decrement durations; remove at 0.
keys = ['st_guard','st_fortify','st_expose','st_stagger','st_bleed','st_burn','st_overheat','st_mark','st_root','st_silence','st_veil','st_taunt','st_vulnerable','st_regen','st_shielded']
for k in keys:
  d = getStatusDuration(k)
  if d > 0:
    setStatusDuration(k, d - 1)
return
```

### `scr_status_expire_cleanup`

Attach: turn end utility after tick.

```qbscript
// Uses getStatusDuration / removeStatus from global.
keys = ['st_guard','st_fortify','st_expose','st_stagger','st_bleed','st_burn','st_overheat','st_mark','st_root','st_silence','st_veil','st_taunt','st_vulnerable','st_regen','st_shielded']
for k in keys:
  if getStatusDuration(k) <= 0:
    removeStatus(k)
return
```

### `scr_status_damage_pipeline`

Attach: call before applying damage.

```qbscript
// Input contract via Owner properties:
// incoming_damage, outgoing_pierce
incoming = number(Owner.getProperty('incoming_damage'))
pierce = number(Owner.getProperty('outgoing_pierce'))
if incoming == null:
  incoming = 0
if pierce == null:
  pierce = 0

guard = number(Owner.Attribute('Guard Value').value)
exposed = number(Owner.Attribute('Exposed Value').value)
shield = number(Owner.Attribute('Shield Temp HP').value)
if guard == null:
  guard = 0
if exposed == null:
  exposed = 0
if shield == null:
  shield = 0

effectiveGuard = max(0, guard - pierce)
result = incoming - effectiveGuard + exposed
if result < 0:
  result = 0

if shield > 0:
  shieldLeft = shield - result
  if shieldLeft >= 0:
    Owner.Attribute('Shield Temp HP').set(shieldLeft)
    result = 0
  else:
    Owner.Attribute('Shield Temp HP').set(0)
    result = abs(shieldLeft)

Owner.setProperty('resolved_damage', result)
return
```

### `scr_status_card_lock_checks`

Attach: call at start of action scripts.

```qbscript
active = statusList()
if containsValue(active, 'st_stagger'):
  announce('Cannot use power cards while Staggered.')
if containsValue(active, 'st_silence'):
  announce('Cannot use utility/control cards while Silenced.')
return
```

### `scr_status_cleanse_dispel`

Attach: cleanse/dispel actions.

```qbscript
// Cleanse one debuff in priority order
priority = ['st_stagger','st_silence','st_root','st_expose','st_bleed','st_burn','st_overheat','st_mark','st_taunt','st_vulnerable']
for st in priority:
  if containsValue(statusList(), st):
    removeStatus(st)
    announce('Removed status: {{st}}')
    return
return
```

---

## Races 2-8

**See `03_race_scripts.qbs` for full implementations.**

### `scr_tethered_on_add_initialize`

Attach: `arc_race_tethered_base` → `on_add()`. Call `on_add_tethered()`.

### `scr_echoed_on_add_initialize`

Attach: `arc_race_echoed_base` → `on_add()`. Call `on_add_echoed()`.

### `scr_echoed_already_died_trigger`

Attach: HP change handler. Call `on_hp_change_echoed()`. Drops to 1 HP once per combat instead of 0.

### `scr_wireborn_on_add_initialize`

Attach: `arc_race_wireborn_base` → `on_add()`. Call `on_add_wireborn()`.

### `scr_stitched_on_add_initialize`

Attach: `arc_race_stitched_base` → `on_add()`. Call `on_add_stitched()`. Prompt player to set Component A/B after creation.

### `scr_shellbroken_on_add_initialize`

Attach: `arc_race_shellbroken_base` → `on_add()`. Call `on_add_shellbroken()`.

### `scr_shellbroken_survivor_clarity_trigger`

Attach: HP change handler. Call `on_hp_change_shellbroken()`. Applies Guard +4 free once per combat on first below-half-HP event.

### `scr_iron_blessed_on_add_initialize`

Attach: `arc_race_iron_blessed_base` → `on_add()`. Call `on_add_iron_blessed()`. Reads Subtype attribute to set hand size modifier and handler status.

### `scr_diminished_on_add_initialize`

Attach: `arc_race_diminished_base` → `on_add()`. Call `on_add_diminished()`.

---

## Classes 2-13

**See `04_class_scripts_2_to_13.qbs` for full implementations.**

### `scr_ronin_on_add_initialize`

Call `on_add_ronin()`. Sets corrupted resonance, oath status Masterless.

### `scr_ashfoot_on_add_initialize`

Call `on_add_ashfoot()`. Sets caste Low, enhancement quality salvage.

### `scr_veilblade_on_add_initialize`

Call `on_add_veilblade()`. Sets resonance signature suppressed, wire integration active.

### `scr_oni_hunter_on_add_initialize`

Call `on_add_oni_hunter()`. Clears quarry mark.

### `scr_oni_hunter_set_quarry_mark`

Attach: `card_oni_hunter_hunters_mark` → `on_activate()`. Call `on_action_oni_hunter_mark()`.

### `scr_forge_tender_on_add_initialize`

Call `on_add_forge_tender()`. Initializes heal uses.

### `scr_forge_tender_resource_reset_short_rest`

Call `on_short_rest_forge_tender()`. Restores short-rest heal uses.

### `scr_forge_tender_resource_reset_long_rest`

Call `on_long_rest_forge_tender()`. Restores all long-rest heal resources.

### `scr_wireweave_on_add_initialize`

Call `on_add_wireweave()`.

### `scr_chrome_shaper_on_add_initialize`

Call `on_add_chrome_shaper()`. Configuration tracking starts at `none`.

### `scr_chrome_shaper_config_switch`

Call `on_action_chrome_shaper_config_switch(configName, statKey, bonus)` from each configuration card.

### `scr_pulse_caller_on_add_initialize`

Call `on_add_pulse_caller()`. Enables integrated weapon.

### `scr_iron_monk_on_add_initialize`

Call `on_add_iron_monk()`. Attaches HP change tracker for below-half bonus.

### `scr_iron_monk_below_half_hp_tracker`

Attach: HP change handler. Call `on_hp_change_iron_monk()`. Sets `Below Half HP Bonus Active` true when HP ≤ 50% of max, false when above.

### `scr_iron_monk_between_state_toggle`

Attach to Between-state activation cards. Call `on_action_iron_monk_between_toggle()`.

### `scr_echo_speaker_on_add_initialize`

Call `on_add_echo_speaker()`. Grief stacks start at 0.

### `scr_echo_speaker_grief_accumulate`

Attach to ally-death scene event. Call `on_ally_death_echo_speaker()`.

### `scr_void_walker_on_add_initialize`

Call `on_add_void_walker()`.

### `scr_void_walker_phase_toggle`

Attach to phase-activation cards. Call `on_action_void_walker_phase_toggle()`.

### `scr_sutensai_on_add_initialize`

Call `on_add_sutensai()`. Reader authority enabled, HP cost cards enabled.

### `scr_sutensai_hp_cost_payment`

Call `sutensai_pay_hp_cost(hpCost)` from HP-variant card on_activate before resolving. Returns false to block if HP insufficient.

---

## Classes 14-25

**See `05_class_scripts_14_to_25.qbs` for full implementations.**

### `scr_flesh_shaper_on_add_initialize`

Call `on_add_flesh_shaper()`. HP tier starts at full.

### `scr_flesh_shaper_hp_tier_tracker`

Attach to HP change. Call `on_hp_change_flesh_shaper()`. Updates HP Tier: full / wounded / critical.

### `scr_puppet_binder_on_add_initialize`

Call `on_add_puppet_binder()`.

### `scr_puppet_binder_apply_bind`

Call `puppet_binder_apply_bind(targetId)` from bind cards.

### `scr_puppet_binder_release_bind`

Call `puppet_binder_release_bind(targetId)` from release actions.

### `scr_blood_smith_on_add_initialize`

Call `on_add_blood_smith()`.

### `scr_blood_smith_pay_hp_cost`

Call `blood_smith_pay_hp(hpCost)` at on_action_attempt for HP-cost cards. Returns false to block play if HP too low.

### `scr_blood_smith_enhancement_stress_check`

Attach to HP change. Call `on_hp_change_blood_smith()`. Updates enhancement_status: stable / stressed / failing.

### `scr_hollow_on_add_initialize`

Call `on_add_hollow()`. Prompts Empty/Shell path.

### `scr_hollow_update_hp_percent`

Attach to HP change. Call `on_hp_change_hollow()`. Keeps hp_percent current for scaling cards.

### `scr_shadow_daimyo_on_add_initialize`

Call `on_add_shadow_daimyo()`.

### `scr_shadow_daimyo_apply_intelligence`

Attach to Gather Intelligence card. Call `shadow_daimyo_apply_intelligence(targetId)`.

### `scr_shadow_daimyo_activate_contact`

Attach to Contact Activation card. Call `shadow_daimyo_activate_contact()`. Returns false if no contacts.

### `scr_voice_of_debt_on_add_initialize`

Call `on_add_voice_of_debt()`.

### `scr_voice_of_debt_apply_debt`

Call `vod_apply_debt(targetId, stacksToAdd)` from Debt-applying cards.

### `scr_voice_of_debt_detonate_debt`

Call `vod_get_debt_stacks(targetId)` to read count, compute damage, then `vod_clear_debt(targetId)` from Detonation cards.

### `scr_voice_of_debt_resource_reset_per_encounter`

Call `on_encounter_start_voice_of_debt()` at scene/encounter start.

### `scr_merchant_knife_on_add_initialize`

Call `on_add_merchant_knife()`.

### `scr_merchant_knife_apply_intelligence`

Call `mk_apply_intelligence(targetId)` from intelligence-gathering cards. Caps at 3.

### `scr_iron_herald_on_add_initialize`

Call `on_add_iron_herald()`.

### `scr_iron_herald_establish_zone`

Attach to Command Zone Establish card. Call `iron_herald_establish_zone()`.

### `scr_iron_herald_set_priority_target`

Attach to Priority Mark card. Call `iron_herald_set_priority(targetId)`.

### `scr_iron_herald_collapse_zone`

Call `iron_herald_collapse_zone()` on turn end if herald is incapacitated.

### `scr_curse_eater_on_add_initialize`

Call `on_add_curse_eater()`.

### `scr_curse_eater_absorb_debuff`

Attach to Absorb card. Call `curse_eater_absorb(statusId, allyRef)`.

### `scr_curse_eater_purge_loaded`

Attach to Purge Burst card. Call `curse_eater_purge()` to get stack count for power calc.

### `scr_curse_eater_corruption_accumulate`

Call `curse_eater_accumulate_corruption(amount)` from Consumed-path heavy cards.

### `scr_shell_dancer_on_add_initialize`

Call `on_add_shell_dancer()`.

### `scr_shell_dancer_generate_cascade`

Attach to on_damaged event. Call `shell_dancer_on_damage()`. Increments cascade up to 10.

### `scr_shell_dancer_enter_shell_step`

Attach to Enter Shell Step card. Call `shell_dancer_enter_shell_step()`.

### `scr_shell_dancer_shell_step_tick`

Attach to turn_end. Call `on_turn_end_shell_dancer()`. Decrements shell step turns.

### `scr_shell_dancer_spend_cascade`

Call `shell_dancer_spend_cascade(cost)` from cascade-spending cards. Returns false if insufficient.

### `scr_fracture_knight_on_add_initialize`

Call `on_add_fracture_knight()`. Phantom Charges start at 2.

### `scr_fracture_knight_generate_phantom`

Call `fracture_knight_generate_phantom(amount)` from charge-generating cards.

### `scr_fracture_knight_spend_phantom`

Call `fracture_knight_spend_phantom(cost)` at on_action_attempt. Returns false to block if insufficient.

### `scr_fracture_knight_apply_fracture_self`

Call `fracture_knight_apply_self_fracture(stacks)` from self-fracture cards.

### `scr_fracture_knight_apply_target_fracture`

Call `fracture_knight_apply_target_fracture(targetId, stacks)` from target-fracture cards. Tracks per-target stacks in serialized `fracture_target_map` property.

### `scr_fracture_knight_resource_reset_short_rest`

Call `on_short_rest_fracture_knight()`. Restores Phantom Charges to base (2).

### `scr_fracture_knight_resource_reset_long_rest`

Call `on_long_rest_fracture_knight()`. Restores Phantom Charges to max (6), clears fracture stacks and target map.

### `scr_unnamed_on_add_initialize`

Call `on_add_unnamed()`. Prompts Convergent/Divergent path.

### `scr_unnamed_stat_shift`

Call `unnamed_shift_stat(newStat)` from stat-shift cards. Validates against allowed stat list.

### `scr_unnamed_name_card`

Call `unnamed_name_card(cardId, cardName)` when player names a card through play.

---

## Resource Reset Scripts (Classes 2-25)

All rest handlers below are in `04_class_scripts_2_to_13.qbs` or `05_class_scripts_14_to_25.qbs`. Attach each to the corresponding rest action trigger.

### `scr_ronin_resource_reset_long_rest`

Call `on_long_rest_ronin()`. Clears contract target if type changed; restores rest-limited resources.

### `scr_ashfoot_resource_reset_short_rest`

Call `on_short_rest_ashfoot()`. Restores short-rest limited resources.

### `scr_veilblade_resource_reset_short_rest`

Call `on_short_rest_veilblade()`. Restores short-rest signal resources.

### `scr_oni_hunter_resource_reset_short_rest`

Call `on_short_rest_oni_hunter()`. Clears quarry mark; resets short-rest resources.

### `scr_wireweave_resource_reset_short_rest`

Call `on_short_rest_wireweave()`. Restores short-rest signal resources.

### `scr_chrome_shaper_resource_reset_short_rest`

Call `on_short_rest_chrome_shaper()`. Restores configuration switch resources.

### `scr_pulse_caller_resource_reset_short_rest`

Call `on_short_rest_pulse_caller()`. Restores pulse arm short-rest resources.

### `scr_iron_monk_resource_reset_long_rest`

Call `on_long_rest_iron_monk()`. Resets long-rest resources; clears between-state if active.

### `scr_echo_speaker_resource_reset_long_rest`

Call `on_long_rest_echo_speaker()`. Resets grief stacks and long-rest resources.

### `scr_void_walker_resource_reset_short_rest`

Call `on_short_rest_void_walker()`. Restores short-rest phase resources.

### `scr_sutensai_resource_reset_long_rest`

Call `on_long_rest_sutensai()`. Resets long-rest limited resources.

### `scr_flesh_shaper_resource_reset_long_rest`

Call `on_long_rest_flesh_shaper()`. Resets HP tier to full; clears crisis mend extra use flag.

### `scr_puppet_binder_resource_reset_long_rest`

Call `on_long_rest_puppet_binder()`. Releases all binds; resets binding threads to 0.

### `scr_blood_smith_resource_reset_long_rest`

Call `on_long_rest_blood_smith()`. Resets enhancement status to stable.

### `scr_hollow_resource_reset_long_rest`

Call `on_long_rest_hollow()`. Resets long-rest resources; refreshes HP percent.

### `scr_shadow_daimyo_resource_reset_long_rest`

Call `on_long_rest_shadow_daimyo()`. Restores 1 contact slot; resets intelligence if path specifies.

### `scr_merchant_knife_resource_reset_long_rest`

Call `on_long_rest_merchant_knife()`. Clears intelligence and debt maps; restores contact resources.

### `scr_iron_herald_resource_reset_short_rest`

Call `on_short_rest_iron_herald()`. Restores command resources; zone remains active if not disrupted.

### `scr_curse_eater_resource_reset_long_rest`

Call `on_long_rest_curse_eater()`. Halves loaded count; resets corruption thresholds.

### `scr_shell_dancer_resource_reset_long_rest`

Call `on_long_rest_shell_dancer()`. Resets cascade count to 0; clears shell step state.

### `scr_unnamed_resource_reset_long_rest`

Call `on_long_rest_unnamed()`. Resets any unnamed-specific rest resources.
