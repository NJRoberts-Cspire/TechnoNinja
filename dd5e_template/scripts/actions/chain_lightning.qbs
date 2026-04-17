/*
### Chain Lightning

_6th-level evocation_

**Casting Time**: 1 action

**Range**: 150 feet

**Components**: V, S, M (a bit of fur; a piece of amber, glass, or a crystal rod; and three silver pins)

**Duration**: Instantaneous

You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets, each of which must be within 30 feet of the first target. A target can be a creature or an object and can be targeted by only one of the bolts. A target must make a Dexterity saving throw. The target takes 10d8 lightning damage on a failed save, or half as much damage on a successful one. 

At Higher Levels. When you cast this spell using a spell slot of 7th level or higher, one additional bolt leaps from the first target to another target for each slot level above 6th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Chain Lightning')
    if slot_level == -1:
        return

    extra_dice = slot_level - 6
    total_dice = 10 + extra_dice

    if !Scene:
        save_fails = resolve_spell_save_manually(Owner, 'Dexterity')
        if !save_fails:
            log('Chain Lightning misses')
            return
        damage = roll_damage(Owner, '{{total_dice}}d8')
        prompt('Chain Lightning hits for {{damage}} lightning damage', ['Ok'])
        log('Chain Lightning hits for {{damage}} lightning damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Lightening')
        name = targ.name
        log('Chain Lightning hits {{name}} for {{damage}} lightening damage')
        apply_damage(targ, damage)

    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Lightening')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Chain Lightning grazes {{name}} for {{half_damage}} lightening damage')
        apply_damage(targ, half_damage)
