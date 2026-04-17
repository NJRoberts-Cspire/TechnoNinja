/*
### Barkskin

_2nd-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a handful of oak bark)

**Duration**: Concentration, up to 1 hour

You touch a willing creature. Until the spell ends, the target’s skin has a rough, bark-like appearance, and the target’s AC can’t be less than 16, regardless of what kind of armor it is wearing.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Barkskin')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Barkskin')

    if !Scene:
        prompt('Select a target. Its AC cannot be less than 16 while Barkskin is active', ['Ok'])
        return
        
    targ = selectCharacter()
    name = targ.name
    log("{{name}}'s AC cannot be less than 16 while Barkskin is active")


