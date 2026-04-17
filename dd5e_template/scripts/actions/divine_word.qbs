/*
### Divine Word

_7th-level evocation_

**Casting Time**: 1 bonus action

**Range**: 30 feet

**Components**: V

**Duration**: Instantaneous

You utter a divine word, imbued with the power that shaped the world at the dawn of creation. Choose any number of creatures you can see within range. Each creature that can hear you must make a Charisma saving throw. On a failed save, a creature suffers an effect based on its current hit points: • 50 hit points or fewer: deafened for 1 minute • 40 hit points or fewer: deafened and blinded for 10 minutes • 30 hit points or fewer: blinded, deafened, and stunned for 1 hour • 20 hit points or fewer: killed instantly Regardless of its current hit points, a celestial, an elemental, a fey, or a fiend that fails its save is forced back to its plane of origin (if it isn’t there already) and can’t return to your current plane for 24 hours by any means short of a wish spell.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 7, 'Divine Word')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Charisma')
        if !failed:
            log('Target fails Divine Word Charisma save')
        else:
            log('Target succeeds Divine Word Charisma save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Charisma')
    successes = results[0]
    failures = results[1]
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Divine Word')
    for targ in failures:
        hp = targ.Attribute('Hit Points').value
        name = targ.name
        if hp <= 20:
            apply_damage(targ, hp)
            log('{{name}} is slain by Divine Word')
        else if hp <= 30:
            set_condition(targ, 'Deafened', true)
            set_condition(targ, 'Blinded', true)
            set_condition(targ, 'Stunned', true)
            log('{{name}} is Deafened, Blinded, and Stunned by Divine Word')
        else if hp <= 40:
            set_condition(targ, 'Deafened', true)
            set_condition(targ, 'Blinded', true)
            log('{{name}} is Deafened and Blinded by Divine Word')
        else if hp <= 50:
            set_condition(targ, 'Deafened', true)
            log('{{name}} is Deafened by Divine Word')
        else:
            log('{{name}} suffers no additional effects from Divine Word')

