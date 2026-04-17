/*
### Telepathic Bond

_5th-level divination (ritual)_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (pieces of eggshell from two different kinds of creatures)

**Duration**: 1 hour

You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures with Intelligence scores of 2 or less aren’t affected by this spell. Until the spell ends, the targets can communicate telepathically through the bond whether or not they have a common language. The communication is possible over any distance, though it can’t extend to other planes of existence.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Telepathic Bond')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Telepathic Bond')

