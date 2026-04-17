/*
### Warding Bond

_2nd-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a pair of platinum rings worth at least 50 gp each, which you and the target must wear for the duration)

**Duration**: 1 hour

This spell wards a willing creature you touch and creates a mystic connection between you and the target until the spell ends. While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has resistance to all damage. Also, each time it takes damage, you take the same amount of damage. The spell ends if you drop to 0 hit points or if you and the target become separated by more than 60 feet. It also ends if the spell is cast again on either of the connected creatures. You can also dismiss the spell as an action.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Warding Bond')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Warding Bond: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    caster_name = Owner.name
    log('{{name}} is bonded to {{caster_name}}: +1 AC, +1 to saving throws, resistance to all damage. {{caster_name}} takes the same damage {{name}} receives.')

