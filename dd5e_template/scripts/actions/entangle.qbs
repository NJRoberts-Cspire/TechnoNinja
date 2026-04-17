/*
### Entangle

_1st-level conjuration_

**Casting Time**: 1 action

**Range**: 90 feet

**Components**: V, S

**Duration**: Concentration, up to 1 minute

Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself. When the spell ends, the conjured plants wilt away.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Entangle')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Entangle')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Strength')
        if !failed:
            log('Target fails Entangle Strength save')
        else:
            log('Target succeeds Entangle Strength save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Strength')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Restrained', true)
        log('{{name}} is restrained by Entangle')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Entangle')
