on_activate():
    con_mod = Owner.Attribute('Constitution Modifier').value

    result = roll('1d20 + {{con_mod}}')
    name = Owner.name
    log('{{name}} rolls Constitution Check: {{result}}')
