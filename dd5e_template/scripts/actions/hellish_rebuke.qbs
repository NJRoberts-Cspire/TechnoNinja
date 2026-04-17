/*
### Hellish Rebuke

_1st-level evocation_

**Casting Time**: 1 reaction, which you take in response to being damaged by a creature within 60 feet of you that you can see

**Range**: 60 feet

**Components**: V, S

**Duration**: Instantaneous

You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Hellish Rebuke')
    if slot_level == -1:
        return
    total_dice = 2 + (slot_level - 1)
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Hellish Rebuke Dexterity save')
        else:
            log('Target succeeds Hellish Rebuke Dexterity save')
        return

    targ = selectCharacter()
    results = saving_throw(Owner, [targ], 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Fire')
        name = targ.name
        log('Hellish Rebuke hits {{name}} for {{damage}} fire damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Fire')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Hellish Rebuke grazes {{name}} for {{half_damage}} fire damage')
        apply_damage(targ, half_damage)

