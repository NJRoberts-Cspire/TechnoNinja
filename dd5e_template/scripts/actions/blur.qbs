/*
### Blur

_2nd-level illusion_

**Casting Time**: 1 action

**Range**: Self

**Components**: V

**Duration**: Concentration, up to 1 minute

Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn’t rely on sight, as with blindsight, or can see through illusions, as with truesight.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Blur')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Blur')
    name = Owner.name
    log('{{name}} casts Blur: attacks against them have disadvantage')

