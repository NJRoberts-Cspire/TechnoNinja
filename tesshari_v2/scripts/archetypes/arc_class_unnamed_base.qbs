on_add():
  Owner.Attribute('Class').set('The Unnamed')
  setAttr('Active Stat', 'IRON')
  path = text(Owner.Attribute('Unnamed Path').value)
  if path == '' || path == 'none':
    setAttr('Unnamed Path', 'convergent')
  Owner.setProperty('named_cards_map', '')
  announce('The Unnamed initialized. Cards unlock through personal conditions. Define yourself.')
  return
