/*
### Shatter

_2nd-level evocation_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (a chip of mica)

**Duration**: Instantaneous

A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much damage on a successful one. A creature made of inorganic material such as stone, 178 crystal, or metal has disadvantage on this saving throw. A nonmagical object that isn’t being worn or carried also takes the damage if it’s in the spell’s area. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Shatter')
    if slot_level == -1:
        return
    total_dice = 3 + (slot_level - 2)
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Shatter Constitution save')
        else:
            log('Target succeeds Shatter Constitution save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Thunder')
        name = targ.name
        log('Shatter hits {{name}} for {{damage}} thunder damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Thunder')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Shatter grazes {{name}} for {{half_damage}} thunder damage')
        apply_damage(targ, half_damage)

    
