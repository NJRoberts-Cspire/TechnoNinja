/*
### Geas

_5th-level enchantment_

**Casting Time**: 1 minute

**Range**: 60 feet

**Components**: V

**Duration**: 30 days

You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide. If the creature can understand you, it must succeed on a Wisdom saving throw or become charmed by you for the duration. While the creature is charmed by you, it takes 5d10 psychic damage each time it acts in a manner directly counter to your instructions, but no more than once each day. A creature that can’t understand you is unaffected by the spell. You can issue any command you choose, short of an activity that would result in certain death. Should you issue a suicidal command, the spell ends. You can end the spell early by using an action to dismiss it. A remove curse, greater restoration, or wish spell also ends it. 

At Higher Levels. When you cast this spell using a spell slot of 7th or 8th level, the duration is 1 year. When you cast this spell using a spell slot of 9th level, the spell lasts until it is ended by one of the spells mentioned above.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Geas')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Geas Wisdom save')
        else:
            log('Target succeeds Geas Wisdom save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} is under Geas for 30 days')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Geas')

