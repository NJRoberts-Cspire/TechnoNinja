/*
### Sunbeam

_6th-level evocation_

**Casting Time**: 1 action

**Range**: Self (60-foot line)

**Components**: V, S, M (a magnifying glass)

**Duration**: Concentration, up to 1 minute

A beam of brilliant light flashes out from your hand in a 5-foot-wide, 60-foot-long line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d8 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn’t blinded by this spell. Undead and oozes have disadvantage on this saving throw. You can create a new line of radiance as your action on any turn until the spell ends. For the duration, a mote of brilliant radiance shines in your hand. It sheds bright light in a 30-foot radius and dim light for an additional 30 feet. This light is sunlight.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Sunbeam')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Sunbeam')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Sunbeam Constitution save')
        else:
            log('Target succeeds Sunbeam Constitution save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '6d8', targ, 'Radiant')
        name = targ.name
        set_condition(targ, 'Blinded', true)
        log('Sunbeam hits {{name}} for {{damage}} radiant damage and Blinds them')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '6d8', targ, 'Radiant')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Sunbeam grazes {{name}} for {{half_damage}} radiant damage')
        apply_damage(targ, half_damage)

