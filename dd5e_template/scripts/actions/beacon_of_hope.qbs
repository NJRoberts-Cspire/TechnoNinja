/*
### Beacon of Hope

_3rd-level abjuration_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S

**Duration**: Concentration, up to 1 minute

This spell bestows hope and vitality. Choose any number of creatures within range. For the duration, each target has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points possible from any healing.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Beacon of Hope')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Beacon of Hope')

    if !Scene:
        prompt('Your targes have advantage on Wisdom saves and death saving throws, and regains maximum hit points from healing', ['Ok'])
        return
    
    targets = selectCharacters()
    for targ in targets:
        name = targ.name
        add_advantage(targ, 'Beacon of Hope', 'wisdom_saves, death_saves')
        log('{{name}} has advantage on Wisdom saves and death saving throws, and regains maximum hit points from healing')
