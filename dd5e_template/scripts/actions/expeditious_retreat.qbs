/*
### Expeditious Retreat

_1st-level transmutation_

**Casting Time**: 1 bonus action

**Range**: Self

**Components**: V, S

**Duration**: Concentration, up to 10 minutes

This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Expeditious Retreat')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Expeditious Retreat')
    name = Owner.name
    log('{{name}} casts Expeditious Retreat: Dash as a bonus action each turn')

