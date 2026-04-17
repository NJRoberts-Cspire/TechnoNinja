/*
### Aid

_2nd-level abjuration_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (a tiny strip of white cloth)

**Duration**: 8 hours

Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target’s hit point maximum and current hit points increase by 5 for the duration. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, a target’s hit points increase by an additional 5 for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Aid')
    if slot_level == -1:
        return
        
    hp_bonus = 5 + (slot_level - 2) * 5

    if !Scene:
        prompt('Heal up to three creatures within range {{hp_bonus}} hit points.', ['Ok'])
        return

    targets = selectCharacters()
    for targ in targets:
        name = targ.name
        heal_hp(targ, hp_bonus)
        targ.Attribute('Hit Point Maximum').add(hp_bonus)
        log('Aid grants {{name}} {{hp_bonus}} additional hit points (max HP also increases by {{hp_bonus}})')

