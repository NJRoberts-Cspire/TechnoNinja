// ============================================================
// TESSHARI CLASS SCRIPTS — Classes 14-25
// Flesh Shaper, Puppet Binder, Blood Smith, The Hollow,
// Shadow Daimyo, Voice of Debt, Merchant Knife, Iron Herald,
// Curse Eater, Shell Dancer, Fracture Knight, The Unnamed
//
// Requires: 00_global_tesshari_card_core.qbs loaded as Global.
// ============================================================

// ------------------------------------------------------------
// FLESH SHAPER
// ------------------------------------------------------------
on_add_flesh_shaper():
  Owner.Attribute('Class').set('Flesh Shaper')
  setAttr('Flesh Shaper HP Tier', 'full')
  path = text(Owner.Attribute('Flesh Shaper Path').value)
  if path == '':
    setAttr('Flesh Shaper Path', 'the_mender')
  announce('Flesh Shaper initialized. HP tier tracking active.')
  return

on_hp_change_flesh_shaper():
  hp = Owner.Attribute('Current HP')
  maxHp = Owner.Attribute('Max HP')
  if !hp || !maxHp:
    return
  cur = number(hp.value)
  max = number(maxHp.value)
  if max <= 0:
    return
  pct = cur / max
  if pct > 0.5:
    setAttr('Flesh Shaper HP Tier', 'full')
  else if pct > 0.25:
    setAttr('Flesh Shaper HP Tier', 'wounded')
  else:
    setAttr('Flesh Shaper HP Tier', 'critical')
  return

on_long_rest_flesh_shaper():
  setAttr('Flesh Shaper HP Tier', 'full')
  Owner.setProperty('crisis_mend_extra_used', 'false')
  announce('Flesh Shaper long rest: HP tier reset to full.')
  return

// ------------------------------------------------------------
// PUPPET BINDER
// ------------------------------------------------------------
on_add_puppet_binder():
  Owner.Attribute('Class').set('Puppet Binder')
  setAttr('Vessel Active', false)
  setAttr('Binding Threads', 0)
  path = text(Owner.Attribute('Puppet Binder Path').value)
  if path == '':
    setAttr('Puppet Binder Path', 'the_architect')
  Owner.setProperty('bound_target_ids', '')
  announce('Puppet Binder initialized. No active binds.')
  return

puppet_binder_apply_bind(targetId):
  threads = Owner.Attribute('Binding Threads')
  if !threads:
    return
  count = number(threads.value) + 1
  threads.set(count)
  setAttr('Vessel Active', true)
  existing = text(Owner.getProperty('bound_target_ids'))
  if existing == '':
    Owner.setProperty('bound_target_ids', targetId)
  else:
    Owner.setProperty('bound_target_ids', existing + '|' + targetId)
  announce('Puppet Binder applied bind. Total threads: ' + text(count))
  return

puppet_binder_release_bind(targetId):
  threads = Owner.Attribute('Binding Threads')
  if !threads:
    return
  count = number(threads.value) - 1
  if count < 0:
    count = 0
  threads.set(count)
  existing = text(Owner.getProperty('bound_target_ids'))
  updated = ''
  parts = splitPipe(existing)
  for p in parts:
    if text(p) != targetId:
      if updated == '':
        updated = text(p)
      else:
        updated = updated + '|' + text(p)
  Owner.setProperty('bound_target_ids', updated)
  if count == 0:
    setAttr('Vessel Active', false)
  announce('Puppet Binder released bind on ' + targetId + '. Threads: ' + text(count))
  return

on_long_rest_puppet_binder():
  setAttr('Binding Threads', 0)
  setAttr('Vessel Active', false)
  Owner.setProperty('bound_target_ids', '')
  announce('Puppet Binder long rest: all binds released.')
  return

// ------------------------------------------------------------
// BLOOD SMITH
// ------------------------------------------------------------
on_add_blood_smith():
  Owner.Attribute('Class').set('Blood Smith')
  setAttr('Enhancement Status', 'stable')
  path = text(Owner.Attribute('Blood Smith Path').value)
  if path == '':
    setAttr('Blood Smith Path', 'the_weaponsmith')
  announce('Blood Smith initialized. Enhancement status: stable.')
  return

// Call at on_action_attempt for any card that has an HP cost.
// hpCost: the raw HP cost listed on the card.
// Returns true if payment succeeds; false blocks the card.
blood_smith_pay_hp(hpCost):
  hp = Owner.Attribute('Current HP')
  if !hp:
    announce('No HP attribute found.')
    return false
  cur = number(hp.value)
  // Iron Tolerance reduces cost by 2 (minimum 1)
  tolerance = getAttrNumber('Iron Tolerance Reduction', 2)
  reduced = hpCost - tolerance
  if reduced < 1:
    reduced = 1
  if cur <= reduced:
    announce('Not enough HP to pay cost of ' + text(reduced) + ' HP.')
    return false
  hp.set(cur - reduced)
  announce('Blood Smith paid ' + text(reduced) + ' HP (base ' + text(hpCost) + ', reduced by ' + text(tolerance) + ').')
  return true

on_hp_change_blood_smith():
  hp = Owner.Attribute('Current HP')
  maxHp = Owner.Attribute('Max HP')
  if !hp || !maxHp:
    return
  cur = number(hp.value)
  max = number(maxHp.value)
  if max <= 0:
    return
  pct = cur / max
  if pct > 0.5:
    setAttr('Enhancement Status', 'stable')
  else if pct > 0.25:
    setAttr('Enhancement Status', 'stressed')
  else:
    setAttr('Enhancement Status', 'failing')
  return

on_long_rest_blood_smith():
  setAttr('Enhancement Status', 'stable')
  announce('Blood Smith long rest: enhancement status reset to stable.')
  return

// ------------------------------------------------------------
// THE HOLLOW
// ------------------------------------------------------------
on_add_hollow():
  Owner.Attribute('Class').set('The Hollow')
  path = text(Owner.Attribute('Hollow Path').value)
  if path == '' || path == 'none':
    setAttr('Hollow Path', 'the_empty')
  setAttr('Current HP Percent', 100)
  announce('The Hollow initialized. Path: ' + text(Owner.Attribute('Hollow Path').value))
  return

on_hp_change_hollow():
  hp = Owner.Attribute('Current HP')
  maxHp = Owner.Attribute('Max HP')
  if !hp || !maxHp:
    return
  cur = number(hp.value)
  max = number(maxHp.value)
  if max <= 0:
    return
  pct = (cur * 100) / max
  setAttr('Current HP Percent', pct)
  return

on_long_rest_hollow():
  setAttr('Current HP Percent', 100)
  announce('The Hollow long rest complete.')
  return

// ------------------------------------------------------------
// SHADOW DAIMYO
// ------------------------------------------------------------
on_add_shadow_daimyo():
  Owner.Attribute('Class').set('Shadow Daimyo')
  setAttr('Intelligence Gathered', 0)
  setAttr('Active Contacts', 0)
  path = text(Owner.Attribute('Shadow Daimyo Path').value)
  if path == '':
    setAttr('Shadow Daimyo Path', 'spymaster')
  Owner.setProperty('intelligence_map', '')
  announce('Shadow Daimyo initialized. Intelligence: 0. Contacts: 0.')
  return

shadow_daimyo_apply_intelligence(targetId):
  intel = Owner.Attribute('Intelligence Gathered')
  if intel:
    intel.set(number(intel.value) + 1)
  announce('Intelligence gathered on ' + targetId + '. Total: ' + text(Owner.Attribute('Intelligence Gathered').value))
  return

shadow_daimyo_activate_contact():
  contacts = Owner.Attribute('Active Contacts')
  if !contacts || number(contacts.value) <= 0:
    announce('No active contacts available.')
    return false
  contacts.set(number(contacts.value) - 1)
  announce('Contact activated. Remaining: ' + text(contacts.value))
  return true

on_long_rest_shadow_daimyo():
  // Restore contacts per path (base 1 per long rest)
  contacts = Owner.Attribute('Active Contacts')
  if contacts:
    contacts.set(number(contacts.value) + 1)
  announce('Shadow Daimyo long rest: 1 contact slot restored.')
  return

// ------------------------------------------------------------
// VOICE OF DEBT
// ------------------------------------------------------------
on_add_voice_of_debt():
  Owner.Attribute('Class').set('Voice of Debt')
  setAttr('Debt Detonations Used', 0)
  path = text(Owner.Attribute('Voice of Debt Path').value)
  if path == '':
    setAttr('Voice of Debt Path', 'oath_keeper')
  Owner.setProperty('debt_stacks_map', '')
  announce('Voice of Debt initialized. Detonation tracker cleared.')
  return

// Apply Debt stacks to a target. targetId: string ID.
// stacksToAdd: positive integer.
// Updates serialized debt map in Owner property.
vod_apply_debt(targetId, stacksToAdd):
  raw = text(Owner.getProperty('debt_stacks_map'))
  cur = getMapValue(raw, targetId, 0)
  newVal = cur + stacksToAdd
  updated = setMapValue(raw, targetId, newVal)
  Owner.setProperty('debt_stacks_map', updated)
  announce('Debt applied to ' + targetId + '. Stacks: ' + text(newVal))
  return

// Detonate all Debt stacks on a target. Returns stack count for damage calc.
// Caller applies damage as: baseDmg + stackCount * dmgPerStack
// Then calls vod_clear_debt(targetId).
vod_get_debt_stacks(targetId):
  raw = text(Owner.getProperty('debt_stacks_map'))
  return getMapValue(raw, targetId, 0)

vod_clear_debt(targetId):
  raw = text(Owner.getProperty('debt_stacks_map'))
  updated = setMapValue(raw, targetId, 0)
  Owner.setProperty('debt_stacks_map', updated)
  det = Owner.Attribute('Debt Detonations Used')
  if det:
    det.set(number(det.value) + 1)
  announce('Debt detonated on ' + targetId + '. Stacks cleared.')
  return

on_encounter_start_voice_of_debt():
  setAttr('Debt Detonations Used', 0)
  Owner.setProperty('debt_stacks_map', '')
  announce('Voice of Debt encounter reset: detonation counter and debt map cleared.')
  return

// ------------------------------------------------------------
// MERCHANT KNIFE
// ------------------------------------------------------------
on_add_merchant_knife():
  Owner.Attribute('Class').set('Merchant Knife')
  path = text(Owner.Attribute('Merchant Knife Path').value)
  if path == '':
    setAttr('Merchant Knife Path', 'supply_cutter')
  Owner.setProperty('mk_intelligence_map', '')
  Owner.setProperty('mk_debt_map', '')
  announce('Merchant Knife initialized.')
  return

mk_apply_intelligence(targetId):
  raw = text(Owner.getProperty('mk_intelligence_map'))
  cur = getMapValue(raw, targetId, 0)
  if cur >= 3:
    announce('Intelligence already at maximum 3 on ' + targetId + '.')
    return
  newVal = cur + 1
  updated = setMapValue(raw, targetId, newVal)
  Owner.setProperty('mk_intelligence_map', updated)
  announce('Intelligence on ' + targetId + ': ' + text(newVal) + '/3')
  return

on_long_rest_merchant_knife():
  Owner.setProperty('mk_intelligence_map', '')
  Owner.setProperty('mk_debt_map', '')
  announce('Merchant Knife long rest: intelligence and debt maps cleared.')
  return

// ------------------------------------------------------------
// IRON HERALD
// ------------------------------------------------------------
on_add_iron_herald():
  Owner.Attribute('Class').set('Iron Herald')
  setAttr('Command Zone Active', false)
  setAttr('Priority Target ID', '')
  setAttr('Command Zone Radius', 15)
  path = text(Owner.Attribute('Iron Herald Path').value)
  if path == '':
    setAttr('Iron Herald Path', 'warbanner')
  announce('Iron Herald initialized. Command Zone inactive.')
  return

iron_herald_establish_zone():
  setAttr('Command Zone Active', true)
  announce(Owner.title + ' establishes Command Zone (radius: ' + text(Owner.Attribute('Command Zone Radius').value) + ' ft). Zone-synergy cards now available.')
  return

iron_herald_set_priority(targetId):
  setAttr('Priority Target ID', targetId)
  announce('Priority Target set: ' + targetId + '. Allies gain bonuses against this target.')
  return

iron_herald_collapse_zone():
  setAttr('Command Zone Active', false)
  announce('Command Zone collapsed.')
  return

on_short_rest_iron_herald():
  announce('Iron Herald short rest: command resources restored.')
  return

// ------------------------------------------------------------
// CURSE EATER
// ------------------------------------------------------------
on_add_curse_eater():
  Owner.Attribute('Class').set('Curse Eater')
  setAttr('Loaded Count', 0)
  setAttr('Corruption Points', 0)
  path = text(Owner.Attribute('Curse Eater Path').value)
  if path == '':
    setAttr('Curse Eater Path', 'purifier')
  announce('Curse Eater initialized. Loaded: 0. Corruption: 0.')
  return

// Absorb one debuff from an ally (pass statusId). Remove it from
// ally, increment own Loaded Count by 1.
curse_eater_absorb(statusId, allyRef):
  if allyRef:
    // Remove from ally — caller must pass valid ally reference
    announce('Absorbed ' + statusId + ' from ally.')
  loaded = Owner.Attribute('Loaded Count')
  if loaded:
    newVal = number(loaded.value) + 1
    loaded.set(newVal)
    announce('Loaded Count: ' + text(newVal))
  return

// Purge Loaded stacks. Returns stack count for purge power calc.
curse_eater_purge():
  loaded = Owner.Attribute('Loaded Count')
  if !loaded:
    return 0
  count = number(loaded.value)
  loaded.set(0)
  announce('Curse Eater purged ' + text(count) + ' Loaded stacks.')
  return count

// Accumulate corruption (Consumed path only).
curse_eater_accumulate_corruption(amount):
  corruption = Owner.Attribute('Corruption Points')
  if !corruption:
    return
  newVal = number(corruption.value) + amount
  corruption.set(newVal)
  announce('Corruption Points: ' + text(newVal))
  // Threshold announcements
  if newVal >= 10 && newVal < 20:
    announce('Corruption threshold 1: minor transformation available.')
  else if newVal >= 20:
    announce('Corruption threshold 2: major transformation unlocked.')
  return

on_long_rest_curse_eater():
  loaded = Owner.Attribute('Loaded Count')
  if loaded:
    half = number(loaded.value) / 2
    loaded.set(half)
  announce('Curse Eater long rest: Loaded Count halved.')
  return

// ------------------------------------------------------------
// SHELL DANCER
// ------------------------------------------------------------
on_add_shell_dancer():
  Owner.Attribute('Class').set('Shell Dancer')
  setAttr('Cascade Count', 0)
  setAttr('In Shell Step', false)
  setAttr('Shell Step Turns Remaining', 0)
  path = text(Owner.Attribute('Shell Dancer Path').value)
  if path == '':
    setAttr('Shell Dancer Path', 'the_breaker')
  announce('Shell Dancer initialized. Cascade: 0. Shell Step: inactive.')
  return

// Call on_damaged to generate Cascade from incoming damage.
shell_dancer_on_damage():
  cascade = Owner.Attribute('Cascade Count')
  if !cascade:
    return
  cur = number(cascade.value)
  if cur < 10:
    cascade.set(cur + 1)
    announce('Shell Dancer Cascade: ' + text(cur + 1) + '/10')
  else:
    announce('Shell Dancer Cascade at maximum (10). No further gain.')
  return

// Enter Shell Step evasion state.
shell_dancer_enter_shell_step():
  setAttr('In Shell Step', true)
  setAttr('Shell Step Turns Remaining', 2)
  announce('Shell Dancer enters Shell Step. Turns remaining: 2.')
  return

// Tick Shell Step at turn end.
on_turn_end_shell_dancer():
  active = text(Owner.Attribute('In Shell Step').value)
  if active != 'true':
    return
  turns = Owner.Attribute('Shell Step Turns Remaining')
  if !turns:
    return
  newVal = number(turns.value) - 1
  if newVal <= 0:
    turns.set(0)
    setAttr('In Shell Step', false)
    announce('Shell Step expired.')
  else:
    turns.set(newVal)
    announce('Shell Step: ' + text(newVal) + ' turn(s) remaining.')
  return

// Spend Cascade for a card that costs Cascade.
shell_dancer_spend_cascade(cost):
  cascade = Owner.Attribute('Cascade Count')
  if !cascade:
    return false
  cur = number(cascade.value)
  if cur < cost:
    announce('Not enough Cascade. Have ' + text(cur) + ', need ' + text(cost) + '.')
    return false
  cascade.set(cur - cost)
  announce('Spent ' + text(cost) + ' Cascade. Remaining: ' + text(cur - cost))
  return true

on_long_rest_shell_dancer():
  setAttr('Cascade Count', 0)
  setAttr('In Shell Step', false)
  setAttr('Shell Step Turns Remaining', 0)
  announce('Shell Dancer long rest: Cascade reset, Shell Step cleared.')
  return

// ------------------------------------------------------------
// FRACTURE KNIGHT
// ------------------------------------------------------------
on_add_fracture_knight():
  Owner.Attribute('Class').set('Fracture Knight')
  setAttr('Phantom Charges', 2)
  setAttr('Fracture Stacks on Self', 0)
  path = text(Owner.Attribute('Fracture Knight Path').value)
  if path == '':
    setAttr('Fracture Knight Path', 'the_claimed')
  Owner.setProperty('fracture_target_map', '')
  announce('Fracture Knight initialized. Phantom Charges: 2.')
  return

// Generate Phantom Charges (capped at 6).
fracture_knight_generate_phantom(amount):
  charges = Owner.Attribute('Phantom Charges')
  if !charges:
    return
  cur = number(charges.value)
  newVal = cur + amount
  if newVal > 6:
    newVal = 6
  charges.set(newVal)
  announce('Phantom Charges: ' + text(newVal) + '/6')
  return

// Spend Phantom Charges. Returns false if insufficient.
fracture_knight_spend_phantom(cost):
  charges = Owner.Attribute('Phantom Charges')
  if !charges:
    return false
  cur = number(charges.value)
  if cur < cost:
    announce('Not enough Phantom Charges. Have ' + text(cur) + ', need ' + text(cost) + '.')
    return false
  charges.set(cur - cost)
  announce('Spent ' + text(cost) + ' Phantom Charges. Remaining: ' + text(cur - cost))
  return true

// Apply Fracture stacks to self (some cards fracture the knight).
fracture_knight_apply_self_fracture(stacks):
  fs = Owner.Attribute('Fracture Stacks on Self')
  if !fs:
    return
  newVal = number(fs.value) + stacks
  if newVal > 5:
    newVal = 5
  fs.set(newVal)
  announce('Fracture Stacks on self: ' + text(newVal))
  return

// Apply Fracture stacks to a target (tracked in serialized map).
fracture_knight_apply_target_fracture(targetId, stacks):
  raw = text(Owner.getProperty('fracture_target_map'))
  cur = getMapValue(raw, targetId, 0)
  newVal = cur + stacks
  updated = setMapValue(raw, targetId, newVal)
  Owner.setProperty('fracture_target_map', updated)
  announce('Fracture stacks on ' + targetId + ': ' + text(newVal))
  return

on_short_rest_fracture_knight():
  lvl = getAttrNumber('Level', 1)
  base = 2
  // Higher levels grant more charges per rest (optional scaling)
  setAttr('Phantom Charges', base)
  announce('Fracture Knight short rest: Phantom Charges restored to ' + text(base) + '.')
  return

on_long_rest_fracture_knight():
  setAttr('Phantom Charges', 6)
  setAttr('Fracture Stacks on Self', 0)
  Owner.setProperty('fracture_target_map', '')
  announce('Fracture Knight long rest: Phantom Charges maxed. Fracture cleared.')
  return

// ------------------------------------------------------------
// THE UNNAMED
// ------------------------------------------------------------
on_add_unnamed():
  Owner.Attribute('Class').set('The Unnamed')
  setAttr('Active Stat', 'IRON')
  path = text(Owner.Attribute('Unnamed Path').value)
  if path == '' || path == 'none':
    setAttr('Unnamed Path', 'convergent')
  Owner.setProperty('named_cards_map', '')
  announce('The Unnamed initialized. Cards unlock through personal conditions. Define yourself.')
  return

// Shift Active Stat to a new value.
unnamed_shift_stat(newStat):
  valid = ['IRON','EDGE','SIGNAL','RESONANCE','VEIL','FRAME']
  found = false
  for v in valid:
    if text(v) == text(newStat):
      found = true
  if !found:
    announce('Invalid stat: ' + newStat)
    return
  setAttr('Active Stat', newStat)
  announce('The Unnamed shifts: Active Stat is now ' + newStat + '.')
  return

// Player names a card. cardId: the card_unnamed_card_N id.
// cardName: the player-chosen name.
unnamed_name_card(cardId, cardName):
  raw = text(Owner.getProperty('named_cards_map'))
  updated = setMapValue(raw, cardId, 1)  // 1 = named
  Owner.setProperty('named_cards_map', updated)
  announce('Card named: "' + cardName + '". This card has been defined through play.')
  return

on_long_rest_unnamed():
  announce('The Unnamed long rest complete.')
  return
