/*
### Phantasmal Killer

_4th-level illusion_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Concentration, up to 1 minute

You tap into the nightmares of a creature you can see within range and create an illusory manifestation of its deepest fears, visible only to that creature. The target must make a Wisdom saving throw. On a failed save, the target becomes frightened for the duration. At the end of each of the target’s turns before the spell ends, the target must succeed on a Wisdom saving throw or take 4d10 psychic damage. On a successful save, the spell ends. 

At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d10 for each slot level above 4th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Phantasmal Killer')
    if slot_level == -1:
        return
    extra_dice = slot_level - 4
    total_dice = 4 + extra_dice
    set_concentration(Owner, 'Phantasmal Killer')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Phantasmal Killer Wisdom save')
        else:
            log('Target succeeds Phantasmal Killer Wisdom save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Frightened', true)
        log('{{name}} is frightened by Phantasmal Killer; at the end of each of their turns, they take {{total_dice}}d10 psychic damage on a failed Wisdom save')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Phantasmal Killer')

