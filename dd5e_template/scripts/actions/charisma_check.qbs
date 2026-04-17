on_activate():
    cha_mod = Owner.Attribute('Charisma Modifier').value

    result = roll('1d20 + {{cha_mod}}')
    name = Owner.name
    log('{{name}} rolls Charisma Check: {{result}}')
