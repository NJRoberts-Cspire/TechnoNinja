// ============================================================
// TESSHARI CLASS SCRIPTS — Classes 2-13
// Ronin, Ashfoot, Veilblade, Oni Hunter, Forge Tender,
// Wireweave, Chrome Shaper, Pulse Caller, Iron Monk,
// Echo Speaker, Void Walker, Sutensai
//
// Each section: on_add_initialize + short/long rest resets.
// Requires: 00_global_tesshari_card_core.qbs loaded as Global.
// ============================================================

// ------------------------------------------------------------
// RONIN
// ------------------------------------------------------------
on_add_ronin():
    Owner.Attribute('Class').set('Ronin')
    setAttr('Corrupted Resonance Signature', true)
    setAttr('Oath Status', 'Masterless')
    setAttr('Contract Target', '')
    path = text(Owner.Attribute('Ronin Path').value)
    if path == '':
        setAttr('Ronin Path', 'ascendant_blade')
    announce('Ronin initialized. Corrupted resonance signature active. Oath: Masterless.')
    return

on_long_rest_ronin():
    // No per-rest resources currently; clear contract if expired
    announce('Ronin long rest complete.')
    return

// ------------------------------------------------------------
// ASHFOOT
// ------------------------------------------------------------
on_add_ashfoot():
    Owner.Attribute('Class').set('Ashfoot')
    setAttr('Ashfoot Caste Tier', 'Low')
    setAttr('Enhancement Quality', 'salvage')
    path = text(Owner.Attribute('Ashfoot Path').value)
    if path == '':
        setAttr('Ashfoot Path', 'skirmish_specialist')
    announce('Ashfoot initialized. Caste: Low. Enhancement quality: salvage.')
    return

on_short_rest_ashfoot():
    announce('Ashfoot short rest complete.')
    return

// ------------------------------------------------------------
// VEILBLADE
// ------------------------------------------------------------
on_add_veilblade():
    Owner.Attribute('Class').set('Veilblade')
    setAttr('Resonant Signature State', 'suppressed')
    setAttr('Wire Integration Active', true)
    path = text(Owner.Attribute('Veilblade Path').value)
    if path == '':
        setAttr('Veilblade Path', 'shadow_operative')
    announce('Veilblade initialized. Resonance signature suppressed. Wire integration active.')
    return

on_short_rest_veilblade():
    announce('Veilblade short rest complete.')
    return

// ------------------------------------------------------------
// ONI HUNTER
// ------------------------------------------------------------
on_add_oni_hunter():
    Owner.Attribute('Class').set('Oni Hunter')
    setAttr('Quarry Marked', false)
    setAttr('Dissolution Resonance', 0)
    path = text(Owner.Attribute('Oni Hunter Path').value)
    if path == '':
        setAttr('Oni Hunter Path', 'dissolution_specialist')
    Owner.setProperty('current_quarry_id', '')
    announce('Oni Hunter initialized. Quarry mark cleared.')
    return

on_action_oni_hunter_mark():
    // Attach to card_oni_hunter_hunters_mark on_activate
    setAttr('Quarry Marked', true)
    announce(Owner.title + ' marks their quarry. Mark-conditional bonuses now active.')
    return

on_short_rest_oni_hunter():
    setAttr('Quarry Marked', false)
    Owner.setProperty('current_quarry_id', '')
    announce('Oni Hunter short rest: quarry mark cleared.')
    return

// ------------------------------------------------------------
// FORGE TENDER
// ------------------------------------------------------------
on_add_forge_tender():
    Owner.Attribute('Class').set('Forge Tender')
    setAttr('Resonance Keepers Aligned', false)
    setAttr('Community Dependent', true)
    path = text(Owner.Attribute('Forge Tender Path').value)
    if path == '':
        setAttr('Forge Tender Path', 'resonance_keeper')
    Owner.setProperty('forge_mend_uses_short', '2')
    announce('Forge Tender initialized. Community Dependent active.')
    return

on_short_rest_forge_tender():
    Owner.setProperty('forge_mend_uses_short', '2')
    announce('Forge Tender short rest: heal uses restored.')
    return

on_long_rest_forge_tender():
    Owner.setProperty('forge_mend_uses_short', '2')
    announce('Forge Tender long rest: all resources restored.')
    return

// ------------------------------------------------------------
// WIREWEAVE
// ------------------------------------------------------------
on_add_wireweave():
    Owner.Attribute('Class').set('Wireweave')
    path = text(Owner.Attribute('Wireweave Path').value)
    if path == '':
        setAttr('Wireweave Path', 'combat_weave')
    announce('Wireweave initialized.')
    return

on_short_rest_wireweave():
    announce('Wireweave short rest complete.')
    return

// ------------------------------------------------------------
// CHROME SHAPER
// ------------------------------------------------------------
on_add_chrome_shaper():
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

on_action_chrome_shaper_config_switch(configName, statKey, bonus):
    // Generic config switch: remove previous config modifiers, apply new ones.
    // Call with configName (label), statKey (attribute name to modify), bonus (number to add/subtract).
    prev = text(Owner.getProperty('active_config'))
    prevStatKey = text(Owner.getProperty('active_config_stat_key'))
    prevBonus = number(Owner.getProperty('active_config_bonus'))

    // Remove previous config modifier if one was active
    if prev != 'none' && prev != '' && prevStatKey != '':
        prevAttr = Owner.Attribute(prevStatKey)
        if prevAttr:
            prevAttr.set(number(prevAttr.value) - prevBonus)
        announce('Configuration ' + prev + ' deactivated. ' + prevStatKey + ' restored.')

    // Apply new config modifier
    if statKey != '' && number(bonus) != 0:
        newAttr = Owner.Attribute(statKey)
        if newAttr:
            newAttr.set(number(newAttr.value) + number(bonus))
        announce('Configuration ' + configName + ' activated. ' + statKey + ' adjusted by ' + text(bonus) + '.')
    else:
        announce('Configuration ' + configName + ' activated.')

    // Store current config state for reversal on next switch
    Owner.setProperty('active_config', configName)
    Owner.setProperty('active_config_stat_key', statKey)
    Owner.setProperty('active_config_bonus', text(bonus))
    return

on_short_rest_chrome_shaper():
    announce('Chrome Shaper short rest complete.')
    return

// ------------------------------------------------------------
// PULSE CALLER
// ------------------------------------------------------------
on_add_pulse_caller():
    Owner.Attribute('Class').set('Pulse Caller')
    setAttr('Integrated Weapon Active', true)
    setAttr('Preconscious Fire Active', false)
    path = text(Owner.Attribute('Pulse Caller Path').value)
    if path == '':
        setAttr('Pulse Caller Path', 'single_point')
    announce('Pulse Caller initialized. Integrated weapon active.')
    return

on_short_rest_pulse_caller():
    announce('Pulse Caller short rest complete.')
    return

// ------------------------------------------------------------
// IRON MONK
// ------------------------------------------------------------
on_add_iron_monk():
    Owner.Attribute('Class').set('Iron Monk')
    setAttr('Between State Active', false)
    setAttr('Below Half HP Bonus Active', false)
    path = text(Owner.Attribute('Iron Monk Path').value)
    if path == '':
        setAttr('Iron Monk Path', 'orthodoxy')
    announce('Iron Monk initialized. Hand size 5 (smallest in system).')
    return

on_action_iron_monk_between_toggle():
    // Attach to between_step or between_form cards that toggle state.
    current = text(Owner.Attribute('Between State Active').value)
    if current == 'true':
        setAttr('Between State Active', false)
        announce('Iron Monk exits Between state.')
    else:
        setAttr('Between State Active', true)
        announce('Iron Monk enters Between state. State-conditional bonuses active.')
    return

on_hp_change_iron_monk():
    // Track below-half bonus state.
    hp = Owner.Attribute('Current HP')
    maxHp = Owner.Attribute('Max HP')
    if !hp || !maxHp:
        return
    cur = number(hp.value)
    max = number(maxHp.value)
    if max <= 0:
        return
    below = cur <= max / 2
    setAttr('Below Half HP Bonus Active', below)
    return

on_long_rest_iron_monk():
    setAttr('Between State Active', false)
    setAttr('Below Half HP Bonus Active', false)
    announce('Iron Monk long rest: state trackers cleared.')
    return

// ------------------------------------------------------------
// ECHO SPEAKER
// ------------------------------------------------------------
on_add_echo_speaker():
    Owner.Attribute('Class').set('Echo Speaker')
    setAttr('Afterlife Affinity', true)
    setAttr('Grief Stacks', 0)
    path = text(Owner.Attribute('Echo Speaker Path').value)
    if path == '':
        setAttr('Echo Speaker Path', 'sutensai_aligned')
    announce('Echo Speaker initialized. Afterlife affinity active. Grief stacks: 0.')
    return

on_ally_death_echo_speaker():
    // Call when an ally within range drops to 0 HP.
    grief = Owner.Attribute('Grief Stacks')
    if grief:
        grief.set(number(grief.value) + 1)
        announce('Echo Speaker grief accumulates. Stacks: ' + text(grief.value))
    return

on_long_rest_echo_speaker():
    setAttr('Grief Stacks', 0)
    announce('Echo Speaker long rest: grief stacks cleared.')
    return

// ------------------------------------------------------------
// VOID WALKER
// ------------------------------------------------------------
on_add_void_walker():
    Owner.Attribute('Class').set('Void Walker')
    setAttr('Incorporeal State Active', false)
    setAttr('Anchor Points', 0)
    path = text(Owner.Attribute('Void Walker Path').value)
    if path == '':
        setAttr('Void Walker Path', 'ghost_operative')
    announce('Void Walker initialized. Incorporeal state inactive.')
    return

on_action_void_walker_phase_toggle():
    current = text(Owner.Attribute('Incorporeal State Active').value)
    if current == 'true':
        setAttr('Incorporeal State Active', false)
        announce('Void Walker returns to physical state.')
    else:
        setAttr('Incorporeal State Active', true)
        announce('Void Walker enters incorporeal state. Phase-conditional defenses active.')
    return

on_short_rest_void_walker():
    announce('Void Walker short rest complete.')
    return

// ------------------------------------------------------------
// SUTENSAI
// ------------------------------------------------------------
on_add_sutensai():
    Owner.Attribute('Class').set('Sutensai')
    setAttr('Reader Authority', true)
    setAttr('Echomind Reading Level', 1)
    setAttr('HP Cost Payment Enabled', true)
    path = text(Owner.Attribute('Sutensai Path').value)
    if path == '':
        setAttr('Sutensai Path', 'inquisitor')
    announce('Sutensai initialized. Reader authority active. HP cost cards enabled.')
    return

// HP cost payment: call at on_action_attempt for HP-cost cards.
// apCost is 0 for HP-cost variants; hpCost is the HP to deduct.
sutensai_pay_hp_cost(hpCost):
    hp = Owner.Attribute('Current HP')
    if !hp:
        announce('Cannot pay HP cost: no HP attribute found.')
        return false
    cur = number(hp.value)
    if cur <= hpCost:
        announce('Not enough HP to pay cost of ' + text(hpCost) + '.')
        return false
    hp.set(cur - hpCost)
    announce('Paid HP cost: ' + text(hpCost) + '. HP remaining: ' + text(cur - hpCost) + '.')
    return true

on_long_rest_sutensai():
    announce('Sutensai long rest complete.')
    return
