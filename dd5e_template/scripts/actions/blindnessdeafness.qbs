/*
### Blindness/Deafness

_2nd-level necromancy_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V

**Duration**: 1 minute

You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Blindness/Deafness')
    if slot_level == -1:
        return
    max_targets = slot_level - 1

    if !Scene:
        prompt('Choose up to {{max_targets}} to blind or deafen.', ['Ok'])
        return
    
    announce('Blindness/Deafness: select up to {{max_targets}} targets')
    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    failures = results[1]
    for targ in failures:
        choice = prompt(Owner, 'Blind or Deafen this target?', ['Blinded', 'Deafened'])
        name = targ.name
        set_condition(targ, choice, true)
        log('{{name}} is afflicted with {{choice}} from Blindness/Deafness')

    
