on_add():
  Owner.Attribute('Class').set('Iron Monk')
  setAttr('Between State Active', false)
  setAttr('Below Half HP Bonus Active', false)
  path = text(Owner.Attribute('Iron Monk Path').value)
  if path == '':
    setAttr('Iron Monk Path', 'orthodoxy')
  announce('Iron Monk initialized. Hand size 5 (smallest in system).')
  return
