/*
### Stinking Cloud

_3rd-level conjuration_

**Casting Time**: 1 action

**Range**: 90 feet

**Components**: V, S, M (a rotten egg or several skunk cabbage leaves)

**Duration**: Concentration, up to 1 minute

You create a 20-foot-radius sphere of yellow, nauseating gas centered on a point within range. The cloud spreads around corners, and its area is heavily obscured. The cloud lingers in the air for the duration. Each creature that is completely within the cloud at the start of its turn must make a Constitution saving throw against poison. On a failed save, the creature spends its action that turn retching and reeling. Creatures that don’t need to breathe or are immune to poison automatically succeed on this saving throw. moderate wind (at least 10 miles per hour) disperses the cloud after 4 rounds. A strong wind (at least 20 miles per hour) disperses it after 1 round.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Stinking Cloud')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Stinking Cloud')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Stinking Cloud Constitution save')
        else:
            log('Target succeeds Stinking Cloud Constitution save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Incapacitated', true)
        log('{{name}} is retching and reeling in the stinking cloud; their action is wasted this turn')
    for targ in successes:
        name = targ.name
        log('{{name}} is not incapacitated by the Stinking Cloud')

