/*
### Circle of Death

_6th-level necromancy_

**Casting Time**: 1 action

**Range**: 150 feet

**Components**: V, S, M (the powder of a crushed black pearl worth at least 500 gp)

**Duration**: Instantaneous

A sphere of negative energy ripples out in a 60-foot- radius sphere from a point within range. Each creature in that area must make a Constitution saving throw. A target takes 8d6 necrotic damage on a failed save, or half as much damage on a successful one. 

At Higher Levels. When you cast this spell using a spell slot of 7th level or higher, the damage increases by 2d6 for each slot level above 6th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Circle of Death')
    if slot_level == -1:
        return

    extra_dice = (slot_level - 6) * 2
    total_dice = 8 + extra_dice

    if !Scene:
        save_fails = resolve_spell_save_manually(Owner, 'Constitution')
        if !save_fails:
            log('Circle of Death misses')
            return
        damage = roll_damage(Owner, '{{total_dice}}d6')
        prompt('Circle of Death hits for {{damage}} necrotic damage', ['Ok'])
        log('Circle of Death hits for {{damage}} necrotic damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Necrotic')
        name = targ.name
        log('Circle of Death hits {{name}} for {{damage}} necrotic damage')
        apply_damage(targ, damage)

    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Necrotic')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Circle of Death grazes {{name}} for {{half_damage}} necrotic damage')
        apply_damage(targ, half_damage)

