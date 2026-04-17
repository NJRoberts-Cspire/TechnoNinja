/*
### Flaming Sphere

_2nd-level conjuration_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (a bit of tallow, a pinch of brimstone, and a dusting of powdered iron)

**Duration**: Concentration, up to 1 minute

A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one. As a bonus action, you can move the sphere up to 30 feet. If you ram the sphere into a creature, that creature must make the saving throw against the sphere’s damage, and the sphere stops moving this turn. When you move the sphere, you can direct it over barriers up to 5 feet tall and jump it across pits up to 10 feet wide. The sphere ignites flammable objects not being worn or carried, and it sheds bright light in a 20-foot radius and dim light for an additional 20 feet. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Flaming Sphere')
    if slot_level == -1:
        return
    total_dice = 2 + (slot_level - 2)
    set_concentration(Owner, 'Flaming Sphere')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Flaming Sphere Dexterity save')
        else:
            log('Target succeeds Flaming Sphere Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Fire')
        name = targ.name
        log('Flaming Sphere hits {{name}} for {{damage}} fire damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Fire')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Flaming Sphere grazes {{name}} for {{half_damage}} fire damage')
        apply_damage(targ, half_damage)
    caster_name = Owner.name
    log('{{caster_name}} summons a Flaming Sphere')

