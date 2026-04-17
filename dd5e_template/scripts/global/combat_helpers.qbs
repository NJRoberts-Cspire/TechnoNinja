use_spell_slot(caster, min_level, spell_name):
    available_levels = []
    for i in 10 - min_level:
        level = i + min_level
        slots = caster.Attribute('Level {{level}} Spell Slots').value
        if slots > 0:
            available_levels.push(text(level))

    if available_levels.count() == 0:
        announce("No spell slots available to cast {{spell_name}}.")
        return -1

    slot_level = number(prompt('Cast {{spell_name}} at what level?', available_levels))
    caster.Attribute('Level {{slot_level}} Spell Slots').subtract(1)
    return slot_level

/* DAMAGE AND HEATH =======================*/
roll_damage(character, roll, target, damage_type):
    name = character.name
    res = character.roll(roll)

    if (!target || !damage_type):
        return res

    targetImmunity = false //target.Attribute('{{damage_type}} Immunity').value
    targetVulnerability = false //target.Attribute('{{damage_type}} Vulnerability').value
    targetResistance = false //target.Attribute('{{damage_type}} Resistance').value
    targetName = target.name

    if targetImmunity:
        res = 0
        log('{{targetName}} is immune to {{damage_type}} damage')
    else if targetVulnerability:
        res *= 2
        log('{{targetName}} is vulnerable to {{damage_type}} damage')
    else if targetResistance:
        res /= 2
        log('{{targetName}} is resistant to {{damage_type}} damage')

    return res


apply_damage(character, damage):
    character.Attribute('Hit Points').subtract(damage)

heal_hp(character, amount):
    character.Attribute('Hit Points').add(amount)

// ==================================================================

apply_delayed_damage_start(character, damage, in_turns, source):
    character.atStartOfTurn(in_turns):
        name = character.name
        character.Attribute('Hit Points').subtract(damage)
        log('{{name}} takes {{damage}} points of damage from {{source}}')

apply_delayed_damage_end(character, damage, in_turns, source):
    character.atEndOfTurn(in_turns):
        name = character.name
        character.Attribute('Hit Points').subtract(damage)
        log('{{name}} takes {{damage}} points of damage from {{source}}')

saving_throw(caster, targets, ability):
    dc = caster.Attribute('Spell Save DC').value
    successes = []
    failures = []

    for targ in targets:
        mod = targ.Attribute('{{ability}} Modifier').value
        has_prof = targ.Attribute('{{ability}} Save Proficiency').value
        prof_bonus = targ.Attribute('Proficiency Bonus').value
        bonus = mod
        if has_prof:
            bonus = mod + prof_bonus
        name = targ.name
        res = targ.roll('1d20 + {{bonus}}')
        baned = targ.Attribute('Baned').value
        if baned:
            res -= targ.roll('1d4')
            log('{{name}} is Baned and suffers -1d4 to saving throw')
        announce('{{name}} rolls {{ability}} saving throw')

        if res >= dc:
            log('{{name}} succeeds on {{ability}} saving throw ({{res}} vs DC {{dc}})')
            successes.push(targ)
        else:
            log('{{name}} fails {{ability}} saving throw ({{res}} vs DC {{dc}})')
            failures.push(targ)

    return [successes, failures]

break_concentration(caster):
    current = caster.Attribute('Concentration').value
    if current:
        name = caster.name
        log('{{name}} breaks concentration on {{current}}')
        caster.Attribute('Concentration').set('')

set_concentration(caster, spell_name):
    break_concentration(caster)
    caster.Attribute('Concentration').set(spell_name)
    name = caster.name
    log('{{name}} is now concentrating on {{spell_name}}')

resolve_spell_attack_manually(caster, damage_roll):
    name = caster.name
    res = roll_spell_attack(caster)
    log('{{name}} rolled a {{res}}')
    ans = prompt('{{name}} rolled a spell attack of {{res}}. Hit?', ['Yes', 'No'])
    if ans == 'No':
        return

    if damage_roll:
        dmg = roll_damage(caster, damage_roll)
        log('{{name}} rolled {{dmg}} damage')
        prompt('Rolled {{dmg}} damage', ['Ok'])

// Returns true if target fails
resolve_spell_save_manually(caster, ability):
    name = caster.name
    dc = caster.Attribute('Spell Save DC').value
    save = promptInput("Enter your target's {{ability}} saving throw")
    return number(save) < number(dc)

resolve_attack_manually(attacker):
    name = attacker.name
    res = roll_attack(attacker)
    ac = promptInput("Enter your target's Armor Class")
    return number(ac) < number(res)

roll_d20(character, extra_dice):
    if extra_dice:
        return character.roll('1d20, {{extra_dice}}')
    return character.roll('1d20')

roll_d20_with_advantage(character, extra_dice):
    res = max(character.rollSplit('2d20'))
    if extra_dice:
        res += character.roll(extra_dice)
    return res

roll_d20_with_disadvantage(character, extra_dice):
    res = min(character.rollSplit('2d20'))
    if extra_dice:
        res += character.roll(extra_dice)
    return res

add_extra_damage_dice(character, extra_dice):
    dice = character.getProperty(PROPERTY_EXTRA_DAMAGE_DICE)
    if !dice:
        dice = []
    dice.push(extra_dice)
    character.setProperty(PROPERTY_EXTRA_DAMAGE_DICE, dice)

add_extra_ability_dice(character, extra_dice):
    dice = character.getProperty(PROPERTY_EXTRA_ABILITY_DICE)
    if !dice:
        dice = []
    dice.push(extra_dice)
    character.setProperty(PROPERTY_EXTRA_ABILITY_DICE, dice)

add_advantage(character, source, applies_to, uses):
    dice = character.getProperty(PROPERTY_ADVANTAGES)
    if !dice:
        dice = []
    dice.push({ source: source, applies_to: applies_to, uses: uses || -1 })
    character.setProperty(PROPERTY_ADVANTAGES, dice)

add_disadvantage(character, source, applies_to, uses):
    dice = character.getProperty(PROPERTY_DISADVANTAGES)
    if !dice:
        dice = []
    dice.push({ source: source, applies_to: applies_to, uses: uses || -1 })
    character.setProperty(PROPERTY_DISADVANTAGES, dice)

remove_extra_damage_dice(character, applies_to):
    dice = character.getProperty(PROPERTY_EXTRA_DAMAGE_DICE)
    if !dice || !dice.length:
        return
    filter_fn(d):
        return d.applies_to != applies_to
    dice = dice.filter(filter_fn)
    character.setProperty(PROPERTY_EXTRA_DAMAGE_DICE, dice)

remove_extra_ability_dice(character, applies_to):
    dice = character.getProperty(PROPERTY_EXTRA_ABILITY_DICE)
    if !dice || !dice.length:
        return
    filter_fn(d):
        return d.applies_to != applies_to
    dice = dice.filter(filter_fn)
    character.setProperty(PROPERTY_EXTRA_ABILITY_DICE, dice)

find_advantage_on_target(character, target, ability):
    advantages = character.getProperty(PROPERTY_ADVANTAGES)
    if !advantages:
        advantages = []

    matched = []
    for adv in advantages:
        applies_to = adv.applies_to
        if applies_to == '' || applies_to == target.name || (!ability || applies_to == ability):
            matched.push(adv)

    if matched.count() == 0:
        return false

    updated = []
    for adv in advantages:
        if matched.contains(adv):
            if adv.uses != -1:
                adv.uses -= 1
            if adv.uses != 0:
                updated.push(adv)
        else:
            updated.push(adv)
    character.setProperty(PROPERTY_ADVANTAGES, updated)
    return true

find_disadvantage_on_target(character, target, ability):
    disadvantages = character.getProperty(PROPERTY_DISADVANTAGES)
    if !disadvantages:
        disadvantages = []
        
    matched = []
    for dis in disadvantages:
        applies_to = dis.applies_to
        if applies_to == '' || applies_to == target.name || (!ability || applies_to == ability):
            matched.push(dis)

    if matched.count() == 0:
        return false

    updated = []
    for dis in disadvantages:
        if matched.contains(dis):
            if dis.uses != -1:
                dis.uses -= 1
            if dis.uses != 0:
                updated.push(dis)
        else:
            updated.push(dis)
    character.setProperty(PROPERTY_DISADVANTAGES, updated)
    return true

find_extra_attack_dice_on_target(character, target):
    extra_attack_dice = character.getProperty(PROPERTY_EXTRA_ATTACK_DICE)
    if !extra_attack_dice:
        extra_attack_dice = []

    blessed = character.Attribute('Blessed').value
    if blessed:
        extra_attack_dice.push({dice: '1d4', source: 'Blessed', uses: -1})
        
    matched = []
    for dice in extra_attack_dice:
        applies_to = dice.applies_to
        if applies_to == '' || applies_to == target.name:
            matched.push(dice)

    if matched.count() == 0:
        return ''

    updated = []
    for dice in extra_attack_dice:
        if matched.contains(dice):
            if dice.uses != -1:
                dice.uses -= 1
            if dice.uses != 0:
                updated.push(dice)
        else:
            updated.push(dice)
    character.setProperty(PROPERTY_EXTRA_ATTACK_DICE, updated)

    parts = []
    for dice in matched:
        parts.push(dice.dice)
    return parts.join(',')

find_extra_ability_dice_on_target(character, ability, target):
    extra_ability_dice = character.getProperty(PROPERTY_EXTRA_ABILITY_DICE)
    if !extra_ability_dice:
        extra_ability_dice = []
        
    matched = []
    for dice in extra_ability_dice:
        applies_to = dice.applies_to
        if applies_to == '' || applies_to == target.name || applies_to == ability:
            matched.push(dice)

    if matched.count() == 0:
        return ''

    updated = []
    for dice in extra_ability_dice:
        if matched.contains(dice):
            if dice.uses != -1:
                dice.uses -= 1
            if dice.uses != 0:
                updated.push(dice)
        else:
            updated.push(dice)
    character.setProperty(PROPERTY_EXTRA_ABILITY_DICE, updated)

    parts = []
    for dice in matched:
        parts.push(dice.dice)
    return parts.join(',')


roll_attack(character, target):
    has_advantage = find_advantage_on_target(character, target)
    has_disadvantage = find_disadvantage_on_target(character, target)
    extra_dice = find_extra_attack_dice_on_target(character, target)

    roll_with_baned(roll):
        baned = character.Attribute('Baned').value
        if baned:
            name = character.name
            log('{{name}} is Baned. Subtracting 1d4 from attack roll.')
            roll -= roll('1d4')
            return roll
        else:
            return roll

    if has_advantage:
        return roll_with_baned(roll_d20_with_advantage(character, extra_dice))
    else if has_disadvantage:
        return roll_with_baned(roll_d20_with_disadvantage(character, extra_dice))
    else:
        return roll_with_baned(roll_d20(character, extra_dice))

roll_spell_attack(caster, target):
    spell_mod = caster.Attribute('Spell Attack Modifier').value
    prof_bonus = caster.Attribute('Proficiency Bonus').value
    caster_name = caster.name

    has_advantage = find_advantage_on_target(caster, target)
    has_disadvantage = find_disadvantage_on_target(caster, target)
    extra_dice = find_extra_attack_dice_on_target(caster, target)

    if has_advantage:
        return roll_d20_with_advantage(caster, extra_dice) + spell_mod + prof_bonus
    else if has_disadvantage:
        return roll_d20_with_disadvantage(caster, extra_dice) + spell_mod + prof_bonus
    else:
        return roll_d20(caster, extra_dice) + spell_mod + prof_bonus

roll_ability(character, ability, target):
    has_advantage = find_advantage_on_target(character, target)
    has_disadvantage = find_disadvantage_on_target(character, target)
    extra_dice = find_extra_ability_dice_on_target(character, ability, target)

    if has_advantage:
        return roll_d20_with_advantage(character, extra_dice)
    else if has_disadvantage:
        return roll_d20_with_disadvantage(character, extra_dice)
    else:
        return roll_d20(character, extra_dice)

get_level(character):
    return character.Attribute('Level').value

set_condition(character, attribute, value):
    character.Attribute(attribute).set(value)