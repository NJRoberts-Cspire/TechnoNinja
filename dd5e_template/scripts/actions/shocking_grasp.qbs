/*
### Shocking Grasp

_Evocation cantrip_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Instantaneous

Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can’t take reactions until the start of its next turn. The spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
*/

on_activate():
    level = get_level(Owner)
    dice = 1
    if level >= 17:
        dice = 4
    else if level >= 11:
        dice = 3
    else if level >= 5:
        dice = 2

    if !Scene:
        resolve_spell_attack_manually(Owner, '{{dice}}d8')
        return

    results = spell_attack(Owner, false)
    hits = results[0]

    for targ in hits:
        damage = roll_damage(Owner, '{{dice}}d8', targ, 'Lightning')
        name = targ.name
        log('Shocking Grasp hits {{name}} for {{damage}} lightning damage. {{name}} can\'t take reactions until the start of its next turn.')
        targ.Attribute('Unreactive').set(true)
        targ.atStartOfNextTurn():
            targ.Attribute('Unreactive').set(false)
        apply_damage(targ, damage)

