on_add():
  Owner.Attribute('Class').set('Fracture Knight')
  setAttr('Phantom Charges', 2)
  setAttr('Fracture Stacks on Self', 0)
  path = text(Owner.Attribute('Fracture Knight Path').value)
  if path == '':
    setAttr('Fracture Knight Path', 'the_claimed')
  Owner.setProperty('fracture_target_map', '')
  announce('Fracture Knight initialized. Phantom Charges: 2.')
  return
