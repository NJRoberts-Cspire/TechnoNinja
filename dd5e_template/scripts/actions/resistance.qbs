/*
### Resistance

_Abjuration cantrip_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a miniature cloak)

**Duration**: Concentration, up to 1 minute

You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends.
*/

on_activate():
    set_concentration(Owner, 'Resistance')
    if !Scene:
        prompt('Resistance: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    target = selectCharacter()
    targ_name = target.name
    log('{{targ_name}} may add 1d4 to one saving throw before Resistance ends.')

