/*
### Hunter’s Mark

_1st-level divination_

**Casting Time**: 1 bonus action

**Range**: 90 feet

**Components**: V

**Duration**: Concentration, up to 1 hour

You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it. If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to mark a new creature. 

At Higher Levels. When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, "Hunter's Mark")
    if slot_level == -1:
        return
    set_concentration(Owner, "Hunter's Mark")
    if !Scene:
        prompt('Hunter’s Mark: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    
    extra_dice = Owner.getProperty('extra_dice')
    if !extra_dice:
        extra_dice = []

    extra_dice.push({dice: '1d6', source: "Hunter's Mark on {{name}}"})
    Owner.setProperty('extra_dice', extra_dice)
    
    log("{{name}} is marked by Hunter's Mark: +1d6 damage when hit and advantage on Perception/Survival checks to find them")

    
