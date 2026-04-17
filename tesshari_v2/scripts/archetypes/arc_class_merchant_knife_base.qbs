on_add():
  Owner.Attribute('Class').set('Merchant Knife')
  path = text(Owner.Attribute('Merchant Knife Path').value)
  if path == '':
    setAttr('Merchant Knife Path', 'supply_cutter')
  Owner.setProperty('mk_intelligence_map', '')
  Owner.setProperty('mk_debt_map', '')
  announce('Merchant Knife initialized.')
  return
