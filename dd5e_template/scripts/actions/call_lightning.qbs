/*
### Call Lightning

_3rd-level conjuration_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Concentration, up to 10 minutes

A storm cloud appears in the shape of a cylinder that is 10 feet tall with a 60-foot radius, centered on a point you can see 100 feet directly above you. The spell fails if you can’t see a point in the air where the storm cloud could appear (for example, if you are in a room that can’t accommodate the cloud). When you cast the spell, choose a point you can see within range. A bolt of lightning flashes down from the cloud to that point. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes 3d10 lightning damage on a failed save, or half as much damage on a successful one. On each of your turns until the spell ends, you can use your action to call down lightning in this way again, targeting the same point or a different one. If you are outdoors in stormy conditions when you cast this spell, the spell gives you control over the existing storm instead of creating a new one. Under such conditions, the spell’s damage increases by 1d10. 

At Higher Levels. When you cast this spell using a spell slot of 4th or higher level, the damage increases by 1d10 for each slot level above 3rd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Call Lightning')
    if slot_level == -1:
        return

    extra_dice = slot_level - 3
    total_dice = 3 + extra_dice

    set_concentration(Owner, 'Call Lightning')

    if !Scene:
        save_fails = resolve_spell_save_manually(Owner, 'Dexterity')
        if !save_fails:
            log('Call Lightning misses')
            return
        damage = roll_damage(Owner, '{{total_dice}}d10')
        prompt('Call Lightning strikes for {{damage}} lightning damage', ['Ok'])
        log('Call Lightning strikes for {{damage}} lightning damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Lightening')
        name = targ.name
        log('Call Lightning strikes {{name}} for {{damage}} lightening damage')
        apply_damage(targ, damage)

    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Lightening')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Call Lightning grazes {{name}} for {{half_damage}} lightening damage')
        apply_damage(targ, half_damage)
        
    name = Owner.name
    log('Storm cloud conjured; {{name}} can call additional lightening bolts each turn as an action')

