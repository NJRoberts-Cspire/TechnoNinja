/*
### Scorching Ray

_2nd-level evocation_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Instantaneous

You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you create one additional ray for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Scorching Ray')
    if slot_level == -1:
        return

    extra_rays = slot_level - 2
    ray_count = 3 + extra_rays

    for i in ray_count:
        if !Scene:
            resolve_spell_attack_manually(Owner, '2d6')
            return

        results = spell_attack(Owner, false)
        hits = results[0]
        for targ in hits:
            damage = roll_damage(Owner, '2d6', targ, 'Fire')
            name = targ.name
            log('Scorching Ray hits {{name}} for {{damage}} fire damage')
            apply_damage(targ, damage)

