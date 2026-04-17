/*
### Compulsion

_4th-level enchantment_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S

**Duration**: Concentration, up to 1 minute

Creatures of your choice that you can see within range and that can hear you must make a Wisdom saving throw. A target automatically succeeds on this saving throw if it can't be charmed. On a failed save, a target is affected by this spell. Until the spell ends, you can use a bonus action on each of your turns to designate a direction that is horizontal to 126 you. Each affected target must use as much of its movement as possible to move in that direction on its next turn. It can take its action before it moves. After moving in this way, it can make another Wisdom saving to try to end the effect. A target isn't compelled to move into an obviously deadly hazard, such as a fire or pit, but it will provoke opportunity attacks to move in the designated direction.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Compulsion')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Compulsion')

    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target resists Compulsion')
            return
        log('Target is compelled to move in a designated direction on each of their turns')
        return
    
    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} is compelled to move in a designated direction on each of their turns')
    for targ in successes:
        name = targ.name
        log('{{name}} is not affected by Compulsion')

