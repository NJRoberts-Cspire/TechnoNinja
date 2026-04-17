on_activate():
    str_mod = Owner.Attribute('Strength Modifier').value

    result = roll('1d20 + {{str_mod}}')
    name = Owner.name
    log('{{name}} rolls Strength Check: {{result}}')
