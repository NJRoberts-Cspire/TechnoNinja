/*
### Blight

_4th-level necromancy_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S

**Duration**: Instantaneous

Necromantic energy washes over a creature of your choice that you can see within range, draining moisture and vitality from it. The target must make a Constitution saving throw. The target takes 8d8 necrotic damage on a failed save, or half as much damage on a successful one. This spell has no effect on undead or constructs. If you target a plant creature or a magical plant, it makes the saving throw with disadvantage, and the spell deals maximum damage to it. If you target a nonmagical plant that isn’t a creature, such as a tree or shrub, it doesn’t make a saving throw; it simply withers and dies. 

At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Blight')
    if slot_level == -1:
        return

    extra_dice = slot_level - 4
    total_dice = 8 + extra_dice

    if !Scene:
        save_fails = resolve_spell_save_manually(Owner, 'Constitution')
        if !save_fails:
            log('Blight misses')
            return
        damage = roll_damage(Owner, '{{total_dice}}d8')
        prompt('Blight hits for {{damage}} necrotic damage', ['Ok'])
        log('Blight hits for {{damage}} necrotic damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Necrotic')
        name = targ.name
        log('Blight withers {{name}} for {{damage}} necrotic damage')
        apply_damage(targ, damage)

    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Necrotic')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Blight partially withers {{name}} for {{half_damage}} necrotic damage')
        apply_damage(targ, half_damage)

