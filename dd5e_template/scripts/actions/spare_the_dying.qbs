/*
### Spare the Dying

_Necromancy cantrip_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Instantaneous

You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.
*/

on_activate():
    if !Scene:
        prompt('Spare the Dying: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    target = selectCharacter()
    targ_name = target.name
    log('{{targ_name}} is stabilized at 0 hit points and is no longer dying.')
    hp = target.Attribute('Hit Points').value
    if hp <= 0:
        target.Attribute('Hit Points').set(0)

