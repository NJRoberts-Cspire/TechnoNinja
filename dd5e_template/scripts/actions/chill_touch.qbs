/*
### Chill Touch

_Necromancy cantrip_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: 1 round

You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can’t regain hit points until the start of your next turn. Until then, the hand clings to the target. If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn. This spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
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

    targets = selectCharacters()

    for targ in targets:
        res = roll_spell_attack(Owner, targ)
        hit = res >= targ.Attribute('Armor Class').value

        if hit:
            damage = roll_damage(Owner, '{{dice}}d8', targ, 'Necrotic')
            name = targ.name
            log('Chill Touch hits {{name}} for {{damage}} necrotic damage. {{name}} cannot regain hit points until the start of your next turn.')
            targ.setProperty('healing_blocked', true)
            apply_damage(targ, damage)
            Owner.atStartOfNextTurn():
                log('{{name}} is no longer Bone Chilled')
                targ.setProperty('healing_blocked', false)

