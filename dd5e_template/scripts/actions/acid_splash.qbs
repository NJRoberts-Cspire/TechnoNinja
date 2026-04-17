/*
### Acid Splash

_Conjuration cantrip_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Instantaneous

You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage. This spell’s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).
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
        save_fails = resolve_spell_save_manually(Owner, 'Dexterity')
        if !save_fails:
            log('Acid Splash misses')
            return
        damage = roll_damage(Owner, '{{dice}}d6')
        prompt('Acid Splash hits for {{damage}} acid damage', ['Ok'])
        log('Acid Splash hits for {{damage}} acid damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{dice}}d6', targ, 'Acid')
        name = targ.name
        log('Acid Splash hits {{name}} for {{damage}} acid damage.')
        apply_damage(targ, damage)

    
