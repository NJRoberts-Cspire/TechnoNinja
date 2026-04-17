on_add():
  Owner.Attribute('Class').set('Veilblade')
  setAttr('Resonant Signature State', 'suppressed')
  setAttr('Wire Integration Active', true)
  path = text(Owner.Attribute('Veilblade Path').value)
  if path == '':
    setAttr('Veilblade Path', 'shadow_operative')
  announce('Veilblade initialized. Resonance signature suppressed. Wire integration active.')
  return
