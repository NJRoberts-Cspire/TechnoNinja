/*
### Purify Food and Drink

_1st-level transmutation (ritual)_

**Casting Time**: 1 action

**Range**: 10 feet

**Components**: V, S

**Duration**: Instantaneous

All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Purify Food and Drink')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Purify Food and Drink')

    
