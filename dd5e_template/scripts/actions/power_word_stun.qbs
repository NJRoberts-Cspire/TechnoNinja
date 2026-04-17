/*
### Power Word Stun

_8th-level enchantment_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V

**Duration**: Instantaneous

You speak a word of power that can overwhelm the mind of one creature you can see within range, leaving it dumbfounded. If the target has 150 hit points or fewer, it is stunned. Otherwise, the spell has no effect. The stunned target must make a Constitution saving throw at the end of each of its turns. On a successful save, this stunning effect ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Power Word Stun')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Power Word Stun: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    hp = targ.Attribute('Hit Points').value
    name = targ.name
    if hp <= 150:
        set_condition(targ, 'Stunned', true)
        log('{{name}} is Stunned by Power Word Stun')
    else:
        log('{{name}} has {{hp}} HP; Power Word Stun has no effect')

