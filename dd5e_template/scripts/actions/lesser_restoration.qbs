/*
### Lesser Restoration

_2nd-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Instantaneous

You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Lesser Restoration')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Lesser Restoration: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    condition_to_clear = prompt(Owner, 'Clear which condition?', ['Blinded', 'Deafened', 'Paralyzed', 'Poisoned'])
    set_condition(targ, condition_to_clear, false)
    name = targ.name
    log('Lesser Restoration clears {{condition_to_clear}} from {{name}}')

