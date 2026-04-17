/*
### Hold Monster

_5th-level enchantment_

**Casting Time**: 1 action

**Range**: 90 feet

**Components**: V, S, M (a small, straight piece of iron)

**Duration**: Concentration, up to 1 minute

Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. This spell has no effect on undead. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target. 

At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, you can target one additional creature for each slot level above 5th. The creatures must be within 30 feet of each other when you target them.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Hold Monster')
    if slot_level == -1:
        return
    extra_targets = slot_level - 5
        set_concentration(Owner, 'Hold Monster')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Hold Monster Wisdom save')
        else:
            log('Target succeeds Hold Monster Wisdom save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        set_condition(targ, 'Paralyzed', true)
        name = targ.name
        log('{{name}} is Paralyzed by Hold Monster')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Hold Monster')
    if extra_targets > 0:
        log('At this slot level, {{extra_targets}} additional target(s) can be affected')

