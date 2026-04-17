/*
### Revivify

_3rd-level necromancy_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (diamonds worth 300 gp, which the spell consumes)

**Duration**: Instantaneous

You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can’t return to life a creature that has died of old age, nor can it restore any missing body parts.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Revivify')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Revivify: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    heal_hp(targ, 1)
    name = targ.name
    targ.Attribute('Hit Points').set(1)
    log('{{name}} returns to life with 1 hit point')

