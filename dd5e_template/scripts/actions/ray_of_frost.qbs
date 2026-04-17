/*
### Ray of Frost

_Evocation cantrip_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Instantaneous

A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn. The spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
*/

on_activate():
    level = get_level(Owner)
    dice = 1
    if level >= 17:
        dice = 4
    else if level >= 11:
        dice = 3
    else if level >= 5:
        dice = 2

    if !Scene:
        resolve_spell_attack_manually(Owner, '{{dice}}d8')
        return

    results = spell_attack(Owner, false)
    hits = results[0]

    for targ in hits:
        damage = roll_damage(Owner, '{{dice}}d8', targ, 'Cold')
        name = targ.name
        log('Ray of Frost hits {{name}} for {{damage}} cold damage. {{name}}\'s speed is reduced by 10 feet until the start of your next turn.')
        speed = targ.Attribute('Speed').value
        targ.Attribute('Speed').subtract(10)
        Owner.atStartOfNextTurn():
            targ.Attribute('Speed').set(speed)
        apply_damage(targ, damage)

