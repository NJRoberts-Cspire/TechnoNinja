/*
### Hideous Laughter

_1st-level enchantment_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (tiny tarts and a feather that is waved in the air)

**Duration**: Concentration, up to 1 minute

A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn’t affected. At the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it’s triggered by damage. On a success, the spell ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Hideous Laughter')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Hideous Laughter')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Hideous Laughter Wisdom save')
        else:
            log('Target succeeds Hideous Laughter Wisdom save')
        return

    targ = selectCharacter()
    results = saving_throw(Owner, [targ], 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Incapacitated', true)
        set_condition(targ, 'Prone', true)
        log('{{name}} is overcome with hideous laughter: incapacitated and prone')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Hideous Laughter')

