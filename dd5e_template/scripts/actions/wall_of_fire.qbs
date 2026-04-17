/*
### Wall of Fire

_4th-level evocation_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S, M (a small piece of phosphorus)

**Duration**: Concentration, up to 1 minute

You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration. When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save. One side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature that ends its turn within 10 feet of that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage. 

At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Wall of Fire')
    if slot_level == -1:
        return
    extra_dice = slot_level - 4
    total_dice = 5 + extra_dice
    set_concentration(Owner, 'Wall of Fire')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Wall of Fire Dexterity save')
        else:
            log('Target succeeds Wall of Fire Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Fire')
        name = targ.name
        log('Wall of Fire burns {{name}} for {{damage}} fire damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Fire')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Wall of Fire singes {{name}} for {{half_damage}} fire damage')
        apply_damage(targ, half_damage)
    log('Wall of fire is active; creatures entering or starting their turn within 10 feet of the hot side take fire damage')

