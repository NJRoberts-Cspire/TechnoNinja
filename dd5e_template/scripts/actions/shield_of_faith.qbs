/*
### Shield of Faith

_1st-level abjuration_

**Casting Time**: 1 bonus action

**Range**: 60 feet

**Components**: V, S, M (a small parchment with a bit of holy text written on it)

**Duration**: Concentration, up to 10 minutes

A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Shield of Faith')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Shield of Faith')
    if !Scene:
        prompt('Shield of Faith: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} gains +2 AC from Shield of Faith')


