/*
You know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack roll if you have Advantage on the roll and the attack uses a Finesse or a Ranged weapon. The extra damage's type is the same as the weapon's type.

You don't need Advantage on the attack roll if at least one of your allies is within 5 feet of the target, the ally doesn't have the Incapacitated condition, and you don't have Disadvantage on the attack roll.

The extra damage increases as you gain Rogue levels, as shown in the Sneak Attack column of the Rogue Features table. 
*/

on_activate():
    level = get_level(Owner)
    sneak_dice = floor((level + 1) / 2)
    damage = roll_damage(Owner, '{{sneak_dice}}d6')

    results = attack(Owner, 'Dexterity', false)
    hits = results[0]
    name = Owner.name

    for targ in hits:
        targ_name = targ.name
        apply_damage(targ, damage)
        log('{{name}} lands a Sneak Attack on {{targ_name}} for {{damage}} damage.')
