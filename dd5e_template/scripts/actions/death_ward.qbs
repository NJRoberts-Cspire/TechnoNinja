/*
### Death Ward

_4th-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: 8 hours

You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point, and the spell ends. If the spell is still in effect when the target is subjected to an effect that would kill it instantaneously without dealing damage, that effect is instead negated against the target, and the spell ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Death Ward')
    if slot_level == -1:
        return

    if !Scene:
        prompt('A creature you touch is protected by Death Ward', ['Ok'])
        return
        
    targ = selectCharacter()
    name = targ.name
    log('{{name}} is protected by Death Ward; the first time they would drop to 0 hit points, they instead drop to 1')

