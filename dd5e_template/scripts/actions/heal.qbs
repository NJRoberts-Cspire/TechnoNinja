/*
### Heal

_6th-level evocation_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Instantaneous

Choose a creature that you can see within range. A surge of positive energy washes through the creature, causing it to regain 70 hit points. This spell also ends blindness, deafness, and any diseases affecting the target. This spell has no effect on constructs or undead. 

At Higher Levels. When you cast this spell using a spell slot of 7th level or higher, the amount of healing increases by 10 for each slot level above 6th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Heal')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Heal: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    heal_amount = 70 + (slot_level - 6) * 10
    heal_hp(targ, heal_amount)
    set_condition(targ, 'Blinded', false)
    set_condition(targ, 'Deafened', false)
    name = targ.name
    log('Heal restores {{heal_amount}} HP to {{name}} and clears Blinded, Deafened, and disease conditions')

