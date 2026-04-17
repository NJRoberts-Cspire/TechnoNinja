/*
### Grease

_1st-level conjuration_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (a bit of pork rind or butter)

**Duration**: 1 minute

Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration. When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Grease')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Grease Dexterity save')
        else:
            log('Target succeeds Grease Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Prone', true)
        log('{{name}} slips in the grease and falls prone')
    for targ in successes:
        name = targ.name
        log('{{name}} kept their footing in the grease')

