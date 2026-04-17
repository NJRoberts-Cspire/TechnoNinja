/*
### Poison Spray

_Conjuration cantrip_

**Casting Time**: 1 action

**Range**: 10 feet

**Components**: V, S

**Duration**: Instantaneous

You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage. This spell's damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).
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
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Poison Spray Constitution save')
        else:
            log('Target succeeds Poison Spray Constitution save')
        return

    target = selectCharacter()
    targets = [target]
    results = saving_throw(Owner, targets, 'Constitution')
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{dice}}d12', targ, 'Poison')
        name = targ.name
        log('Poison Spray hits {{name}} for {{damage}} poison damage.')
        apply_damage(targ, damage)
