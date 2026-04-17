/*
### Scrying

_5th-level divination_

**Casting Time**: 10 minutes

**Range**: Self

**Components**: V, S, M (a focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water)

**Duration**: Concentration, up to 10 minutes

You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it. If a target knows you’re casting this spell, it can fail the saving throw voluntarily if it wants to be observed. 176 On a successful save, the target isn’t affected, and you can’t use this spell against it again for 24 hours. On a failed save, the spell creates an invisible sensor within 10 feet of the target. You can see and hear through the sensor as if you were there. The sensor moves with the target, remaining within 10 feet of it for the duration. A creature that can see invisible objects sees the sensor as a luminous orb about the size of your fist. Instead of targeting a creature, you can choose a location you have seen before as the target of this spell. When you do, the sensor appears at that location and doesn’t move.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Scrying')
    if slot_level == -1:
        return
        set_concentration(Owner, 'Scrying')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Scrying Wisdom save')
        else:
            log('Target succeeds Scrying Wisdom save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('Scrying on {{name}}')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Scrying')

