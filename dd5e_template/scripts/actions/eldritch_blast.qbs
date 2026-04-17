/*
### Eldritch Blast

_Evocation cantrip_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Instantaneous

A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage. The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.
*/

on_activate():
    level = get_level(Owner)

    beams = 1
    if level >= 17:
        beams = 4
    else if level >= 11:
        beams = 3
    else if level >= 5:
        beams = 2

    for i in beams:
        if !Scene:
            resolve_spell_attack_manually(Owner, '1d10')
            return

        results = spell_attack(Owner, false)
        hits = results[0]
        for targ in hits:
            damage = roll_damage(Owner, '1d10', targ, 'Force')
            name = targ.name
            log('Eldritch Blast hits {{name}} for {{damage}} force damage')
            apply_damage(targ, damage)

