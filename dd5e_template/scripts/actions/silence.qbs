/*
### Silence

_2nd-level illusion (ritual)_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Concentration, up to 10 minutes

For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Silence')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Silence')
    name = Owner.name
    log('{{name}} casts Silence: no sound can be created in the area')

