/*
### Invisibility

_2nd-level illusion_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (an eyelash encased in gum arabic)

**Duration**: Concentration, up to 1 hour

A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target’s 157 person. The spell ends for a target that attacks or casts a spell. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Invisibility')
    if slot_level == -1:
        return
    max_targets = slot_level - 1
    announce('Invisibility: select up to {{max_targets}} targets')
    set_concentration(Owner, 'Invisibility')
    if !Scene:
        prompt('Invisibility: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targets = selectCharacters()
    for targ in targets:
        name = targ.name
        set_condition(targ, 'Invisible', true)
        log('{{name}} becomes invisible')

