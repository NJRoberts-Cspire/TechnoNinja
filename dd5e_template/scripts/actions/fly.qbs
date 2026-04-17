/*
### Fly

_3rd-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a wing feather from any bird)

**Duration**: Concentration, up to 10 minutes

You touch a willing creature. The target gains a flying speed of 60 feet for the duration. When the spell ends, the target falls if it is still aloft, unless it can stop the fall. 

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Fly')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Fly')
    if !Scene:
        prompt('Fly: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targets = selectCharacters()
    for targ in targets:
        name = targ.name
        log('{{name}} gains a flying speed of 60 feet until the spell ends')
