on_add():
  Owner.Attribute('Class').set('Wireweave')
  path = text(Owner.Attribute('Wireweave Path').value)
  if path == '':
    setAttr('Wireweave Path', 'combat_weave')
  announce('Wireweave initialized.')
  return
