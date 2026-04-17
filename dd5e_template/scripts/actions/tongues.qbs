/*
### Tongues

_3rd-level divination_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, M (a small clay model of a ziggurat)

**Duration**: 1 hour

This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, 187 when the target speaks, any creature that knows at least one language and can hear the target understands what it says.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Tongues')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Tongues: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} can understand and be understood in any spoken language for 1 hour')
