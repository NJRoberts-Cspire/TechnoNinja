on_add():
  Owner.Attribute('Class').set('Shell Dancer')
  setAttr('Cascade Count', 0)
  setAttr('In Shell Step', false)
  setAttr('Shell Step Turns Remaining', 0)
  path = text(Owner.Attribute('Shell Dancer Path').value)
  if path == '':
    setAttr('Shell Dancer Path', 'the_breaker')
  announce('Shell Dancer initialized. Cascade: 0. Shell Step: inactive.')
  return
