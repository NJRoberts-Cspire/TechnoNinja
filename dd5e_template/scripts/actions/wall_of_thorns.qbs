/*
### Wall of Thorns

_6th-level conjuration_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S, M (a handful of thorns)

**Duration**: Concentration, up to 10 minutes

You create a wall of tough, pliable, tangled brush bristling with needle-sharp thorns. The wall appears within range on a solid surface and lasts for the duration. You choose to make the wall up to 60 feet long, 10 feet high, and 5 feet thick or a circle that has a 20-foot diameter and is up to 20 feet high and 5 feet thick. The wall blocks line of sight. When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 7d8 piercing damage, or half as much damage on a successful save. A creature can move through the wall, albeit slowly and painfully. For every 1 foot a creature moves through the wall, it must spend 4 feet of movement. Furthermore, the first time a creature enters the wall on a turn or ends its turn there, the creature must make a Dexterity saving throw. It takes 7d8 slashing damage on a failed save, or half as much damage on a successful one. 

At Higher Levels. When you cast this spell using a spell slot of 7th level or higher, both types of damage increase by 1d8 for each slot level above 6th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Wall of Thorns')
    if slot_level == -1:
        return
    extra_dice = slot_level - 6
    total_dice = 7 + extra_dice
    set_concentration(Owner, 'Wall of Thorns')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Wall of Thorns Dexterity save')
        else:
            log('Target succeeds Wall of Thorns Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Piercing')
        name = targ.name
        log('Wall of Thorns hits {{name}} for {{damage}} piercing damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Piercing')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Wall of Thorns grazes {{name}} for {{half_damage}} piercing damage')
        apply_damage(targ, half_damage)

