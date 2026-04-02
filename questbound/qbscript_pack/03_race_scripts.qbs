// ============================================================
// TESSHARI RACE SCRIPTS — Races 2-8
// Attach each on_add block to its corresponding race archetype.
// Requires: 00_global_tesshari_card_core.qbs loaded as Global.
// ============================================================

// ------------------------------------------------------------
// scr_tethered_on_add_initialize
// Attach: arc_race_tethered_base -> on_add()
// ------------------------------------------------------------
on_add_tethered():
  setAttr('Species', 'Tethered')
  setAttr('Augmentation Count', 0)
  setAttr('Echomind Undivided', true)
  setAttr('Biological Acuity', true)
  setAttr('Old Flesh Memory', true)
  setAttr('Unclocked', true)
  Owner.setProperty('race_tag', 'tethered')
  announce('Tethered race initialized. Augmentation slots locked at 0.')
  return

// ------------------------------------------------------------
// scr_echoed_on_add_initialize
// Attach: arc_race_echoed_base -> on_add()
// ------------------------------------------------------------
on_add_echoed():
  setAttr('Species', 'Echoed')
  setAttr('Already Died', true)
  setAttr('Iron Afterlife Awareness', true)
  setAttr('No Fear of the Crossing', true)
  setAttr('Gap Resonance Imprint', 'unknown')
  setAttr('Carried Things Present', true)
  Owner.setProperty('race_tag', 'echoed')
  Owner.setProperty('already_died_used', 'false')
  announce('Echoed race initialized. Already Died tracker armed for this encounter.')
  return

// ------------------------------------------------------------
// scr_echoed_already_died_trigger
// Attach: hp_change handler (call after each HP modification).
// Resets at encounter start by clearing already_died_used.
// ------------------------------------------------------------
on_hp_change_echoed():
  hp = Owner.Attribute('Current HP')
  if !hp:
    return
  if number(hp.value) > 0:
    return
  used = text(Owner.getProperty('already_died_used'))
  if used == 'true':
    return
  alive = text(Owner.Attribute('Already Died').value)
  if alive != 'true':
    return
  hp.set(1)
  Owner.setProperty('already_died_used', 'true')
  announce('Already Died triggered: ' + Owner.title + ' drops to 1 HP instead of 0.')
  return

// ------------------------------------------------------------
// scr_wireborn_on_add_initialize
// Attach: arc_race_wireborn_base -> on_add()
// ------------------------------------------------------------
on_add_wireborn():
  setAttr('Species', 'Wireborn')
  setAttr('Ambient Wire Sense', true)
  setAttr('Signal Vulnerability', true)
  setAttr('Digital Navigation', true)
  setAttr('Circuit Trace Pattern', 'luminous_blue_amber')
  Owner.setProperty('race_tag', 'wireborn')
  announce('Wireborn race initialized. Signal Vulnerability active: Silence effects last 1 extra turn.')
  return

// ------------------------------------------------------------
// scr_stitched_on_add_initialize
// Attach: arc_race_stitched_base -> on_add()
// GM or player should set Component A and B manually after creation.
// ------------------------------------------------------------
on_add_stitched():
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

// ------------------------------------------------------------
// scr_shellbroken_on_add_initialize
// Attach: arc_race_shellbroken_base -> on_add()
// ------------------------------------------------------------
on_add_shellbroken():
  setAttr('Species', 'Shellbroken')
  setAttr('Void-Touched Mind', true)
  setAttr('Shell-State Awareness', true)
  setAttr('Survivor\'s Clarity', true)
  setAttr('Hollow Author Connection', true)
  setAttr('Identity Tokens', '')
  setAttr('Gap Period', 'unknown')
  setAttr('Connection Mark', 'skull_base_or_jaw')
  Owner.setProperty('race_tag', 'shellbroken')
  Owner.setProperty('survivor_clarity_used', 'false')
  announce('Shellbroken race initialized. Survivor\'s Clarity armed for first below-half-HP trigger.')
  return

// ------------------------------------------------------------
// scr_shellbroken_survivor_clarity_trigger
// Attach: hp_change handler. Fires Guard 4 once per combat on
// first time HP drops below half.
// ------------------------------------------------------------
on_hp_change_shellbroken():
  hp = Owner.Attribute('Current HP')
  maxHp = Owner.Attribute('Max HP')
  if !hp || !maxHp:
    return
  used = text(Owner.getProperty('survivor_clarity_used'))
  if used == 'true':
    return
  cur = number(hp.value)
  max = number(maxHp.value)
  if max <= 0:
    return
  if cur > max / 2:
    return
  // Below half HP for first time — apply Guard 4 free reaction
  guardAttr = Owner.Attribute('Guard Value')
  if guardAttr:
    guardAttr.set(number(guardAttr.value) + 4)
  Owner.setProperty('survivor_clarity_used', 'true')
  announce('Survivor\'s Clarity triggered: Guard +4 applied as free reaction.')
  return

// ------------------------------------------------------------
// scr_iron_blessed_on_add_initialize
// Attach: arc_race_iron_blessed_base -> on_add()
// Prompt must be resolved: set Subtype to tended or unregistered.
// Hand size modifier is set after subtype choice.
// ------------------------------------------------------------
on_add_iron_blessed():
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

// ------------------------------------------------------------
// scr_diminished_on_add_initialize
// Attach: arc_race_diminished_base -> on_add()
// ------------------------------------------------------------
on_add_diminished():
  setAttr('Species', 'Diminished')
  setAttr('Social Invisibility', true)
  setAttr('Environmental Awareness', true)
  setAttr('Lean Target', true)
  setAttr('Frame Specialization', 'optimized_for_confined')
  setAttr('Deep School Training', true)
  setAttr('Infrastructure Knowledge', 'system_specific')
  Owner.setProperty('race_tag', 'diminished')
  announce('Diminished race initialized. Hand size +2. Lean Target active.')
  return
