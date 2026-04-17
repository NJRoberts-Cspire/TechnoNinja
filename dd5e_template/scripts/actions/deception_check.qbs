on_activate():
    cha_mod = Owner.Attribute('Charisma Modifier').value
    has_prof = Owner.Attribute('Deception Proficiency').value
    prof_bonus = Owner.Attribute('Proficiency Bonus').value

    bonus = cha_mod
    if has_prof:
        bonus = cha_mod + prof_bonus

    result = roll('1d20 + {{bonus}}')
    name = Owner.name
    log('{{name}} rolls Deception: {{result}}')
