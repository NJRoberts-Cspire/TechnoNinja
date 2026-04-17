/*
### Thunderwave

_1st-level evocation_

**Casting Time**: 1 action

**Range**: Self (15-foot cube)

**Components**: V, S

**Duration**: Instantaneous

A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn’t pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell’s effect, and the spell emits a thunderous boom audible out to 300 feet. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Thunderwave')
    if slot_level == -1:
        return
    total_dice = 2 + (slot_level - 1)
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Thunderwave Constitution save')
        else:
            log('Target succeeds Thunderwave Constitution save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Thunder')
        name = targ.name
        log('Thunderwave hits {{name}} for {{damage}} thunder damage and pushes them 10 feet')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Thunder')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Thunderwave grazes {{name}} for {{half_damage}} thunder damage')
        apply_damage(targ, half_damage)

    
