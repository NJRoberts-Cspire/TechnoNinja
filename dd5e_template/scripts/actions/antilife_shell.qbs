/*
### Antilife Shell

_5th-level abjuration_

**Casting Time**: 1 action

**Range**: Self (10-foot radius)

**Components**: V, S

**Duration**: Concentration, up to 1 hour

A shimmering barrier extends out from you in a 10- foot radius and moves with you, remaining centered on you and hedging out creatures other than undead and constructs. The barrier lasts for the duration. The barrier prevents an affected creature from passing or reaching through. An affected creature can cast spells or make attacks with ranged or reach weapons through the barrier. 116 If you move so that an affected creature is forced to pass through the barrier, the spell ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Antilife Shell')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Antilife Shell')
    name = Owner.name
    log('{{name}} creates a 10-ft barrier that prevents living creatures from entering')

