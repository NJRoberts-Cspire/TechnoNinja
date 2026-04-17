on_add():
  Owner.Attribute('Class').set('Flesh Shaper')
  setAttr('Flesh Shaper HP Tier', 'full')
  path = text(Owner.Attribute('Flesh Shaper Path').value)
  if path == '':
    setAttr('Flesh Shaper Path', 'the_mender')
  announce('Flesh Shaper initialized. HP tier tracking active.')
  return
