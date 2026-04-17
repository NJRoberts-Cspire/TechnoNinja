on_add():
  Owner.Attribute('Class').set('Void Walker')
  setAttr('Incorporeal State Active', false)
  setAttr('Anchor Points', 0)
  path = text(Owner.Attribute('Void Walker Path').value)
  if path == '':
    setAttr('Void Walker Path', 'ghost_operative')
  announce('Void Walker initialized. Incorporeal state inactive.')
  return
