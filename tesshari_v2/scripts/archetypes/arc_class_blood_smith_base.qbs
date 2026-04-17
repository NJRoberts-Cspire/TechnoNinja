on_add():
  Owner.Attribute('Class').set('Blood Smith')
  setAttr('Enhancement Status', 'stable')
  path = text(Owner.Attribute('Blood Smith Path').value)
  if path == '':
    setAttr('Blood Smith Path', 'the_weaponsmith')
  announce('Blood Smith initialized. Enhancement status: stable.')
  return
