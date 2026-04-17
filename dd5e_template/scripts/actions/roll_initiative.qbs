on_activate():
    dex_mod = Owner.Attribute('Dexterity Modifier').value

    result = roll('1d20 + {{dex_mod}}')
    name = Owner.name
    log('{{name}} rolls Initiative: {{result}}')
