/*
### Insect Plague

_5th-level conjuration_

**Casting Time**: 1 action

**Range**: 300 feet

**Components**: V, S, M (a few grains of sugar, some kernels of grain, and a smear of fat)

**Duration**: Concentration, up to 10 minutes

Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere’s area is difficult terrain. When the area appears, each creature in it must make a Constitution saving throw. A creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell’s area for the first time on a turn or ends its turn there. 

At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Insect Plague')
    if slot_level == -1:
        return
    extra_dice = slot_level - 5
    total_dice = 4 + extra_dice
    set_concentration(Owner, 'Insect Plague')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Insect Plague Constitution save')
        else:
            log('Target succeeds Insect Plague Constitution save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Piercing')
        name = targ.name
        log('Insect Plague hits {{name}} for {{damage}} piercing damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Piercing')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Insect Plague grazes {{name}} for {{half_damage}} piercing damage')
        apply_damage(targ, half_damage)

