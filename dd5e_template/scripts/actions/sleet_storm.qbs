/*
### Sleet Storm

_3rd-level conjuration_

**Casting Time**: 1 action

**Range**: 150 feet

**Components**: V, S, M (a pinch of dust and a few drops of water)

**Duration**: Concentration, up to 1 minute

Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused. The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell’s area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone. If a creature is concentrating in the spell’s area, the creature must make a successful Constitution saving throw against your spell save DC or lose concentration.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Sleet Storm')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Sleet Storm')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Sleet Storm Dexterity save')
        else:
            log('Target succeeds Sleet Storm Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Prone', true)
        log('{{name}} falls prone in the sleet storm')
    for targ in successes:
        name = targ.name
        log('{{name}} maintains their footing in the sleet storm')
    log('Sleet storm is active; the area is heavily obscured and difficult terrain')

    
