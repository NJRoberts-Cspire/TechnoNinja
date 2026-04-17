/*
### Stoneskin

_4th-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (diamond dust worth 100 gp, which the spell consumes)

**Duration**: Concentration, up to 1 hour

This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to nonmagical bludgeoning, piercing, and slashing damage.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Stoneskin')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Stoneskin')
    if !Scene:
        prompt('Stoneskin: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} has resistance to nonmagical bludgeoning, piercing, and slashing damage')

