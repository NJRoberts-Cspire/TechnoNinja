/*
### Hypnotic Pattern

_3rd-level illusion_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: S, M (a glowing stick of incense or a crystal vial filled with phosphorescent material)

**Duration**: Concentration, up to 1 minute

You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. The pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0. The spell ends for an affected creature if it takes any damage or if someone else uses an action to shake the creature out of its stupor.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Hypnotic Pattern')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Hypnotic Pattern')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Hypnotic Pattern Wisdom save')
        else:
            log('Target succeeds Hypnotic Pattern Wisdom save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Incapacitated', true)
        log('{{name}} is charmed and incapacitated by Hypnotic Pattern; speed drops to 0')
    for targ in successes:
        name = targ.name
        log('{{name}} is not affected by Hypnotic Pattern')
