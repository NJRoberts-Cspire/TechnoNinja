/*
### Fire Bolt

_Evocation cantrip_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Instantaneous

You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried. This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).
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
        resolve_spell_attack_manually(Owner, '{{dice}}d10')
        return

    results = spell_attack(Owner, false)
    hits = results[0]

    for targ in hits:
        damage = roll_damage(Owner, '{{dice}}d10', targ, 'Fire')
        name = targ.name
        log('Fire Bolt hits {{name}} for {{damage}} fire damage.')
        apply_damage(targ, damage)

