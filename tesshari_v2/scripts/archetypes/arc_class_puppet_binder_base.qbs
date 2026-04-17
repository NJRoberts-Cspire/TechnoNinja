on_add():
  Owner.Attribute('Class').set('Puppet Binder')
  setAttr('Vessel Active', false)
  setAttr('Binding Threads', 0)
  path = text(Owner.Attribute('Puppet Binder Path').value)
  if path == '':
    setAttr('Puppet Binder Path', 'the_architect')
  Owner.setProperty('bound_target_ids', '')
  announce('Puppet Binder initialized. No active binds.')
  return
