/*
### True Seeing

_6th-level divination_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (an ointment for the eyes that costs 25 gp; is made from mushroom powder, saffron, and fat; and is consumed by the spell)

**Duration**: 1 hour

This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'True Seeing')
    if slot_level == -1:
        return
    if !Scene:
        prompt('True Seeing: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} gains truesight 120 ft for 1 hour')

