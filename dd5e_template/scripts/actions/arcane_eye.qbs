/*
### Arcane Eye

_4th-level divination_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (a bit of bat fur)

**Duration**: Concentration, up to 1 hour

You create an invisible, magical eye within range that hovers in the air for the duration. You mentally receive visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction. As an action, you can move the eye up to 30 feet in any direction. There is no limit to how far away from you the eye can move, but it can’t enter another plane of existence. A solid barrier blocks the eye’s movement, but the eye can pass through an opening as small as 1 inch in diameter.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Arcane Eye')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Arcane Eye')
    name = Owner.name
    log('{{name}} creates an invisible magical eye that can move up to 30 feet per round and see in normal and magical darkness up to 30 feet')

