/*
### Sunburst

_8th-level evocation_

**Casting Time**: 1 action

**Range**: 150 feet

**Components**: V, S, M (fire and a piece of sunstone)

**Duration**: Instantaneous

Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 12d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn’t blinded by this spell. Undead and oozes have disadvantage on this saving throw. A creature blinded by this spell makes another Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded. This spell dispels any darkness in its area that was created by a spell.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Sunburst')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Sunburst Constitution save')
        else:
            log('Target succeeds Sunburst Constitution save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '12d6', targ, 'Radiant')
        set_condition(targ, 'Blinded', true)
        name = targ.name
        log('Sunburst hits {{name}} for {{damage}} radiant damage and Blinds them')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '12d6', targ, 'Radiant')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Sunburst grazes {{name}} for {{half_damage}} radiant damage')
        apply_damage(targ, half_damage)

