on_add():
  Owner.Attribute('Class').set('Oni Hunter')
  setAttr('Quarry Marked', false)
  setAttr('Dissolution Resonance', 0)
  path = text(Owner.Attribute('Oni Hunter Path').value)
  if path == '':
    setAttr('Oni Hunter Path', 'dissolution_specialist')
  Owner.setProperty('current_quarry_id', '')
  announce('Oni Hunter initialized. Quarry mark cleared.')
  return
