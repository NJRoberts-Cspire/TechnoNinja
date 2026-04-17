/*
### Freedom of Movement

_4th-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a leather strap, bound around the arm or a similar appendage)

**Duration**: 1 hour

You touch a willing creature. For the duration, the target’s movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target’s speed nor cause the target to be paralyzed or restrained. The target can also spend 5 feet of movement to automatically escape from nonmagical restraints, such as manacles or a creature that has it grappled. Finally, being underwater imposes no penalties on the target’s movement or attacks.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Freedom of Movement')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Freedom of Movement: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} is unaffected by difficult terrain and magical effects that reduce movement, and cannot be paralyzed or restrained for 1 hour')

