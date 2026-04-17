/*
### True Strike

_Divination cantrip_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: S

**Duration**: Concentration, up to 1 round

You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target’s defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn’t ended.
*/

on_activate():
    set_concentration(Owner, 'True Strike')
    if !Scene:
        prompt('True Strike: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    target = selectCharacter()
    targ_name = target.name
    name = Owner.name
    Owner.setProperty('advantage_on_character', targ_name)
    log('{{name}} gains insight into {{targ_name}}\'s defenses. {{name}} has advantage on their next attack roll against {{targ_name}}.')

