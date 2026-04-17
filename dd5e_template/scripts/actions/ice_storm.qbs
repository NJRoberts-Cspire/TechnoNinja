/*
### Ice Storm

_4th-level evocation_

**Casting Time**: 1 action

**Range**: 300 feet

**Components**: V, S, M (a pinch of dust and a few drops of water)

**Duration**: Instantaneous

A hail of rock-hard ice pounds to the ground in a 20- foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one. Hailstones turn the storm’s area of effect into difficult terrain until the end of your next turn. 

At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Ice Storm')
    if slot_level == -1:
        return
    extra_dice = slot_level - 4
    bludgeoning_dice = 2 + extra_dice
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Ice Storm Dexterity save')
        else:
            log('Target succeeds Ice Storm Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        bludgeoning = roll_damage(Owner, '{{bludgeoning_dice}}d8', targ, 'Cold')
        cold = roll_damage(Owner, '4d6', targ, 'Cold')
        total = bludgeoning + cold
        name = targ.name
        log('Ice Storm hits {{name}} for {{bludgeoning}} bludgeoning and {{cold}} cold damage ({{total}} total)')
        apply_damage(targ, total)
    for targ in successes:
        bludgeoning = roll_damage(Owner, '{{bludgeoning_dice}}d8', targ, 'Cold')
        cold = roll_damage(Owner, '4d6', targ, 'Cold')
        total = bludgeoning + cold
        half_damage = floor(total / 2)
        name = targ.name
        log('Ice Storm grazes {{name}} for {{half_damage}} damage')
        apply_damage(targ, half_damage)

