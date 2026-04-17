/*
### See Invisibility

_2nd-level divination_

**Casting Time**: 1 action

**Range**: Self

**Components**: V, S, M (a pinch of talc and a small sprinkling of powdered silver)

**Duration**: 1 hour

For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane. Ethereal creatures and objects appear ghostly and translucent.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'See Invisibility')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts See Invisibility')

