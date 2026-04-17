/*
### Arcane Sword

_7th-level evocation_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (a miniature platinum sword with a grip and pommel of copper and zinc, worth 250 gp)

**Duration**: Concentration, up to 1 minute

You create a sword-shaped plane of force that hovers within range. It lasts for the duration. When the sword appears, you make a melee spell attack against a target of your choice within 5 feet of the sword. On a hit, the target takes 3d10 force damage. Until the spell ends, you can use a bonus action on each of your turns to move the sword up to 20 feet to a spot you can see and repeat this attack against the same target or a different one.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 7, 'Arcane Sword')
    if slot_level == -1:
        return

    set_concentration(Owner, 'Arcane Sword')

    if !Scene:
        resolve_spell_attack_manually(Owner, '3d10')
        log('Arcane Sword attacks each turn as a bonus action while concentration is maintained')
        return

    targets = selectCharacters()

    for targ in targets:
        res = roll_spell_attack(Owner, targ)
        hit = res >= targ.Attribute('Armor Class').value

        if hit:
            damage = roll_damage(Owner, '3d10', targ, 'Force')
            name = targ.name
            log('Arcane Sword hits {{name}} for {{damage}} force damage')
            apply_damage(targ, damage)
        else:
            name = targ.name
            log('Arcane Sword misses {{name}}')

    log('Arcane Sword can attack for 3d10 force damage each turn as a bonus action while concentration is maintained')

