/*
### Holy Aura

_8th-level abjuration_

**Casting Time**: 1 action

**Range**: Self

**Components**: V, S, M (a tiny reliquary worth at least 1,000 gp containing a sacred relic, such as a scrap of cloth from a saint’s robe or a piece of parchment from a religious text)

**Duration**: Concentration, up to 1 minute

Divine light washes out from you and coalesces in a soft radiance in a 30-foot radius around you. Creatures of your choice in that radius when you cast this spell shed dim light in a 5-foot radius and have advantage on all saving throws, and other creatures have disadvantage on attack rolls against them until the spell ends. In addition, when a fiend or an undead hits an affected creature with a melee attack, the aura flashes with brilliant light. The attacker must succeed on a Constitution saving throw or be blinded until the spell ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Holy Aura')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Holy Aura')
    if !Scene:
        prompt('Holy Aura: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targets = selectCharacters()
    name = Owner.name
    log('{{name}} casts Holy Aura; targets have advantage on saves, attackers have disadvantage, undead attackers blinded on failed Constitution save')

