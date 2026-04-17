/*
### Protection from Poison

_2nd-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: 1 hour

You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random. For the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Protection from Poison')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Protection from Poison: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    set_condition(targ, 'Poisoned', false)
    name = targ.name
    log('{{name}} is cured of poison and has advantage on saving throws against poison for 1 hour')

