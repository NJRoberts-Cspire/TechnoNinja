/*
### Regenerate

_7th-level transmutation_

**Casting Time**: 1 minute

**Range**: Touch

**Components**: V, S, M (a prayer wheel and holy water)

**Duration**: 1 hour

You touch a creature and stimulate its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points each minute). The target’s severed body members (fingers, legs, tails, and so on), if any, are restored after 2 minutes. If you have the severed part and hold it to the stump, the spell instantaneously causes the limb to knit to the stump.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 7, 'Regenerate')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Regenerate: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    amount = roll_damage(Owner, '4d8') + 15
    heal_hp(targ, amount)
    name = targ.name
    log('{{name}} regains {{amount}} HP and regenerates 1 HP per round for 1 minute')

