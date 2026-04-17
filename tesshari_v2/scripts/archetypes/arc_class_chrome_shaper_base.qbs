on_add():
  Owner.Attribute('Class').set('Chrome Shaper')
  setAttr('Experimental Designs', 0)
  path = text(Owner.Attribute('Chrome Shaper Path').value)
  if path == '':
    setAttr('Chrome Shaper Path', 'war_shaper')
  Owner.setProperty('active_config', 'none')
  Owner.setProperty('active_config_stat_key', '')
  Owner.setProperty('active_config_bonus', '0')
  announce('Chrome Shaper initialized. No configuration active.')
  return
