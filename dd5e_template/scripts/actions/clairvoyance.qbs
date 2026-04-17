/*
### Clairvoyance

_3rd-level divination_

**Casting Time**: 10 minutes

**Range**: 1 mile

**Components**: V, S, M (a focus worth at least 100 gp, either a jeweled horn for hearing or a glass eye for seeing)

**Duration**: Concentration, up to 10 minutes

You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and it can’t be attacked or otherwise interacted with. When you cast the spell, you choose seeing or hearing. You can use the chosen sense through the sensor as if you were in its space. As your action, you can switch between seeing and hearing. creature that can see the sensor (such as a creature benefiting from see invisibility or truesight) sees a luminous, intangible orb about the size of your fist.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Clairvoyance')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Clairvoyance')
    name = Owner.name
    log('{{name}} creates an invisible sensor at a familiar location or in a general direction, gaining sight or hearing through it for the duration')

    
