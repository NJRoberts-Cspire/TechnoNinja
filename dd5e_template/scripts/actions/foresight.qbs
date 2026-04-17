/*
### Foresight

_9th-level divination_

**Casting Time**: 1 minute

**Range**: Touch

**Components**: V, S, M (a hummingbird feather)

**Duration**: 8 hours

You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration, the target can’t be surprised and has advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration. This spell immediately ends if you cast it again before its duration ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 9, 'Foresight')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Foresight: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} cannot be surprised, has advantage on attack rolls, ability checks, and saving throws; attackers have disadvantage for 8 hours')

