on_activate():
    wis_mod = Owner.Attribute('Wisdom Modifier').value

    result = roll('1d20 + {{wis_mod}}')
    name = Owner.name
    log('{{name}} rolls Wisdom Check: {{result}}')
