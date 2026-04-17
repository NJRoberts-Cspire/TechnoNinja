/*
### Lightning Bolt

_3rd-level evocation_

**Casting Time**: 1 action

**Range**: Self (100-foot line)

**Components**: V, S, M (a bit of fur and a rod of amber, crystal, or glass)

**Duration**: Instantaneous

A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one. The lightning ignites flammable objects in the area that aren’t being worn or carried. 

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Lightning Bolt')
    if slot_level == -1:
        return
    extra_dice = slot_level - 3
    total_dice = 8 + extra_dice
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Lightning Bolt Dexterity save')
        else:
            log('Target succeeds Lightning Bolt Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Lightning')
        name = targ.name
        log('Lightning Bolt strikes {{name}} for {{damage}} lightning damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Lightning')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Lightning Bolt grazes {{name}} for {{half_damage}} lightning damage')
        apply_damage(targ, half_damage)

