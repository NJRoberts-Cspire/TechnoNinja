/*
Make a Dexterity (Stealth) check in an attempt to hide.
*/

on_activate():
    dex_mod = Owner.Attribute('Dexterity Modifier').value
    has_prof = Owner.Attribute('Stealth Proficiency').value
    prof_bonus = Owner.Attribute('Proficiency Bonus').value

    bonus = dex_mod
    if has_prof:
        bonus = dex_mod + prof_bonus

    result = roll('1d20 + {{bonus}}')
    name = Owner.name
    log('{{name}} attempts to Hide — Stealth: {{result}}')
