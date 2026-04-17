/*
### Irresistible Dance

_6th-level enchantment_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V

**Duration**: Concentration, up to 1 minute

Choose one creature that you can see within range. The target begins a comic dance in place: shuffling, tapping its feet, and capering for the duration. Creatures that can’t be charmed are immune to this spell. A dancing creature must use all its movement to dance without leaving its space and has disadvantage on Dexterity saving throws and attack rolls. While the target is affected by this spell, other creatures have advantage on attack rolls against it. As an action, a dancing creature makes a Wisdom saving throw to regain control of itself. On a successful save, the spell ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 6, 'Irresistible Dance')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Irresistible Dance')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Irresistible Dance Wisdom save')
        else:
            log('Target succeeds Irresistible Dance Wisdom save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        set_condition(targ, 'Incapacitated', true)
        name = targ.name
        log('{{name}} is forced to dance; disadvantage on Dexterity saves and attack rolls against them have advantage')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Irresistible Dance')

