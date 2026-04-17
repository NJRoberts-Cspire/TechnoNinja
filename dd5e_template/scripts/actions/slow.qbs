/*
### Slow

_3rd-level transmutation_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S, M (a drop of molasses)

**Duration**: Concentration, up to 1 minute

You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration. An affected target’s speed is halved, it takes a −2 penalty to AC and Dexterity saving throws, and it can’t use reactions. On its turn, it can use either an action or a bonus action, not both. Regardless of the creature’s abilities or magic items, it can’t make more than one melee or ranged attack during its turn. If the creature attempts to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn’t take effect until the creature’s next turn, and the creature must use its action on that turn to complete the spell. If it can’t, the spell is wasted. A creature affected by this spell makes another Wisdom saving throw at the end of its turn. On a successful save, the effect ends for it.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Slow')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Slow')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Slow Wisdom save')
        else:
            log('Target succeeds Slow Wisdom save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} is slowed: speed halved, -2 AC and Dexterity saves, cannot use reactions, limited to either an action or bonus action per turn')
    for targ in successes:
        name = targ.name
        log('{{name}} is not affected by Slow')

