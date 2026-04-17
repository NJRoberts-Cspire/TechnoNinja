/*
### Black Tentacles

_4th-level conjuration_

**Casting Time**: 1 action

**Range**: 90 feet

**Components**: V, S, M (a piece of tentacle from a giant octopus or a giant squid)

**Duration**: Concentration, up to 1 minute

Squirming, ebony tentacles fill a 20-foot square on ground that you can see within range. For the duration, these tentacles turn the ground in the area into difficult terrain. When a creature enters the affected area for the first time on a turn or starts its turn there, the creature must succeed on a Dexterity saving throw or take 3d6 bludgeoning damage and be restrained by the tentacles until the spell ends. A creature that starts its turn in the area and is already restrained by the tentacles takes 3d6 bludgeoning damage. A creature restrained by the tentacles can use its action to make a Strength or Dexterity check (its choice) against your spell save DC. On a success, it frees itself. 6th-level evocation Casting Time: 1 action Range: 90 feet Components: V, S Duration: Concentration, up to 10 minutes You create a vertical wall of whirling, razor-sharp blades made of magical energy. The wall appears within range and lasts for the duration. You can make a straight wall up to 100 feet long, 20 feet high, and 5 feet thick, or a ringed wall up to 60 feet in diameter, 20 feet high, and 5 feet thick. The wall provides three-quarters cover to creatures behind it, and its space is difficult terrain. When a creature enters the wall’s area for the first time on a turn or starts its turn there, the creature must make a Dexterity saving throw. On a failed save, the creature takes 6d10 slashing damage. On a successful save, the creature takes half as much damage.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Black Tentacles')
    if slot_level == -1:
        return

    set_concentration(Owner, 'Black Tentacles')

    if Scene:
        save_fails = resolve_spell_save_manually(Owner, 'Dexterity')
        if !save_fails:
            log('Black Tentacles misses')
            return
        damage = roll_damage(Owner, '3d6')
        prompt('Black Tentacles hits for {{damage}} bludgeoning damage and restrains the target', ['Ok'])
        log('Black Tentacles hits for {{damage}} bludgeoning damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '3d6', targ, 'Bludgeoning')
        name = targ.name
        set_condition(targ, 'Restrained', true)
        log('Black Tentacles restrains {{name}} and deals {{damage}} bludgeoning damage')
        apply_damage(targ, damage)

    for targ in successes:
        name = targ.name
        log('{{name}} avoids being restrained by Black Tentacles')
