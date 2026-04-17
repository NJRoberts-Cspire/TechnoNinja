/*
### Produce Flame

_Conjuration cantrip_

**Casting Time**: 1 action

**Range**: Self

**Components**: V, S

**Duration**: 10 minutes

A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again. You can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage. This spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
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
        damage = roll_damage(Owner, '{{dice}}d8', targ, 'Fire')
        name = targ.name
        log('Produce Flame hits {{name}} for {{damage}} fire damage.')
        apply_damage(targ, damage)

