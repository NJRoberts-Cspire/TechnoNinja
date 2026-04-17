/*
### Protection from Energy

_3rd-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Concentration, up to 1 hour

For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Protection from Energy')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Protection from Energy')
    if !Scene:
        prompt('Protection from Energy: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    energy_type = prompt(Owner, 'Choose energy type:', ['acid', 'cold', 'fire', 'lightning', 'thunder'])
    name = targ.name
    log('{{name}} has resistance to {{energy_type}} damage')

