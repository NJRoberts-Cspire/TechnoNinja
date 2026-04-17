/*
### Sanctuary

_1st-level abjuration_

**Casting Time**: 1 bonus action

**Range**: 30 feet

**Components**: V, S, M (a small silver mirror)

**Duration**: 1 minute

You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn’t protect the warded creature from area effects, such as the explosion of a fireball. If the warded creature makes an attack or casts a spell that affects an enemy creature, this spell ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Sanctuary')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Sanctuary: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} is warded by Sanctuary: attackers must succeed on a Wisdom save or choose a new target')

