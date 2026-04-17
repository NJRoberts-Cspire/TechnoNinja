on_add():
  setAttr('Species', 'Wireborn')
  setAttr('Ambient Wire Sense', true)
  setAttr('Signal Vulnerability', true)
  setAttr('Digital Navigation', true)
  setAttr('Circuit Trace Pattern', 'luminous_blue_amber')
  Owner.setProperty('race_tag', 'wireborn')
  announce('Wireborn race initialized. Signal Vulnerability active: Silence effects last 1 extra turn.')
  return
