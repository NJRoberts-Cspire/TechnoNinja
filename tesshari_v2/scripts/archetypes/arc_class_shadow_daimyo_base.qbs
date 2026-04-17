on_add():
  Owner.Attribute('Class').set('Shadow Daimyo')
  setAttr('Intelligence Gathered', 0)
  setAttr('Active Contacts', 0)
  path = text(Owner.Attribute('Shadow Daimyo Path').value)
  if path == '':
    setAttr('Shadow Daimyo Path', 'spymaster')
  Owner.setProperty('intelligence_map', '')
  announce('Shadow Daimyo initialized. Intelligence: 0. Contacts: 0.')
  return
