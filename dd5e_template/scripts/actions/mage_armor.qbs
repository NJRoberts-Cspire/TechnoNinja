/*
### Mage Armor

_1st-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a piece of cured leather)

**Duration**: 8 hours

You touch a willing creature who isn’t wearing armor, and a protective magical force surrounds it until the spell ends. The target’s base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Mage Armor')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Mage Armor: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log("{{name}}'s AC becomes 13 + Dexterity modifier from Mage Armor")
