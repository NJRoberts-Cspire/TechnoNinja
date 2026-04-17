/*
### Counterspell

_3rd-level abjuration_

**Casting Time**: 1 reaction, which you take when you see a creature within 60 feet of you casting a spell

**Range**: 60 feet

**Components**: S

**Duration**: Instantaneous

You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect. 

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Counterspell')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} counters a spell being cast; automatically counters spells of 3rd level or lower, higher levels require a spellcasting ability check (DC 10 + spell level)')

