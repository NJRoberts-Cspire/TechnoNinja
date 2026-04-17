/*
### Fear

_3rd-level illusion_

**Casting Time**: 1 action

**Range**: Self (30-foot cone)

**Components**: V, S, M (a white feather or the heart of a hen)

**Duration**: Concentration, up to 1 minute

You project a phantasmal image of a creature’s worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration. While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn’t have line of sight to you, the creature can make a Wisdom saving throw. On a successful save, the spell ends for that creature.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Fear')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Fear')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Fear Wisdom save')
        else:
            log('Target succeeds Fear Wisdom save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Frightened', true)
        log('{{name}} is frightened and must use its movement to move away from Owner on each of its turns')
    for targ in successes:
        name = targ.name
        log('{{name}} is not frightened by Fear')

