on_activate():
    int_mod = Owner.Attribute('Intelligence Modifier').value
    has_prof = Owner.Attribute('Nature Proficiency').value
    prof_bonus = Owner.Attribute('Proficiency Bonus').value

    bonus = int_mod
    if has_prof:
        bonus = int_mod + prof_bonus

    result = roll('1d20 + {{bonus}}')
    name = Owner.name
    log('{{name}} rolls Nature: {{result}}')
