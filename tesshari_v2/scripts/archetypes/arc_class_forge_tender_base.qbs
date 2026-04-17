on_add():
  Owner.Attribute('Class').set('Forge Tender')
  setAttr('Resonance Keepers Aligned', false)
  setAttr('Community Dependent', true)
  path = text(Owner.Attribute('Forge Tender Path').value)
  if path == '':
    setAttr('Forge Tender Path', 'resonance_keeper')
  Owner.setProperty('forge_mend_uses_short', '2')
  announce('Forge Tender initialized. Community Dependent active.')
  return
