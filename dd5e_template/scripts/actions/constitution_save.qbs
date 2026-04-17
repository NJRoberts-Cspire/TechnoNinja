on_activate():
    con_mod = Owner.Attribute('Constitution Modifier').value
    has_prof = Owner.Attribute('Constitution Save Proficiency').value
    prof_bonus = Owner.Attribute('Proficiency Bonus').value

    bonus = con_mod
    if has_prof:
        bonus = con_mod + prof_bonus

    result = roll('1d20 + {{bonus}}')
    name = Owner.name
    log('{{name}} rolls Constitution Save: {{result}}')
