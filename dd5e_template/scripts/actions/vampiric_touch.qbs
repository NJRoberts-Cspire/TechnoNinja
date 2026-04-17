/*
### Vampiric Touch

_3rd-level necromancy_

**Casting Time**: 1 action

**Range**: Self

**Components**: V, S

**Duration**: Concentration, up to 1 minute

The touch of your shadow-wreathed hand can siphon life force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt. Until the spell ends, you can make the attack again on each of your turns as an action. 

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Vampiric Touch')
    if slot_level == -1:
        return
    extra_dice = slot_level - 3
    total_dice = 3 + extra_dice
    set_concentration(Owner, 'Vampiric Touch')
    if !Scene:
        resolve_spell_attack_manually(Owner, '{{total_dice}}d6')
        return

    results = spell_attack(Owner, false)
    hits = results[0]
    for targ in hits:
        damage = roll_damage(Owner, '{{total_dice}}d6', targ, 'Necrotic')
        heal_amount = floor(damage / 2)
        name = targ.name
        log('Vampiric Touch hits {{name}} for {{damage}} necrotic damage; Owner heals {{heal_amount}} hit points')
        apply_damage(targ, damage)
        heal_hp(Owner, heal_amount)

