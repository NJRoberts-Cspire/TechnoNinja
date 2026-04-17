/*
### Glibness

_8th-level transmutation_

**Casting Time**: 1 action

**Range**: Self

**Components**: V

**Duration**: 1 hour

Until the spell ends, when you make a Charisma check, you can replace the number you roll with a 15. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates that you are being truthful.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Glibness')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Glibness; treat any Charisma check as 15 for 1 hour')

    
