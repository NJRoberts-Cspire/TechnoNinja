on_add():
  Owner.Attribute('Class').set('Pulse Caller')
  setAttr('Integrated Weapon Active', true)
  setAttr('Preconscious Fire Active', false)
  path = text(Owner.Attribute('Pulse Caller Path').value)
  if path == '':
    setAttr('Pulse Caller Path', 'single_point')
  announce('Pulse Caller initialized. Integrated weapon active.')
  return
