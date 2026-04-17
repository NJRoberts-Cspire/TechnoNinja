/*
### Flesh to Stone

_6th-level transmutation_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (a pinch of lime, water, and earth)

**Duration**: Concentration, up to 1 minute

You attempt to turn one creature that you can see within range into stone. If the target’s body is made of flesh, the creature must make a Constitution saving throw. On a failed save, it is restrained as its flesh begins to harden. On a successful save, the creature isn’t affected. A creature restrained by this spell must make another Constitution saving throw at the end of each 145 of its turns. If it successfully saves against this spell three times, the spell ends. If it fails its saves three times, it is turned to stone and subjected to the petrified condition for the duration. The successes and failures don’t need to be consecutive; keep track of both until the target collects three of a kind. If the creature is physically broken while petrified, it suffers from similar deformities if it reverts to its original state. If you maintain your concentration on this spell for the entire possible duration, the creature is turned to stone until the effect is removed.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Flesh to Stone')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Flesh to Stone')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Flesh to Stone Constitution save')
        else:
            log('Target succeeds Flesh to Stone Constitution save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} begins petrifying (requires 3 consecutive failed Constitution saves to fully petrify)')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Flesh to Stone')

