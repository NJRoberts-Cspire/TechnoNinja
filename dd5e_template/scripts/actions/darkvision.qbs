/*
### Darkvision

_2nd-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (either a pinch of dried carrot or an agate)

**Duration**: 8 hours

You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Darkvision')
    if slot_level == -1:
        return

    if !Scene:
        prompt('A creature you touch willingly receives Darkvision out to 60 feet for 8 hours.')
        return
        
    targ = selectCharacter()
    name = targ.name
    log('{{name}} gains darkvision out to 60 feet for 8 hours')

