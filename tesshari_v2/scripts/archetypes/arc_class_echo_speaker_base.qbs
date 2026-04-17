on_add():
  Owner.Attribute('Class').set('Echo Speaker')
  setAttr('Afterlife Affinity', true)
  setAttr('Grief Stacks', 0)
  path = text(Owner.Attribute('Echo Speaker Path').value)
  if path == '':
    setAttr('Echo Speaker Path', 'sutensai_aligned')
  announce('Echo Speaker initialized. Afterlife affinity active. Grief stacks: 0.')
  return
