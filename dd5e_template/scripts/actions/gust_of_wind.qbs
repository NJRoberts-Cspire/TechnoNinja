/*
### Gust of Wind

_2nd-level evocation_

**Casting Time**: 1 action

**Range**: Self (60-foot line)

**Components**: V, S, M (a legume seed)

**Duration**: Concentration, up to 1 minute

A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell’s duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line. Any creature in the line must spend 2 feet of movement for every 1 foot it moves when moving closer to you. The gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them. As a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Gust of Wind')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Gust of Wind')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Strength')
        if !failed:
            log('Target fails Gust of Wind Strength save')
        else:
            log('Target succeeds Gust of Wind Strength save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Strength')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} is pushed 15 feet away by Gust of Wind')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted being pushed by Gust of Wind')
    caster_name = Owner.name
    log('{{caster_name}} casts Gust of Wind: the area is difficult terrain')

