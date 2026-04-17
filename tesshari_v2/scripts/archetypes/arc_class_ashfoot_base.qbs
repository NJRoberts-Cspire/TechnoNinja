on_add():
  Owner.Attribute('Class').set('Ashfoot')
  setAttr('Ashfoot Caste Tier', 'Low')
  setAttr('Enhancement Quality', 'salvage')
  path = text(Owner.Attribute('Ashfoot Path').value)
  if path == '':
    setAttr('Ashfoot Path', 'skirmish_specialist')
  announce('Ashfoot initialized. Caste: Low. Enhancement quality: salvage.')
  return
