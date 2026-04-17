/*
### Flame Strike

_5th-level evocation_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (pinch of sulfur)

**Duration**: Instantaneous

A vertical column of divine fire roars down from the heavens in a location you specify. Each creature in a 10-foot-radius, 40-foot-high cylinder centered on a point within range must make a Dexterity saving throw. A creature takes 4d6 fire damage and 4d6 radiant damage on a failed save, or half as much damage on a successful one. 

At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the fire damage or the radiant damage (your choice) increases by 1d6 for each slot level above 5th.
*/

on_activate():
    // Get spell slot level
    slot_level = use_spell_slot(Owner, 5, 'Flame Strike')
    if slot_level == -1:
        return

    // Collect extra damage dice from upcasting
    extra_dice = slot_level - 5
    fire_dice = 4 + extra_dice

    // If not in a scene, resolve manually
    if !Scene:
        hit = resolve_spell_save_manually(Owner, 'Dexterity')
        if !hit:
            log('Flame Strike misses')
            return
        fire_damage = roll_damage('{{fire_dice}}d6')
        radiant_damage = roll_damage('4d6')
        total_damage = fire_damage + radiant_damage
        log('Flame Strike hits for {{fire_damage}} fire + {{radiant_damage}} radiant ({{total_damage}} total) damage')
        return
    
    // If in a scene, select targets, calculate saves and apply damage
    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        fire_damage = roll_damage('{{fire_dice}}d6')
        radiant_damage = roll_damage('4d6')
        total_damage = fire_damage + radiant_damage
        name = targ.name
        log('Flame Strike hits {{name}} for {{fire_damage}} fire + {{radiant_damage}} radiant ({{total_damage}} total) damage')
        apply_damage(targ, total_damage)
    for targ in successes:
        fire_damage = roll_damage(Owner, '{{fire_dice}}d6', targ, 'Fire')
        radiant_damage = roll_damage(Owner, '4d6', targ, 'Fire')
        total_damage = fire_damage + radiant_damage
        half_damage = floor(total_damage / 2)
        name = targ.name
        log('Flame Strike grazes {{name}} for {{half_damage}} damage')
        apply_damage(targ, half_damage)

    
