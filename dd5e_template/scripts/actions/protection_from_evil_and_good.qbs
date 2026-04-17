/*
### Protection from Evil and Good

_1st-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (holy water or powdered silver and iron, which the spell consumes)

**Duration**: Concentration up to 10 minutes Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead.

The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can’t be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Protection from Evil and Good')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Protection from Evil and Good')
    if !Scene:
        prompt('Protection from Evil and Good: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} is protected from aberrations, celestials, elementals, fey, fiends, and undead')

