/*
### Remove Curse

_3rd-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Instantaneous

At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner’s 174 attunement to the object so it can be removed or discarded.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Remove Curse')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Remove Curse: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('All curses affecting {{name}} have been removed')

