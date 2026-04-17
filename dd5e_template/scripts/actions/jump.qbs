/*
### Jump

_1st-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a grasshopper’s hind leg)

**Duration**: 1 minute

You touch a creature. The creature’s jump distance is tripled until the spell ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Jump')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Jump: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log("{{name}}'s jump distance is tripled for 1 minute")

