/*
### Haste

_3rd-level transmutation_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (a shaving of licorice root)

**Duration**: Concentration, up to 1 minute

Choose a willing creature that you can see within range. Until the spell ends, the target’s speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action. When the spell ends, the target can’t move or take actions until after its next turn, as a wave of lethargy sweeps over it.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Haste')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Haste')
    if !Scene:
        prompt('Haste: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} is under the effect of Haste: speed doubled, +2 AC, advantage on Dexterity saves, and gains one additional action per turn')

