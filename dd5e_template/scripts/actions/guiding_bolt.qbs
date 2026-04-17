/*
### Guiding Bolt

_1st-level evocation_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: 1 round

A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made 151 against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Guiding Bolt')
    if slot_level == -1:
        return
    total_dice = 4 + (slot_level - 1)
    if !Scene:
        resolve_spell_attack_manually(Owner, '{{total_dice}}d6')
        return

    results = spell_attack(Owner, false)
    hits = results[0]
    for targ in hits:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Radiant')
        name = targ.name
        log('Guiding Bolt hits {{name}} for {{damage}} radiant damage. The next attack roll against {{name}} has advantage.')
        apply_damage(targ, damage)

