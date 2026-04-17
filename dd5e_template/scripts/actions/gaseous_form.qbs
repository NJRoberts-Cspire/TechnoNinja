/*
### Gaseous Form

_3rd-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a bit of gauze and a wisp of smoke)

**Duration**: Concentration, up to 1 hour

You transform a willing creature you touch, along with everything it’s wearing and carrying, into a misty cloud for the duration. The spell ends if the creature drops to 0 hit points. An incorporeal creature isn’t affected. While in this form, the target’s only method of movement is a flying speed of 10 feet. The target can enter and occupy the space of another creature. The target has resistance to nonmagical damage, and it has advantage on Strength, Dexterity, and Constitution saving throws. The target can pass through small holes, narrow openings, and even mere cracks, though it treats liquids as though they were solid surfaces. The target can’t fall and remains hovering in the air even when stunned or otherwise incapacitated. While in the form of a misty cloud, the target can’t talk or manipulate objects, and any objects it was carrying or holding can’t be dropped, used, or otherwise interacted with. The target can’t attack or cast spells.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Gaseous Form')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Gaseous Form')
    if !Scene:
        prompt('Gaseous Form: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} transforms into a misty cloud, gaining resistance to nonmagical damage and the ability to pass through small openings')

    
