/*
### Disintegrate

_6th-level transmutation_

**Casting Time**: 1 action

**Range**: 60 feet 135

**Components**: V, S, M (a lodestone and a pinch of dust)

**Duration**: Instantaneous

A thin green ray springs from your pointing finger to a target that you can see within range. The target can be a creature, an object, or a creation of magical force, such as the wall created by wall of force. A creature targeted by this spell must make a Dexterity saving throw. On a failed save, the target takes 10d6 + 40 force damage. If this damage reduces the target to 0 hit points, it is disintegrated. A disintegrated creature and everything it is wearing and carrying, except magic items, are reduced to a pile of fine gray dust. The creature can be restored to life only by means of a true resurrection or a wish spell. This spell automatically disintegrates a Large or smaller nonmagical object or a creation of magical force. If the target is a Huge or larger object or creation of force, this spell disintegrates a 10-foot- cube portion of it. A magic item is unaffected by this spell. 

At Higher Levels. When you cast this spell using a spell slot of 7th level or higher, the damage increases by 3d6 for each slot level above 6th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Disintegrate')
    if slot_level == -1:
        return
    extra_dice = (slot_level - 6) * 3
    total_dice = 10 + extra_dice
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Disintegrate Dexterity save')
        else:
            log('Target succeeds Disintegrate Dexterity save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Force') + 40
        name = targ.name
        log('Disintegrate hits {{name}} for {{damage}} force damage (if reduced to 0 HP, target is disintegrated)')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Force') + 40
        half_damage = floor(damage / 2)
        name = targ.name
        log('Disintegrate grazes {{name}} for {{half_damage}} force damage')
        apply_damage(targ, half_damage)

