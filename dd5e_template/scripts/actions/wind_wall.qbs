/*
### Wind Wall

_3rd-level evocation_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S, M (a tiny fan and a feather of exotic origin)

**Duration**: Concentration, up to 1 minute

A wall of strong wind rises from the ground at a point you choose within range. You can make the wall up to 50 feet long, 15 feet high, and 1 foot thick. You can shape the wall in any way you choose so long as it makes one continuous path along the ground. The wall lasts for the duration. When the wall appears, each creature within its area must make a Strength saving throw. A creature takes 3d8 bludgeoning damage on a failed save, or half as much damage on a successful one. 192 The strong wind keeps fog, smoke, and other gases at bay. Small or smaller flying creatures or objects can’t pass through the wall. Loose, lightweight materials brought into the wall fly upward. Arrows, bolts, and other ordinary projectiles launched at targets behind the wall are deflected upward and automatically miss. (Boulders hurled by giants or siege engines, and similar projectiles, are unaffected.) Creatures in gaseous form can’t pass through it.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Wind Wall')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Wind Wall')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Strength')
        if !failed:
            log('Target fails Wind Wall Strength save')
        else:
            log('Target succeeds Wind Wall Strength save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Strength')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '3d8', targ, 'Bludgeoning')
        name = targ.name
        log('Wind Wall batters {{name}} for {{damage}} bludgeoning damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '3d8', targ, 'Bludgeoning')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Wind Wall buffets {{name}} for {{half_damage}} bludgeoning damage')
        apply_damage(targ, half_damage)
    log('Wall of strong wind is active; it blocks projectiles and gaseous creatures automatically')

