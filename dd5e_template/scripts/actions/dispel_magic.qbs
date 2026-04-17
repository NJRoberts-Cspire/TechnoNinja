/*
### Dispel Magic

_3rd-level abjuration_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Instantaneous

Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell’s level. On a successful check, the spell ends. 

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, you automatically end the effects of a spell on the target if the spell’s level is equal to or less than the level of the spell slot you used.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Dispel Magic')
    if slot_level == -1:
        return
    log('For targets, all spells of 3rd level or lower end automatically; spells of 4th level or higher require a spellcasting ability check (DC 10 + spell level)')

    
