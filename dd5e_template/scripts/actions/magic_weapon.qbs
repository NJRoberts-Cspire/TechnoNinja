/*
### Magic Weapon

_2nd-level transmutation_

**Casting Time**: 1 bonus action

**Range**: Touch

**Components**: V, S

**Duration**: Concentration, up to 1 hour

You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls. 

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Magic Weapon')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Magic Weapon')
    if !Scene:
        prompt('Magic Weapon: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    bonus = 1
    if slot_level >= 6:
        bonus = 3
    if slot_level >= 4:
        bonus = 2
    name = targ.name
    log("{{name}}'s weapon gains +{{bonus}} to attack and damage rolls from Magic Weapon")

