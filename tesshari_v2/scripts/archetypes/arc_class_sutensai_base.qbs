on_add():
  Owner.Attribute('Class').set('Sutensai')
  setAttr('Reader Authority', true)
  setAttr('Echomind Reading Level', 1)
  setAttr('HP Cost Payment Enabled', true)
  path = text(Owner.Attribute('Sutensai Path').value)
  if path == '':
    setAttr('Sutensai Path', 'inquisitor')
  announce('Sutensai initialized. Reader authority active. HP cost cards enabled.')
  return
