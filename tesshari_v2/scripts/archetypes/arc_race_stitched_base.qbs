on_add():
  setAttr('Species', 'Stitched')
  setAttr('Modular Construction', true)
  setAttr('Inconsistent Resonance Signature', true)
  setAttr('Stagger Resistance', true)
  setAttr('Drift State', 'none')
  setAttr('Component A Primary', 'player_defined')
  setAttr('Component B Secondary', 'player_defined')
  setAttr('Assembly Provenance', 'mixed_sources')
  Owner.setProperty('race_tag', 'stitched')
  Owner.setProperty('stagger_resistance_used_this_combat', 'false')
  announce('Stitched race initialized. Set Component A and B in character sheet before first combat.')
  return
