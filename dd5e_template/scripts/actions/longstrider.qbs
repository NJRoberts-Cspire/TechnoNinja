/*
### Longstrider

_1st-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a pinch of dirt)

**Duration**: 1 hour

You touch a creature. The target’s speed increases by 10 feet until the spell ends. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Longstrider')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Longstrider: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log("{{name}}'s speed increases by 10 feet for 1 hour")

