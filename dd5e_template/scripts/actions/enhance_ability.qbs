/*
### Enhance Ability

_2nd-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (fur or a feather from a beast)

**Duration**: Concentration, up to 1 hour

. You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends. Bear’s Endurance. The target has advantage on Constitution checks. It also gains 2d6 temporary hit points, which are lost when the spell ends. Bull’s Strength. The target has advantage on Strength checks, and his or her carrying capacity doubles. Cat’s Grace. The target has advantage on Dexterity checks. It also doesn’t take damage from falling 20 feet or less if it isn’t incapacitated. Eagle’s Splendor. The target has advantage on Charisma checks. Fox’s Cunning. The target has advantage on Intelligence checks. Owl’s Wisdom. The target has advantage on Wisdom checks. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd. 2nd-level transmutation Casting Time: 1 action Range: 30 feet Components: V, S, M (a pinch of powdered iron) Duration: Concentration, up to 1 minute You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect. If the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once. Enlarge. The target’s size doubles in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category— from Medium to Large, for example. If there isn’t enough room for the target to double its size, the creature or object attains the maximum possible size in the space available. Until the spell ends, the target also has advantage on Strength checks and Strength saving throws. The target’s weapons also grow to match its new size. While these weapons are enlarged, the target’s attacks with them deal 1d4 extra damage. Reduce. The target’s size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category—from Medium to Small, for example. Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws. The target’s weapons also shrink to match its new size. While these weapons are reduced, the target’s attacks with them deal 1d4 less damage (this can’t reduce the damage below 1).
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Enhance Ability')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Enhance Ability')
    if !Scene:
        prompt('Enhance Ability: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} gains a chosen ability enhancement from Enhance Ability')

