/*
### Locate Animals or Plants

_2nd-level divination (ritual)_

**Casting Time**: 1 action

**Range**: Self

**Components**: V, S, M (a bit of fur from a bloodhound)

**Duration**: Instantaneous

Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Locate Animals or Plants')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Locate Animals or Plants')

