/*
### Divine Favor

_1st-level evocation_

**Casting Time**: 1 bonus action

**Range**: Self

**Components**: V, S 136

**Duration**: Concentration, up to 1 minute

Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Divine Favor')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Divine Favor')
    name = Owner.name
    log('{{name}} casts Divine Favor: weapon attacks deal extra 1d4 radiant damage')

