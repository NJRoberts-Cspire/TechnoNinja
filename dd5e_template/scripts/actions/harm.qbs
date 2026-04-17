/*
### Harm

_6th-level necromancy_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Instantaneous

You unleash a virulent disease on a creature that you can see within range. The target must make a Constitution saving throw. On a failed save, it takes 14d6 necrotic damage, or half as much damage on a successful save. The damage can’t reduce the target’s hit points below 1. If the target fails the saving throw, its hit point maximum is reduced for 1 hour by an amount equal to the necrotic damage it took. Any effect that removes a disease allows a creature’s hit point maximum to return to normal before that time passes.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Harm')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Harm Constitution save')
        else:
            log('Target succeeds Harm Constitution save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '14d6', targ, 'Necrotic')
        hp = targ.Attribute('Hit Points').value
        final_dam = min(damage, hp - 1)
        name = targ.name
        log('Harm hits {{name}} for {{final_dam}} necrotic damage')
        apply_damage(targ, final_dam)
    for targ in successes:
        damage = roll_damage(Owner, '14d6', targ, 'Necrotic')
        half_damage = floor(damage / 2)
        hp = targ.Attribute('Hit Points').value
        final_dam = min(half_damage, hp - 1)
        name = targ.name
        log('Harm grazes {{name}} for {{final_dam}} necrotic damage')
        apply_damage(targ, final_dam)

    
