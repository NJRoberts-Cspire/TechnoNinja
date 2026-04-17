/*
### Sacred Flame

_Evocation cantrip_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Instantaneous

Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw. The spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
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
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Sacred Flame Dexterity save')
        else:
            log('Target succeeds Sacred Flame Dexterity save')
        return

    target = selectCharacter()
    targets = [target]
    results = saving_throw(Owner, targets, 'Dexterity')
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{dice}}d8', targ, 'Radiant')
        name = targ.name
        log('Sacred Flame engulfs {{name}} for {{damage}} radiant damage.')
        apply_damage(targ, damage)

