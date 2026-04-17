/*
### Water Breathing

_3rd-level transmutation (ritual)_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (a short reed or piece of straw)

**Duration**: 24 hours

This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Water Breathing')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} grants up to 10 willing creatures the ability to breathe underwater for 24 hours')

    
