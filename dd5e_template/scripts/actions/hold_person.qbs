/*
### Hold Person

_2nd-level enchantment_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (a small, straight piece of iron)

**Duration**: Concentration, up to 1 minute

Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd. The humanoids must be within 30 feet of each other when you target them.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Hold Person')
    if slot_level == -1:
        return
    max_targets = slot_level - 1
    announce('Hold Person: select up to {{max_targets}} targets')
    set_concentration(Owner, 'Hold Person')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Hold Person Wisdom save')
        else:
            log('Target succeeds Hold Person Wisdom save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Paralyzed', true)
        log('{{name}} is paralyzed by Hold Person')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Hold Person')

