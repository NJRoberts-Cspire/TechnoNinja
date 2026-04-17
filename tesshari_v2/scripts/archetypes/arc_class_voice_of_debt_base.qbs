on_add():
  Owner.Attribute('Class').set('Voice of Debt')
  setAttr('Debt Detonations Used', 0)
  path = text(Owner.Attribute('Voice of Debt Path').value)
  if path == '':
    setAttr('Voice of Debt Path', 'oath_keeper')
  Owner.setProperty('debt_stacks_map', '')
  announce('Voice of Debt initialized. Detonation tracker cleared.')
  return
