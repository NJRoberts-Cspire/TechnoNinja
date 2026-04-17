/*
### Greater Restoration

_5th-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (diamond dust worth at least 100 gp, which the spell consumes)

**Duration**: Instantaneous

You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target’s exhaustion level by one, or end one of the following effects on the target: • One effect that charmed or petrified the target • One curse, including the target’s attunement to a cursed magic item • Any reduction to one of the target’s ability scores • One effect reducing the target’s hit point maximum
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Greater Restoration')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Greater Restoration: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    set_condition(targ, 'Blinded', false)
    set_condition(targ, 'Charmed', false)
    set_condition(targ, 'Deafened', false)
    set_condition(targ, 'Frightened', false)
    set_condition(targ, 'Paralyzed', false)
    set_condition(targ, 'Petrified', false)
    set_condition(targ, 'Poisoned', false)
    set_condition(targ, 'Restrained', false)
    set_condition(targ, 'Stunned', false)
    set_condition(targ, 'Unconscious', false)
    set_condition(targ, 'Exhaustion', 0)
    name = targ.name
    log('Greater Restoration removes all conditions from {{name}}')

