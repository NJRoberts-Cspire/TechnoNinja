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
stacks = getStatusStacksMap()
// Regen
regen = number(stacks['st_regen'])
if regen > 0:
  hp = Owner.Attribute('Current HP')
  if hp:
    hp.add(regen)
// Overheat AP pressure
over = number(stacks['st_overheat'])
if over >= 4:
  apMax = Owner.Attribute('AP Max')
  if apMax:
    apMax.set(max(0, number(apMax.value) - 1))
return
```

### `scr_status_tick_end`
Attach: turn end utility.
```qbscript
stacks = getStatusStacksMap()
bleed = number(stacks['st_bleed'])
burn = number(stacks['st_burn'])
dot = max(0, bleed) + max(0, burn)
if dot > 0:
  hp = Owner.Attribute('Current HP')
  if hp:
    hp.subtract(dot)

// decrement durations
dur = getStatusDurationMap()
keys = ['st_guard','st_fortify','st_expose','st_stagger','st_bleed','st_burn','st_overheat','st_mark','st_root','st_silence','st_veil','st_taunt','st_vulnerable','st_regen','st_shielded']
for k in keys:
  d = number(dur[k])
  if d > 0:
    dur[k] = d - 1
saveStatusDurationMap(dur)
return
```

### `scr_status_expire_cleanup`
Attach: turn end utility after tick.
```qbscript
dur = getStatusDurationMap()
stacks = getStatusStacksMap()
keys = ['st_guard','st_fortify','st_expose','st_stagger','st_bleed','st_burn','st_overheat','st_mark','st_root','st_silence','st_veil','st_taunt','st_vulnerable','st_regen','st_shielded']
for k in keys:
  d = number(dur[k])
  if d <= 0:
    stacks[k] = 0
    removeStatus(k)
saveStatusStacksMap(stacks)
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
