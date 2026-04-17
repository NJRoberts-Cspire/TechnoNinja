/*
### Mind Blank

_8th-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: 24 hours

Until the spell ends, one willing creature you touch is immune to psychic damage, any effect that would sense its emotions or read its thoughts, divination spells, and the charmed condition. The spell even foils wish spells and spells or effects of similar power used to affect the target’s mind or to gain information about the target.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Mind Blank')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Mind Blank: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} is immune to psychic damage, divination spells, and charm effects for 24 hours')

