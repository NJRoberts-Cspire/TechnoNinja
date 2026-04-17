on_activate():
    int_mod = Owner.Attribute('Intelligence Modifier').value

    result = roll('1d20 + {{int_mod}}')
    name = Owner.name
    log('{{name}} rolls Intelligence Check: {{result}}')
