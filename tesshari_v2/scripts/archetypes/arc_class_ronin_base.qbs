on_add():
  Owner.Attribute('Class').set('Ronin')
  setAttr('Corrupted Resonance Signature', true)
  setAttr('Oath Status', 'Masterless')
  setAttr('Contract Target', '')
  path = text(Owner.Attribute('Ronin Path').value)
  if path == '':
    setAttr('Ronin Path', 'ascendant_blade')
  announce('Ronin initialized. Corrupted resonance signature active. Oath: Masterless.')
  return
