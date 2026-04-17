on_add():
  Owner.Attribute('Class').set('Curse Eater')
  setAttr('Loaded Count', 0)
  setAttr('Corruption Points', 0)
  path = text(Owner.Attribute('Curse Eater Path').value)
  if path == '':
    setAttr('Curse Eater Path', 'purifier')
  announce('Curse Eater initialized. Loaded: 0. Corruption: 0.')
  return
