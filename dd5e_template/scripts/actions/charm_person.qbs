/*
### Charm Person

_1st-level enchantment_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S

**Duration**: 1 hour

You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Charm Person')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Charm Person')
    
    max_targets = slot_level

    if Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target is charmed')
        else:
            log('Target resists Charm')
        return
    
    announce('Charm Person: select up to {{max_targets}} targets')
    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Charmed', true)
        log('{{name}} is charmed by Charm Person')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Charm Person')

