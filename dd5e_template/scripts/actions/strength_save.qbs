on_activate():
    str_mod = Owner.Attribute('Strength Modifier').value
    has_prof = Owner.Attribute('Strength Save Proficiency').value
    prof_bonus = Owner.Attribute('Proficiency Bonus').value

    bonus = str_mod
    if has_prof:
        bonus = str_mod + prof_bonus

    result = roll('1d20 + {{bonus}}')
    name = Owner.name
    log('{{name}} rolls Strength Save: {{result}}')
