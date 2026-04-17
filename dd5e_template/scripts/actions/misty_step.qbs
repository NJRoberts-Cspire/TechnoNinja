/*
### Misty Step

_2nd-level conjuration_

**Casting Time**: 1 bonus action

**Range**: Self

**Components**: V

**Duration**: Instantaneous

Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Misty Step')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Misty Step')

