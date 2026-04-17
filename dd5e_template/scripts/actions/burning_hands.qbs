/*
### Burning Hands

_1st-level evocation_

**Casting Time**: 1 action

**Range**: Self (15-foot cone)

**Components**: V, S

**Duration**: Instantaneous

As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one. The fire ignites any flammable objects in the area that aren’t being worn or carried. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Burning Hands')
    if slot_level == -1:
        return

    total_dice = 3 + (slot_level - 1)

    if !Scene:
        save_fails = resolve_spell_save_manually(Owner, 'Dexterity')
        if !save_fails:
            log('Burning Hands misses')
            return
        damage = roll_damage(Owner, '{{total_dice}}d6')
        prompt('Burning Hands hits for {{damage}} fire damage', ['Ok'])
        log('Burning Hands hits for {{damage}} fire damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Fire')
        name = targ.name
        log('Burning Hands hits {{name}} for {{damage}} fire damage')
        apply_damage(targ, damage)

    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Fire')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Burning Hands grazes {{name}} for {{half_damage}} fire damage')
        apply_damage(targ, half_damage)


