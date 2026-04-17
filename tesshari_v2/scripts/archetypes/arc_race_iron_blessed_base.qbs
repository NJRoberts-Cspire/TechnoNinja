on_add():
  setAttr('Species', 'Iron Blessed')
  setAttr('Resonant Attunement', true)
  setAttr('Sutensai Attention', true)
  setAttr('Unexpected Enhancement Integration', true)
  setAttr('Formation Locations', 'player_defined')
  setAttr('Formation Luminescence', true)
  setAttr('Formation Pain Level', 'chronic_low')
  setAttr('Spine-Speak Competency', true)
  setAttr('Formation Pain Acute', false)
  subtype = text(Owner.Attribute('Subtype').value)
  if subtype == 'unregistered':
    setAttr('Orthodoxy Handler Status', 'no_handler')
    setAttr('Iron Blessed Hand Size Modifier', -1)
    announce('Iron Blessed (Unregistered) initialized. Hand size -1. No orthodoxy handler.')
  else:
    setAttr('Subtype', 'tended')
    setAttr('Orthodoxy Handler Status', 'has_handler')
    setAttr('Iron Blessed Hand Size Modifier', 1)
    announce('Iron Blessed (Tended) initialized. Hand size +1. Orthodoxy handler assigned.')
  Owner.setProperty('race_tag', 'iron_blessed')
  return
