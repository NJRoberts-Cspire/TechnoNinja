/*
### Freezing Sphere

_6th-level evocation_

**Casting Time**: 1 action

**Range**: 300 feet

**Components**: V, S, M (a small crystal sphere)

**Duration**: Instantaneous

A frigid globe of cold energy streaks from your fingertips to a point of your choice within range, where it explodes in a 60-foot-radius sphere. Each creature within the area must make a Constitution saving throw. On a failed save, a creature takes 10d6 cold damage. On a successful save, it takes half as much damage. If the globe strikes a body of water or a liquid that is principally water (not including water-based creatures), it freezes the liquid to a depth of 6 inches over an area 30 feet square. This ice lasts for 1 minute. Creatures that were swimming on the surface of frozen water are trapped in the ice. A trapped creature can use an action to make a Strength check against your spell save DC to break free. You can refrain from firing the globe after completing the spell, if you wish. A small globe about the size of a sling stone, cool to the touch, appears in your hand. At any time, you or a creature you give the globe to can throw the globe (to a range of 40 feet) or hurl it with a sling (to the sling’s normal range). It shatters on impact, with the same effect as the normal casting of the spell. You can also set the globe down without shattering it. After 1 minute, if the globe hasn’t already shattered, it explodes. 147 

At Higher Levels. When you cast this spell using a spell slot of 7th level or higher, the damage increases by 1d6 for each slot level above 6th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Freezing Sphere')
    if slot_level == -1:
        return
    extra_dice = slot_level - 6
    total_dice = 10 + extra_dice
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Freezing Sphere Constitution save')
        else:
            log('Target succeeds Freezing Sphere Constitution save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Cold')
        name = targ.name
        log('Freezing Sphere hits {{name}} for {{damage}} cold damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Cold')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Freezing Sphere grazes {{name}} for {{half_damage}} cold damage')
        apply_damage(targ, half_damage)

