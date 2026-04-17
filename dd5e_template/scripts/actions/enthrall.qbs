/*
### Enthrall

_2nd-level enchantment_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: 1 minute

You weave a distracting string of words, causing creatures of your choice that you can see within range and that can hear you to make a Wisdom saving throw. Any creature that can’t be charmed succeeds on this saving throw automatically, and if you or your companions are fighting a creature, it has advantage on the save. On a failed save, the target has disadvantage on Wisdom (Perception) checks made to perceive any creature other than you until the spell ends or until the target can no longer hear you. The spell ends if you are incapacitated or can no longer speak.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Enthrall')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Enthrall Wisdom save')
        else:
            log('Target succeeds Enthrall Wisdom save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} is enthralled: disadvantage on Perception checks to notice anyone other than the caster')

