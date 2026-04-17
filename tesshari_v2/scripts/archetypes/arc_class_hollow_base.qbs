on_add():
  Owner.Attribute('Class').set('The Hollow')
  path = text(Owner.Attribute('Hollow Path').value)
  if path == '' || path == 'none':
    setAttr('Hollow Path', 'the_empty')
  setAttr('Current HP Percent', 100)
  announce('The Hollow initialized. Path: ' + text(Owner.Attribute('Hollow Path').value))
  return
