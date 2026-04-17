/*
### Confusion

_4th-level enchantment_

**Casting Time**: 1 action

**Range**: 90 feet

**Components**: V, S, M (three nut shells)

**Duration**: Concentration, up to 1 minute

This spell assaults and twists creatures’ minds, spawning delusions and provoking uncontrolled action. Each creature in a 10-foot-radius sphere centered on a point you choose within range must succeed on a Wisdom saving throw when you cast this spell or be affected by it. An affected target can’t take reactions and must roll a d10 at the start of each of its turns to determine its behavior for that turn. At the end of each of its turns, an affected target can make a Wisdom saving throw. If it succeeds, this effect ends for that target. 

At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the radius of the sphere increases by 5 feet for each slot level above 4th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Confusion')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Confusion')

    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target resists Confusion')
            return
        log('Target is confused and acts randomly; roll on the Confusion table at the start of each of their turns')
        return
    
    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Incapacitated', true)
        log('{{name}} is confused and acts randomly; roll on the Confusion table at the start of each of their turns')
    for targ in successes:
        name = targ.name
        log('{{name}} is not affected by Confusion')

