/*
### Acid Arrow

_2nd-level evocation_

**Casting Time**: 1 action

**Range**: 90 feet

**Components**: V, S, M (powdered rhubarb leaf and an adder’s stomach)

**Duration**: Instantaneous

A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.
*/

on_activate():
    Owner.Attribute('Level 2 Spell Slots').add(1)
    slot_level = use_spell_slot(Owner, 2, 'Acid Arrow')
    if slot_level == -1:
        return

    extra_dice = max(0, slot_level - 2)
    initial_dice = 4 + extra_dice
    delayed_dice = 2 + extra_dice

    if !Scene:
        resolve_spell_attack_manually(Owner, '{{initial_dice}}d4')
        return

    targets = selectCharacters()

    for targ in targets:
        res = roll_spell_attack(Owner, targ)
        hit = res >= targ.Attribute('Armor Class').value

        if hit:
            initial_damage = roll_damage(Owner, '{{initial_dice}}d4', targ, 'Acid')
            delayed_damage = roll_damage(Owner, '{{delayed_dice}}d4', targ, 'Acid')
            name = targ.name
            log('Acid Arrow hits {{name}} for {{initial_damage}} acid damage immediately and {{delayed_damage}} at end of next turn')
            apply_damage(targ, initial_damage)
            apply_delayed_damage_end(targ, delayed_damage, 1, 'Acid Arrow')
        else:
            initial_damage = roll_damage(Owner, '{{initial_dice}}d4', targ, 'Acid')
            miss_damage = floor(initial_damage / 2)
            name = targ.name
            log('Acid Arrow splashes {{name}} for {{miss_damage}} acid damage')
            apply_damage(targ, miss_damage)

