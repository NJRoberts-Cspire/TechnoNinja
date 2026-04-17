/*
### Greater Invisibility

_4th-level illusion_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Concentration, up to 1 minute

You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target’s person.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Greater Invisibility')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Greater Invisibility')
    if !Scene:
        prompt('Greater Invisibility: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    set_condition(targ, 'Invisible', true)
    name = targ.name
    log('{{name}} becomes invisible until the spell ends; the invisibility persists even when attacking or casting spells')

