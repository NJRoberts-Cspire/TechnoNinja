/*
### Vicious Mockery

_Enchantment cantrip_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V 189

**Duration**: Instantaneous

You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn. This spell's damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).
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
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Vicious Mockery Wisdom save')
        else:
            log('Target succeeds Vicious Mockery Wisdom save')
        return

    target = selectCharacter()
    targets = [target]
    results = saving_throw(Owner, targets, 'Wisdom')
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{dice}}d4', targ, 'Psychic')
        name = targ.name
        log('Vicious Mockery wounds {{name}}\'s ego for {{damage}} psychic damage. {{name}} has disadvantage on their next attack roll.')
        targ.setProperty('disadvantage_on_next_attack', true)
        targ.atEndOfNextTurn():
            targ.setProperty('disadvantage_on_next_attack', false)
        apply_damage(targ, damage)
