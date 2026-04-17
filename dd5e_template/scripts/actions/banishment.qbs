/*
### Banishment

_4th-level abjuration_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (an item distasteful to the target)

**Duration**: Concentration, up to 1 minute

You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished. 120 If the target is native to the plane of existence you’re on, you banish the target to a harmless demiplane. While there, the target is incapacitated. The target remains there until the spell ends, at which point the target reappears in the space it left or in the nearest unoccupied space if that space is occupied. If the target is native to a different plane of existence than the one you’re on, the target is banished with a faint popping noise, returning to its home plane. If the spell ends before 1 minute has passed, the target reappears in the space it left or in the nearest unoccupied space if that space is occupied. Otherwise, the target doesn’t return. 

At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Banishment')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Banishment')

    if !Scene:
        fails = resolve_spell_save_manually(Owner, 'Charisma')
        if fails:
            log('Target is banished')
        else:
            log('Target successfully saves from banishment')
        return
        
    
    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Charisma')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Incapacitated', true)
        log('{{name}} is banished to a harmless demiplane')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Banishment')


