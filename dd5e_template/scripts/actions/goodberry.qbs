/*
### Goodberry

_1st-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a sprig of mistletoe)

**Duration**: Instantaneous

Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day. The berries lose their potency if they have not been consumed within 24 hours of the casting of this spell.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Goodberry')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Goodberry: 10 berries created, each restores 1 HP when eaten')

