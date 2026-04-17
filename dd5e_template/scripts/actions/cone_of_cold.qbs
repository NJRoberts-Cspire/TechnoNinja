/*
### Cone of Cold

_5th-level evocation_

**Casting Time**: 1 action

**Range**: Self (60-foot cone)

**Components**: V, S, M (a small crystal or glass cone)

**Duration**: Instantaneous

A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one. A creature killed by this spell becomes a frozen statue until it thaws. 

At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Cone of Cold')
    if slot_level == -1:
        return

    extra_dice = slot_level - 5
    total_dice = 8 + extra_dice

    if !Scene:
        save_fails = resolve_spell_save_manually(Owner, 'Constitution')
        if !save_fails:
            log('Cone of Cold misses')
            return
        damage = roll_damage(Owner, '{{total_dice}}d8')
        prompt('Cone of Cold hits for {{damage}} cold damage', ['Ok'])
        log('Cone of Cold hits for {{damage}} cold damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Cold')
        name = targ.name
        log('Cone of Cold hits {{name}} for {{damage}} cold damage')
        apply_damage(targ, damage)

    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Cold')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Cone of Cold grazes {{name}} for {{half_damage}} cold damage')
        apply_damage(targ, half_damage)

