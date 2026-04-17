/*
### Weird

_9th-level illusion_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Concentration, up to one minute Drawing on the deepest fears of a group of creatures, you create illusory creatures in their minds, visible only to them.

Each creature in a 30-foot-radius sphere centered on a point of your choice within range must make a Wisdom saving throw. On a failed save, a creature becomes frightened for the duration. The illusion calls on the creature’s deepest fears, manifesting its worst nightmares as an implacable threat. At the end of each of the frightened creature’s turns, it must succeed on a Wisdom saving throw or take 4d10 psychic damage. On a successful save, the spell ends for that creature.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 9, 'Weird')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Weird')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Weird Wisdom save')
        else:
            log('Target succeeds Weird Wisdom save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        set_condition(targ, 'Frightened', true)
        name = targ.name
        log('{{name}} is Frightened by Weird; takes 4d10 psychic damage per round on a failed Wisdom save (handled by turn monitor)')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Weird')

