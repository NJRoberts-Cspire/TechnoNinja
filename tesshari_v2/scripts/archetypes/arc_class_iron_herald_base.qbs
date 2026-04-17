on_add():
  Owner.Attribute('Class').set('Iron Herald')
  setAttr('Command Zone Active', false)
  setAttr('Priority Target ID', '')
  setAttr('Command Zone Radius', 15)
  path = text(Owner.Attribute('Iron Herald Path').value)
  if path == '':
    setAttr('Iron Herald Path', 'warbanner')
  announce('Iron Herald initialized. Command Zone inactive.')
  return
