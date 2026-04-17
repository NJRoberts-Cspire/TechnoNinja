/*
1d20 + {{Wisdom Modifier}}
*/

on_activate():
    wis_mod = Owner.Attribute('Wisdom Modifier').value
    has_prof = Owner.Attribute('Animal Handling Proficiency').value
    prof_bonus = Owner.Attribute('Proficiency Bonus').value

    bonus = wis_mod
    if has_prof:
        bonus = wis_mod + prof_bonus

    result = roll('1d20 + {{bonus}}')
    name = Owner.name
    log('{{name}} rolls Animal Handling: {{result}}')

    
