/*
### Magic Missile

_1st-level evocation_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Instantaneous

You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Magic Missile')
    if slot_level == -1:
        return
    darts = 3 + (slot_level - 1)
    for i in darts:
        if !Scene:
            prompt('Magic Missile: select targets in an active scene to resolve this spell.', ['Ok'])
            return

        targ = selectCharacter()
        damage = roll_damage(Owner, '1d4', targ, 'Force') + 1
        name = targ.name
        apply_damage(targ, damage)
        log('Magic Missile dart hits {{name}} for {{damage}} force damage')

