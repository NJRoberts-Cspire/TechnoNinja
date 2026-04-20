// Tesshari character loader — runs on character load/sheet-open.
// Dispatches race/class/subclass logic by reading attribute values.
// Requires: tesshari_card_core global helpers (setAttr, announce, etc.)

// ══ RACE INITS ══
init_race_tethered():
    setAttr('Species', 'Tethered')
    setAttr('Augmentation Count', 0)
    setAttr('Echomind Undivided', true)
    setAttr('Biological Acuity', true)
    setAttr('Old Flesh Memory', true)
    setAttr('Unclocked', true)
    Owner.setProperty('race_tag', 'tethered')
    announce('Tethered race initialized. Augmentation slots locked at 0.')
    return


init_race_echoed():
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


init_race_wireborn():
    setAttr('Species', 'Wireborn')
    setAttr('Ambient Wire Sense', true)
    setAttr('Signal Vulnerability', true)
    setAttr('Digital Navigation', true)
    setAttr('Circuit Trace Pattern', 'luminous_blue_amber')
    Owner.setProperty('race_tag', 'wireborn')
    announce('Wireborn race initialized. Signal Vulnerability active: Silence effects last 1 extra turn.')
    return


init_race_stitched():
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


init_race_shellbroken():
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


init_race_iron_blessed():
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


init_race_diminished():
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


init_race_forged():
    setAttr('Species', 'Forged')
    Owner.setProperty('race_tag', 'forged')
    announce('Forged race initialized.')
    return

// ══ CLASS INITS ══
init_class_ronin():
    Owner.Attribute('Class').set('Ronin')
    setAttr('Corrupted Resonance Signature', true)
    setAttr('Oath Status', 'Masterless')
    setAttr('Contract Target', '')
    path = text(Owner.Attribute('Ronin Path').value)
    if path == '':
        setAttr('Ronin Path', 'ascendant_blade')
    announce('Ronin initialized. Corrupted resonance signature active. Oath: Masterless.')
    return


init_class_ashfoot():
    Owner.Attribute('Class').set('Ashfoot')
    setAttr('Ashfoot Caste Tier', 'Low')
    setAttr('Enhancement Quality', 'salvage')
    path = text(Owner.Attribute('Ashfoot Path').value)
    if path == '':
        setAttr('Ashfoot Path', 'skirmish_specialist')
    announce('Ashfoot initialized. Caste: Low. Enhancement quality: salvage.')
    return


init_class_veilblade():
    Owner.Attribute('Class').set('Veilblade')
    setAttr('Resonant Signature State', 'suppressed')
    setAttr('Wire Integration Active', true)
    path = text(Owner.Attribute('Veilblade Path').value)
    if path == '':
        setAttr('Veilblade Path', 'shadow_operative')
    announce('Veilblade initialized. Resonance signature suppressed. Wire integration active.')
    return


init_class_oni_hunter():
    Owner.Attribute('Class').set('Oni Hunter')
    setAttr('Quarry Marked', false)
    setAttr('Dissolution Resonance', 0)
    path = text(Owner.Attribute('Oni Hunter Path').value)
    if path == '':
        setAttr('Oni Hunter Path', 'dissolution_specialist')
    Owner.setProperty('current_quarry_id', '')
    announce('Oni Hunter initialized. Quarry mark cleared.')
    return


init_class_forge_tender():
    Owner.Attribute('Class').set('Forge Tender')
    setAttr('Resonance Keepers Aligned', false)
    setAttr('Community Dependent', true)
    path = text(Owner.Attribute('Forge Tender Path').value)
    if path == '':
        setAttr('Forge Tender Path', 'resonance_keeper')
    Owner.setProperty('forge_mend_uses_short', '2')
    announce('Forge Tender initialized. Community Dependent active.')
    return


init_class_wireweave():
    Owner.Attribute('Class').set('Wireweave')
    path = text(Owner.Attribute('Wireweave Path').value)
    if path == '':
        setAttr('Wireweave Path', 'combat_weave')
    announce('Wireweave initialized.')
    return


init_class_chrome_shaper():
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


init_class_pulse_caller():
    Owner.Attribute('Class').set('Pulse Caller')
    setAttr('Integrated Weapon Active', true)
    setAttr('Preconscious Fire Active', false)
    path = text(Owner.Attribute('Pulse Caller Path').value)
    if path == '':
        setAttr('Pulse Caller Path', 'single_point')
    announce('Pulse Caller initialized. Integrated weapon active.')
    return


init_class_iron_monk():
    Owner.Attribute('Class').set('Iron Monk')
    setAttr('Between State Active', false)
    setAttr('Below Half HP Bonus Active', false)
    path = text(Owner.Attribute('Iron Monk Path').value)
    if path == '':
        setAttr('Iron Monk Path', 'orthodoxy')
    announce('Iron Monk initialized. Hand size 5 (smallest in system).')
    return


init_class_echo_speaker():
    Owner.Attribute('Class').set('Echo Speaker')
    setAttr('Afterlife Affinity', true)
    setAttr('Grief Stacks', 0)
    path = text(Owner.Attribute('Echo Speaker Path').value)
    if path == '':
        setAttr('Echo Speaker Path', 'sutensai_aligned')
    announce('Echo Speaker initialized. Afterlife affinity active. Grief stacks: 0.')
    return


init_class_void_walker():
    Owner.Attribute('Class').set('Void Walker')
    setAttr('Incorporeal State Active', false)
    setAttr('Anchor Points', 0)
    path = text(Owner.Attribute('Void Walker Path').value)
    if path == '':
        setAttr('Void Walker Path', 'ghost_operative')
    announce('Void Walker initialized. Incorporeal state inactive.')
    return


init_class_sutensai():
    Owner.Attribute('Class').set('Sutensai')
    setAttr('Reader Authority', true)
    setAttr('Echomind Reading Level', 1)
    setAttr('HP Cost Payment Enabled', true)
    path = text(Owner.Attribute('Sutensai Path').value)
    if path == '':
        setAttr('Sutensai Path', 'inquisitor')
    announce('Sutensai initialized. Reader authority active. HP cost cards enabled.')
    return


init_class_flesh_shaper():
    Owner.Attribute('Class').set('Flesh Shaper')
    setAttr('Flesh Shaper HP Tier', 'full')
    path = text(Owner.Attribute('Flesh Shaper Path').value)
    if path == '':
        setAttr('Flesh Shaper Path', 'the_mender')
    announce('Flesh Shaper initialized. HP tier tracking active.')
    return


init_class_puppet_binder():
    Owner.Attribute('Class').set('Puppet Binder')
    setAttr('Vessel Active', false)
    setAttr('Binding Threads', 0)
    path = text(Owner.Attribute('Puppet Binder Path').value)
    if path == '':
        setAttr('Puppet Binder Path', 'the_architect')
    Owner.setProperty('bound_target_ids', '')
    announce('Puppet Binder initialized. No active binds.')
    return


init_class_blood_smith():
    Owner.Attribute('Class').set('Blood Smith')
    setAttr('Enhancement Status', 'stable')
    path = text(Owner.Attribute('Blood Smith Path').value)
    if path == '':
        setAttr('Blood Smith Path', 'the_weaponsmith')
    announce('Blood Smith initialized. Enhancement status: stable.')
    return


init_class_the_hollow():
    Owner.Attribute('Class').set('The Hollow')
    path = text(Owner.Attribute('Hollow Path').value)
    if path == '' || path == 'none':
        setAttr('Hollow Path', 'the_empty')
    setAttr('Current HP Percent', 100)
    announce('The Hollow initialized. Path: ' + text(Owner.Attribute('Hollow Path').value))
    return


init_class_shadow_daimyo():
    Owner.Attribute('Class').set('Shadow Daimyo')
    setAttr('Intelligence Gathered', 0)
    setAttr('Active Contacts', 0)
    path = text(Owner.Attribute('Shadow Daimyo Path').value)
    if path == '':
        setAttr('Shadow Daimyo Path', 'spymaster')
    Owner.setProperty('intelligence_map', '')
    announce('Shadow Daimyo initialized. Intelligence: 0. Contacts: 0.')
    return


init_class_voice_of_debt():
    Owner.Attribute('Class').set('Voice of Debt')
    setAttr('Debt Detonations Used', 0)
    path = text(Owner.Attribute('Voice of Debt Path').value)
    if path == '':
        setAttr('Voice of Debt Path', 'oath_keeper')
    Owner.setProperty('debt_stacks_map', '')
    announce('Voice of Debt initialized. Detonation tracker cleared.')
    return


init_class_merchant_knife():
    Owner.Attribute('Class').set('Merchant Knife')
    path = text(Owner.Attribute('Merchant Knife Path').value)
    if path == '':
        setAttr('Merchant Knife Path', 'supply_cutter')
    Owner.setProperty('mk_intelligence_map', '')
    Owner.setProperty('mk_debt_map', '')
    announce('Merchant Knife initialized.')
    return


init_class_iron_herald():
    Owner.Attribute('Class').set('Iron Herald')
    setAttr('Command Zone Active', false)
    setAttr('Priority Target ID', '')
    setAttr('Command Zone Radius', 15)
    path = text(Owner.Attribute('Iron Herald Path').value)
    if path == '':
        setAttr('Iron Herald Path', 'warbanner')
    announce('Iron Herald initialized. Command Zone inactive.')
    return


init_class_curse_eater():
    Owner.Attribute('Class').set('Curse Eater')
    setAttr('Loaded Count', 0)
    setAttr('Corruption Points', 0)
    path = text(Owner.Attribute('Curse Eater Path').value)
    if path == '':
        setAttr('Curse Eater Path', 'purifier')
    announce('Curse Eater initialized. Loaded: 0. Corruption: 0.')
    return


init_class_shell_dancer():
    Owner.Attribute('Class').set('Shell Dancer')
    setAttr('Cascade Count', 0)
    setAttr('In Shell Step', false)
    setAttr('Shell Step Turns Remaining', 0)
    path = text(Owner.Attribute('Shell Dancer Path').value)
    if path == '':
        setAttr('Shell Dancer Path', 'the_breaker')
    announce('Shell Dancer initialized. Cascade: 0. Shell Step: inactive.')
    return


init_class_fracture_knight():
    Owner.Attribute('Class').set('Fracture Knight')
    setAttr('Phantom Charges', 2)
    setAttr('Fracture Stacks on Self', 0)
    path = text(Owner.Attribute('Fracture Knight Path').value)
    if path == '':
        setAttr('Fracture Knight Path', 'the_claimed')
    Owner.setProperty('fracture_target_map', '')
    announce('Fracture Knight initialized. Phantom Charges: 2.')
    return


init_class_the_unnamed():
    Owner.Attribute('Class').set('The Unnamed')
    setAttr('Active Stat', 'IRON')
    path = text(Owner.Attribute('Unnamed Path').value)
    if path == '' || path == 'none':
        setAttr('Unnamed Path', 'convergent')
    Owner.setProperty('named_cards_map', '')
    announce('The Unnamed initialized. Cards unlock through personal conditions. Define yourself.')
    return


init_class_ironclad_samurai():
    Owner.Attribute('Class').set('Ironclad Samurai')
    setAttr('Class Fantasy', 'philosopher_warrior_bound_code')
    announce('Ironclad Samurai initialized.')
    return

// ══ SUBCLASS INITS ══
init_sub_ironclad_samurai_oath_iron_lord():
    setAttr('Vein Path', 'Oath Iron Lord')
    Owner.setProperty('subclass_tag', 'ironclad_samurai_oath_iron_lord')
    announce('Ironclad Samurai — Oath Iron Lord path applied.')
    return

init_sub_ironclad_samurai_oath_sutensai_blade():
    setAttr('Vein Path', 'Oath Sutensai Blade')
    Owner.setProperty('subclass_tag', 'ironclad_samurai_oath_sutensai_blade')
    announce('Ironclad Samurai — Oath Sutensai Blade path applied.')
    return

init_sub_ironclad_samurai_oath_undying_debt():
    setAttr('Vein Path', 'Oath Undying Debt')
    Owner.setProperty('subclass_tag', 'ironclad_samurai_oath_undying_debt')
    announce('Ironclad Samurai — Oath Undying Debt path applied.')
    return

init_sub_ironclad_samurai_oath_flesh_temple():
    setAttr('Vein Path', 'Oath Flesh Temple')
    Owner.setProperty('subclass_tag', 'ironclad_samurai_oath_flesh_temple')
    announce('Ironclad Samurai — Oath Flesh Temple path applied.')
    return

init_sub_ronin_ascendant_blade():
    setAttr('Ronin Path', 'Ascendant Blade')
    Owner.setProperty('subclass_tag', 'ronin_ascendant_blade')
    announce('Ronin — Ascendant Blade path applied.')
    return

init_sub_ronin_iron_contract():
    setAttr('Ronin Path', 'Iron Contract')
    Owner.setProperty('subclass_tag', 'ronin_iron_contract')
    announce('Ronin — Iron Contract path applied.')
    return

init_sub_ronin_returning_blade():
    setAttr('Ronin Path', 'Returning Blade')
    Owner.setProperty('subclass_tag', 'ronin_returning_blade')
    announce('Ronin — Returning Blade path applied.')
    return

init_sub_ashfoot_skirmish_specialist():
    setAttr('Ashfoot Path', 'Skirmish Specialist')
    Owner.setProperty('subclass_tag', 'ashfoot_skirmish_specialist')
    announce('Ashfoot — Skirmish Specialist path applied.')
    return

init_sub_ashfoot_formation_anchor():
    setAttr('Ashfoot Path', 'Formation Anchor')
    Owner.setProperty('subclass_tag', 'ashfoot_formation_anchor')
    announce('Ashfoot — Formation Anchor path applied.')
    return

init_sub_ashfoot_salvage_innovator():
    setAttr('Ashfoot Path', 'Salvage Innovator')
    Owner.setProperty('subclass_tag', 'ashfoot_salvage_innovator')
    announce('Ashfoot — Salvage Innovator path applied.')
    return

init_sub_veilblade_shadow_operative():
    setAttr('Veilblade Path', 'Shadow Operative')
    Owner.setProperty('subclass_tag', 'veilblade_shadow_operative')
    announce('Veilblade — Shadow Operative path applied.')
    return

init_sub_veilblade_signal_cutter():
    setAttr('Veilblade Path', 'Signal Cutter')
    Owner.setProperty('subclass_tag', 'veilblade_signal_cutter')
    announce('Veilblade — Signal Cutter path applied.')
    return

init_sub_veilblade_ghost_archive():
    setAttr('Veilblade Path', 'Ghost Archive')
    Owner.setProperty('subclass_tag', 'veilblade_ghost_archive')
    announce('Veilblade — Ghost Archive path applied.')
    return

init_sub_oni_hunter_dissolution_specialist():
    setAttr('Oni Hunter Path', 'Dissolution Specialist')
    Owner.setProperty('subclass_tag', 'oni_hunter_dissolution_specialist')
    announce('Oni Hunter — Dissolution Specialist path applied.')
    return

init_sub_oni_hunter_afterlife_anchor():
    setAttr('Oni Hunter Path', 'Afterlife Anchor')
    Owner.setProperty('subclass_tag', 'oni_hunter_afterlife_anchor')
    announce('Oni Hunter — Afterlife Anchor path applied.')
    return

init_sub_oni_hunter_resonance_collector():
    setAttr('Oni Hunter Path', 'Resonance Collector')
    Owner.setProperty('subclass_tag', 'oni_hunter_resonance_collector')
    announce('Oni Hunter — Resonance Collector path applied.')
    return

init_sub_forge_tender_resonance_keeper():
    setAttr('Forge Tender Path', 'Resonance Keeper')
    Owner.setProperty('subclass_tag', 'forge_tender_resonance_keeper')
    announce('Forge Tender — Resonance Keeper path applied.')
    return

init_sub_forge_tender_black_smith():
    setAttr('Forge Tender Path', 'Black Smith')
    Owner.setProperty('subclass_tag', 'forge_tender_black_smith')
    announce('Forge Tender — Black Smith path applied.')
    return

init_sub_forge_tender_echomind_anchor():
    setAttr('Forge Tender Path', 'Echomind Anchor')
    Owner.setProperty('subclass_tag', 'forge_tender_echomind_anchor')
    announce('Forge Tender — Echomind Anchor path applied.')
    return

init_sub_wireweave_combat_weave():
    setAttr('Wireweave Path', 'Combat Weave')
    Owner.setProperty('subclass_tag', 'wireweave_combat_weave')
    announce('Wireweave — Combat Weave path applied.')
    return

init_sub_wireweave_wire_broker():
    setAttr('Wireweave Path', 'Wire Broker')
    Owner.setProperty('subclass_tag', 'wireweave_wire_broker')
    announce('Wireweave — Wire Broker path applied.')
    return

init_sub_wireweave_iron_afterlife_weave():
    setAttr('Wireweave Path', 'Iron Afterlife Weave')
    Owner.setProperty('subclass_tag', 'wireweave_iron_afterlife_weave')
    announce('Wireweave — Iron Afterlife Weave path applied.')
    return

init_sub_wireweave_loom_maker():
    setAttr('Wireweave Path', 'Loom Maker')
    Owner.setProperty('subclass_tag', 'wireweave_loom_maker')
    announce('Wireweave — Loom Maker path applied.')
    return

init_sub_chrome_shaper_war_shaper():
    setAttr('Chrome Shaper Path', 'War Shaper')
    Owner.setProperty('subclass_tag', 'chrome_shaper_war_shaper')
    announce('Chrome Shaper — War Shaper path applied.')
    return

init_sub_chrome_shaper_edge_builder():
    setAttr('Chrome Shaper Path', 'Edge Builder')
    Owner.setProperty('subclass_tag', 'chrome_shaper_edge_builder')
    announce('Chrome Shaper — Edge Builder path applied.')
    return

init_sub_chrome_shaper_resonance_sculptor():
    setAttr('Chrome Shaper Path', 'Resonance Sculptor')
    Owner.setProperty('subclass_tag', 'chrome_shaper_resonance_sculptor')
    announce('Chrome Shaper — Resonance Sculptor path applied.')
    return

init_sub_pulse_caller_single_point():
    setAttr('Pulse Caller Path', 'Single Point')
    Owner.setProperty('subclass_tag', 'pulse_caller_single_point')
    announce('Pulse Caller — Single Point path applied.')
    return

init_sub_pulse_caller_iron_suppressor():
    setAttr('Pulse Caller Path', 'Iron Suppressor')
    Owner.setProperty('subclass_tag', 'pulse_caller_iron_suppressor')
    announce('Pulse Caller — Iron Suppressor path applied.')
    return

init_sub_pulse_caller_resonant_shot():
    setAttr('Pulse Caller Path', 'Resonant Shot')
    Owner.setProperty('subclass_tag', 'pulse_caller_resonant_shot')
    announce('Pulse Caller — Resonant Shot path applied.')
    return

init_sub_iron_monk_orthodoxy():
    setAttr('Iron Monk Path', 'Orthodoxy')
    Owner.setProperty('subclass_tag', 'iron_monk_orthodoxy')
    announce('Iron Monk — Orthodoxy path applied.')
    return

init_sub_iron_monk_resonants():
    setAttr('Iron Monk Path', 'Resonants')
    Owner.setProperty('subclass_tag', 'iron_monk_resonants')
    announce('Iron Monk — Resonants path applied.')
    return

init_sub_iron_monk_flesh_circle():
    setAttr('Iron Monk Path', 'Flesh Circle')
    Owner.setProperty('subclass_tag', 'iron_monk_flesh_circle')
    announce('Iron Monk — Flesh Circle path applied.')
    return

init_sub_iron_monk_path_of_the_between():
    setAttr('Iron Monk Path', 'Path Of The Between')
    Owner.setProperty('subclass_tag', 'iron_monk_path_of_the_between')
    announce('Iron Monk — Path Of The Between path applied.')
    return

init_sub_echo_speaker_sutensai_aligned():
    setAttr('Echo Speaker Path', 'Sutensai Aligned')
    Owner.setProperty('subclass_tag', 'echo_speaker_sutensai_aligned')
    announce('Echo Speaker — Sutensai Aligned path applied.')
    return

init_sub_echo_speaker_deep_listener():
    setAttr('Echo Speaker Path', 'Deep Listener')
    Owner.setProperty('subclass_tag', 'echo_speaker_deep_listener')
    announce('Echo Speaker — Deep Listener path applied.')
    return

init_sub_echo_speaker_herald():
    setAttr('Echo Speaker Path', 'Herald')
    Owner.setProperty('subclass_tag', 'echo_speaker_herald')
    announce('Echo Speaker — Herald path applied.')
    return

init_sub_void_walker_ghost_operative():
    setAttr('Void Walker Path', 'Ghost Operative')
    Owner.setProperty('subclass_tag', 'void_walker_ghost_operative')
    announce('Void Walker — Ghost Operative path applied.')
    return

init_sub_void_walker_threshold_puller():
    setAttr('Void Walker Path', 'Threshold Puller')
    Owner.setProperty('subclass_tag', 'void_walker_threshold_puller')
    announce('Void Walker — Threshold Puller path applied.')
    return

init_sub_void_walker_anchor_keeper():
    setAttr('Void Walker Path', 'Anchor Keeper')
    Owner.setProperty('subclass_tag', 'void_walker_anchor_keeper')
    announce('Void Walker — Anchor Keeper path applied.')
    return

init_sub_sutensai_inquisitor():
    setAttr('Sutensai Path', 'Inquisitor')
    Owner.setProperty('subclass_tag', 'sutensai_inquisitor')
    announce('Sutensai — Inquisitor path applied.')
    return

init_sub_sutensai_archive_master():
    setAttr('Sutensai Path', 'Archive Master')
    Owner.setProperty('subclass_tag', 'sutensai_archive_master')
    announce('Sutensai — Archive Master path applied.')
    return

init_sub_sutensai_priors_voice():
    setAttr('Sutensai Path', 'Priors Voice')
    Owner.setProperty('subclass_tag', 'sutensai_priors_voice')
    announce('Sutensai — Priors Voice path applied.')
    return

init_sub_flesh_shaper_the_mender():
    setAttr('Flesh Shaper Path', 'The Mender')
    Owner.setProperty('subclass_tag', 'flesh_shaper_the_mender')
    announce('Flesh Shaper — The Mender path applied.')
    return

init_sub_flesh_shaper_the_corruptor():
    setAttr('Flesh Shaper Path', 'The Corruptor')
    Owner.setProperty('subclass_tag', 'flesh_shaper_the_corruptor')
    announce('Flesh Shaper — The Corruptor path applied.')
    return

init_sub_flesh_shaper_the_self_shaper():
    setAttr('Flesh Shaper Path', 'The Self Shaper')
    Owner.setProperty('subclass_tag', 'flesh_shaper_the_self_shaper')
    announce('Flesh Shaper — The Self Shaper path applied.')
    return

init_sub_puppet_binder_the_architect():
    setAttr('Puppet Binder Path', 'The Architect')
    Owner.setProperty('subclass_tag', 'puppet_binder_the_architect')
    announce('Puppet Binder — The Architect path applied.')
    return

init_sub_puppet_binder_the_possessor():
    setAttr('Puppet Binder Path', 'The Possessor')
    Owner.setProperty('subclass_tag', 'puppet_binder_the_possessor')
    announce('Puppet Binder — The Possessor path applied.')
    return

init_sub_puppet_binder_the_network():
    setAttr('Puppet Binder Path', 'The Network')
    Owner.setProperty('subclass_tag', 'puppet_binder_the_network')
    announce('Puppet Binder — The Network path applied.')
    return

init_sub_blood_smith_the_weaponsmith():
    setAttr('Blood Smith Path', 'The Weaponsmith')
    Owner.setProperty('subclass_tag', 'blood_smith_the_weaponsmith')
    announce('Blood Smith — The Weaponsmith path applied.')
    return

init_sub_blood_smith_the_armorer():
    setAttr('Blood Smith Path', 'The Armorer')
    Owner.setProperty('subclass_tag', 'blood_smith_the_armorer')
    announce('Blood Smith — The Armorer path applied.')
    return

init_sub_blood_smith_the_sculptor():
    setAttr('Blood Smith Path', 'The Sculptor')
    Owner.setProperty('subclass_tag', 'blood_smith_the_sculptor')
    announce('Blood Smith — The Sculptor path applied.')
    return

init_sub_the_hollow_the_empty():
    setAttr('Hollow Path', 'The Empty')
    Owner.setProperty('subclass_tag', 'the_hollow_the_empty')
    announce('The Hollow — The Empty path applied.')
    return

init_sub_the_hollow_the_shell():
    setAttr('Hollow Path', 'The Shell')
    Owner.setProperty('subclass_tag', 'the_hollow_the_shell')
    announce('The Hollow — The Shell path applied.')
    return

init_sub_shadow_daimyo_spymaster():
    setAttr('Shadow Daimyo Path', 'Spymaster')
    Owner.setProperty('subclass_tag', 'shadow_daimyo_spymaster')
    announce('Shadow Daimyo — Spymaster path applied.')
    return

init_sub_shadow_daimyo_court_blade():
    setAttr('Shadow Daimyo Path', 'Court Blade')
    Owner.setProperty('subclass_tag', 'shadow_daimyo_court_blade')
    announce('Shadow Daimyo — Court Blade path applied.')
    return

init_sub_shadow_daimyo_broker():
    setAttr('Shadow Daimyo Path', 'Broker')
    Owner.setProperty('subclass_tag', 'shadow_daimyo_broker')
    announce('Shadow Daimyo — Broker path applied.')
    return

init_sub_voice_of_debt_oath_keeper():
    setAttr('Voice of Debt Path', 'Oath Keeper')
    Owner.setProperty('subclass_tag', 'voice_of_debt_oath_keeper')
    announce('Voice of Debt — Oath Keeper path applied.')
    return

init_sub_voice_of_debt_debt_collector():
    setAttr('Voice of Debt Path', 'Debt Collector')
    Owner.setProperty('subclass_tag', 'voice_of_debt_debt_collector')
    announce('Voice of Debt — Debt Collector path applied.')
    return

init_sub_voice_of_debt_the_breaker():
    setAttr('Voice of Debt Path', 'The Breaker')
    Owner.setProperty('subclass_tag', 'voice_of_debt_the_breaker')
    announce('Voice of Debt — The Breaker path applied.')
    return

init_sub_merchant_knife_supply_cutter():
    setAttr('Merchant Knife Path', 'Supply Cutter')
    Owner.setProperty('subclass_tag', 'merchant_knife_supply_cutter')
    announce('Merchant Knife — Supply Cutter path applied.')
    return

init_sub_merchant_knife_gilded_blade():
    setAttr('Merchant Knife Path', 'Gilded Blade')
    Owner.setProperty('subclass_tag', 'merchant_knife_gilded_blade')
    announce('Merchant Knife — Gilded Blade path applied.')
    return

init_sub_merchant_knife_kingmaker():
    setAttr('Merchant Knife Path', 'Kingmaker')
    Owner.setProperty('subclass_tag', 'merchant_knife_kingmaker')
    announce('Merchant Knife — Kingmaker path applied.')
    return

init_sub_iron_herald_warbanner():
    setAttr('Iron Herald Path', 'Warbanner')
    Owner.setProperty('subclass_tag', 'iron_herald_warbanner')
    announce('Iron Herald — Warbanner path applied.')
    return

init_sub_iron_herald_neutral_tongue():
    setAttr('Iron Herald Path', 'Neutral Tongue')
    Owner.setProperty('subclass_tag', 'iron_herald_neutral_tongue')
    announce('Iron Herald — Neutral Tongue path applied.')
    return

init_sub_iron_herald_the_signal():
    setAttr('Iron Herald Path', 'The Signal')
    Owner.setProperty('subclass_tag', 'iron_herald_the_signal')
    announce('Iron Herald — The Signal path applied.')
    return

init_sub_curse_eater_purifier():
    setAttr('Curse Eater Path', 'Purifier')
    Owner.setProperty('subclass_tag', 'curse_eater_purifier')
    announce('Curse Eater — Purifier path applied.')
    return

init_sub_curse_eater_conduit():
    setAttr('Curse Eater Path', 'Conduit')
    Owner.setProperty('subclass_tag', 'curse_eater_conduit')
    announce('Curse Eater — Conduit path applied.')
    return

init_sub_curse_eater_the_consumed():
    setAttr('Curse Eater Path', 'The Consumed')
    Owner.setProperty('subclass_tag', 'curse_eater_the_consumed')
    announce('Curse Eater — The Consumed path applied.')
    return

init_sub_shell_dancer_the_breaker():
    setAttr('Shell Dancer Path', 'The Breaker')
    Owner.setProperty('subclass_tag', 'shell_dancer_the_breaker')
    announce('Shell Dancer — The Breaker path applied.')
    return

init_sub_shell_dancer_the_survivor():
    setAttr('Shell Dancer Path', 'The Survivor')
    Owner.setProperty('subclass_tag', 'shell_dancer_the_survivor')
    announce('Shell Dancer — The Survivor path applied.')
    return

init_sub_shell_dancer_the_scavenger():
    setAttr('Shell Dancer Path', 'The Scavenger')
    Owner.setProperty('subclass_tag', 'shell_dancer_the_scavenger')
    announce('Shell Dancer — The Scavenger path applied.')
    return

init_sub_fracture_knight_the_claimed():
    setAttr('Fracture Knight Path', 'The Claimed')
    Owner.setProperty('subclass_tag', 'fracture_knight_the_claimed')
    announce('Fracture Knight — The Claimed path applied.')
    return

init_sub_fracture_knight_haunted_legion():
    setAttr('Fracture Knight Path', 'Haunted Legion')
    Owner.setProperty('subclass_tag', 'fracture_knight_haunted_legion')
    announce('Fracture Knight — Haunted Legion path applied.')
    return

init_sub_fracture_knight_the_anchor():
    setAttr('Fracture Knight Path', 'The Anchor')
    Owner.setProperty('subclass_tag', 'fracture_knight_the_anchor')
    announce('Fracture Knight — The Anchor path applied.')
    return

init_sub_the_unnamed_convergent():
    setAttr('Unnamed Path', 'Convergent')
    Owner.setProperty('subclass_tag', 'the_unnamed_convergent')
    announce('The Unnamed — Convergent path applied.')
    return

init_sub_the_unnamed_divergent():
    setAttr('Unnamed Path', 'Divergent')
    Owner.setProperty('subclass_tag', 'the_unnamed_divergent')
    announce('The Unnamed — Divergent path applied.')
    return

// ══════════════════ DISPATCH ══════════════════
species = text(Owner.Attribute('Species').value)

if species == 'Forged':
    init_race_forged()
if species == 'Tethered':
    init_race_tethered()
if species == 'Echoed':
    init_race_echoed()
if species == 'Wireborn':
    init_race_wireborn()
if species == 'Stitched':
    init_race_stitched()
if species == 'Shellbroken':
    init_race_shellbroken()
if species == 'Iron Blessed':
    init_race_iron_blessed()
if species == 'Diminished':
    init_race_diminished()

className = text(Owner.Attribute('Class').value)

if className == 'Ironclad Samurai':
    init_class_ironclad_samurai()
if className == 'Ronin':
    init_class_ronin()
if className == 'Ashfoot':
    init_class_ashfoot()
if className == 'Veilblade':
    init_class_veilblade()
if className == 'Oni Hunter':
    init_class_oni_hunter()
if className == 'Forge Tender':
    init_class_forge_tender()
if className == 'Wireweave':
    init_class_wireweave()
if className == 'Chrome Shaper':
    init_class_chrome_shaper()
if className == 'Pulse Caller':
    init_class_pulse_caller()
if className == 'Iron Monk':
    init_class_iron_monk()
if className == 'Echo Speaker':
    init_class_echo_speaker()
if className == 'Void Walker':
    init_class_void_walker()
if className == 'Sutensai':
    init_class_sutensai()
if className == 'Flesh Shaper':
    init_class_flesh_shaper()
if className == 'Puppet Binder':
    init_class_puppet_binder()
if className == 'Blood Smith':
    init_class_blood_smith()
if className == 'The Hollow':
    init_class_the_hollow()
if className == 'Shadow Daimyo':
    init_class_shadow_daimyo()
if className == 'Voice of Debt':
    init_class_voice_of_debt()
if className == 'Merchant Knife':
    init_class_merchant_knife()
if className == 'Iron Herald':
    init_class_iron_herald()
if className == 'Curse Eater':
    init_class_curse_eater()
if className == 'Shell Dancer':
    init_class_shell_dancer()
if className == 'Fracture Knight':
    init_class_fracture_knight()
if className == 'The Unnamed':
    init_class_the_unnamed()

// Combined subclass dispatch — 'Class — Path' value
subclassSelection = text(Owner.Attribute('Subclass Selection').value)
if subclassSelection == 'Ironclad Samurai — Oath Iron Lord':
    init_sub_ironclad_samurai_oath_iron_lord()
if subclassSelection == 'Ironclad Samurai — Oath Sutensai Blade':
    init_sub_ironclad_samurai_oath_sutensai_blade()
if subclassSelection == 'Ironclad Samurai — Oath Undying Debt':
    init_sub_ironclad_samurai_oath_undying_debt()
if subclassSelection == 'Ironclad Samurai — Oath Flesh Temple':
    init_sub_ironclad_samurai_oath_flesh_temple()
if subclassSelection == 'Ronin — Ascendant Blade':
    init_sub_ronin_ascendant_blade()
if subclassSelection == 'Ronin — Iron Contract':
    init_sub_ronin_iron_contract()
if subclassSelection == 'Ronin — Returning Blade':
    init_sub_ronin_returning_blade()
if subclassSelection == 'Ashfoot — Skirmish Specialist':
    init_sub_ashfoot_skirmish_specialist()
if subclassSelection == 'Ashfoot — Formation Anchor':
    init_sub_ashfoot_formation_anchor()
if subclassSelection == 'Ashfoot — Salvage Innovator':
    init_sub_ashfoot_salvage_innovator()
if subclassSelection == 'Veilblade — Shadow Operative':
    init_sub_veilblade_shadow_operative()
if subclassSelection == 'Veilblade — Signal Cutter':
    init_sub_veilblade_signal_cutter()
if subclassSelection == 'Veilblade — Ghost Archive':
    init_sub_veilblade_ghost_archive()
if subclassSelection == 'Oni Hunter — Dissolution Specialist':
    init_sub_oni_hunter_dissolution_specialist()
if subclassSelection == 'Oni Hunter — Afterlife Anchor':
    init_sub_oni_hunter_afterlife_anchor()
if subclassSelection == 'Oni Hunter — Resonance Collector':
    init_sub_oni_hunter_resonance_collector()
if subclassSelection == 'Forge Tender — Resonance Keeper':
    init_sub_forge_tender_resonance_keeper()
if subclassSelection == 'Forge Tender — Black Smith':
    init_sub_forge_tender_black_smith()
if subclassSelection == 'Forge Tender — Echomind Anchor':
    init_sub_forge_tender_echomind_anchor()
if subclassSelection == 'Wireweave — Combat Weave':
    init_sub_wireweave_combat_weave()
if subclassSelection == 'Wireweave — Wire Broker':
    init_sub_wireweave_wire_broker()
if subclassSelection == 'Wireweave — Iron Afterlife Weave':
    init_sub_wireweave_iron_afterlife_weave()
if subclassSelection == 'Wireweave — Loom Maker':
    init_sub_wireweave_loom_maker()
if subclassSelection == 'Chrome Shaper — War Shaper':
    init_sub_chrome_shaper_war_shaper()
if subclassSelection == 'Chrome Shaper — Edge Builder':
    init_sub_chrome_shaper_edge_builder()
if subclassSelection == 'Chrome Shaper — Resonance Sculptor':
    init_sub_chrome_shaper_resonance_sculptor()
if subclassSelection == 'Pulse Caller — Single Point':
    init_sub_pulse_caller_single_point()
if subclassSelection == 'Pulse Caller — Iron Suppressor':
    init_sub_pulse_caller_iron_suppressor()
if subclassSelection == 'Pulse Caller — Resonant Shot':
    init_sub_pulse_caller_resonant_shot()
if subclassSelection == 'Iron Monk — Orthodoxy':
    init_sub_iron_monk_orthodoxy()
if subclassSelection == 'Iron Monk — Resonants':
    init_sub_iron_monk_resonants()
if subclassSelection == 'Iron Monk — Flesh Circle':
    init_sub_iron_monk_flesh_circle()
if subclassSelection == 'Iron Monk — Path Of The Between':
    init_sub_iron_monk_path_of_the_between()
if subclassSelection == 'Echo Speaker — Sutensai Aligned':
    init_sub_echo_speaker_sutensai_aligned()
if subclassSelection == 'Echo Speaker — Deep Listener':
    init_sub_echo_speaker_deep_listener()
if subclassSelection == 'Echo Speaker — Herald':
    init_sub_echo_speaker_herald()
if subclassSelection == 'Void Walker — Ghost Operative':
    init_sub_void_walker_ghost_operative()
if subclassSelection == 'Void Walker — Threshold Puller':
    init_sub_void_walker_threshold_puller()
if subclassSelection == 'Void Walker — Anchor Keeper':
    init_sub_void_walker_anchor_keeper()
if subclassSelection == 'Sutensai — Inquisitor':
    init_sub_sutensai_inquisitor()
if subclassSelection == 'Sutensai — Archive Master':
    init_sub_sutensai_archive_master()
if subclassSelection == 'Sutensai — Priors Voice':
    init_sub_sutensai_priors_voice()
if subclassSelection == 'Flesh Shaper — The Mender':
    init_sub_flesh_shaper_the_mender()
if subclassSelection == 'Flesh Shaper — The Corruptor':
    init_sub_flesh_shaper_the_corruptor()
if subclassSelection == 'Flesh Shaper — The Self Shaper':
    init_sub_flesh_shaper_the_self_shaper()
if subclassSelection == 'Puppet Binder — The Architect':
    init_sub_puppet_binder_the_architect()
if subclassSelection == 'Puppet Binder — The Possessor':
    init_sub_puppet_binder_the_possessor()
if subclassSelection == 'Puppet Binder — The Network':
    init_sub_puppet_binder_the_network()
if subclassSelection == 'Blood Smith — The Weaponsmith':
    init_sub_blood_smith_the_weaponsmith()
if subclassSelection == 'Blood Smith — The Armorer':
    init_sub_blood_smith_the_armorer()
if subclassSelection == 'Blood Smith — The Sculptor':
    init_sub_blood_smith_the_sculptor()
if subclassSelection == 'The Hollow — The Empty':
    init_sub_the_hollow_the_empty()
if subclassSelection == 'The Hollow — The Shell':
    init_sub_the_hollow_the_shell()
if subclassSelection == 'Shadow Daimyo — Spymaster':
    init_sub_shadow_daimyo_spymaster()
if subclassSelection == 'Shadow Daimyo — Court Blade':
    init_sub_shadow_daimyo_court_blade()
if subclassSelection == 'Shadow Daimyo — Broker':
    init_sub_shadow_daimyo_broker()
if subclassSelection == 'Voice of Debt — Oath Keeper':
    init_sub_voice_of_debt_oath_keeper()
if subclassSelection == 'Voice of Debt — Debt Collector':
    init_sub_voice_of_debt_debt_collector()
if subclassSelection == 'Voice of Debt — The Breaker':
    init_sub_voice_of_debt_the_breaker()
if subclassSelection == 'Merchant Knife — Supply Cutter':
    init_sub_merchant_knife_supply_cutter()
if subclassSelection == 'Merchant Knife — Gilded Blade':
    init_sub_merchant_knife_gilded_blade()
if subclassSelection == 'Merchant Knife — Kingmaker':
    init_sub_merchant_knife_kingmaker()
if subclassSelection == 'Iron Herald — Warbanner':
    init_sub_iron_herald_warbanner()
if subclassSelection == 'Iron Herald — Neutral Tongue':
    init_sub_iron_herald_neutral_tongue()
if subclassSelection == 'Iron Herald — The Signal':
    init_sub_iron_herald_the_signal()
if subclassSelection == 'Curse Eater — Purifier':
    init_sub_curse_eater_purifier()
if subclassSelection == 'Curse Eater — Conduit':
    init_sub_curse_eater_conduit()
if subclassSelection == 'Curse Eater — The Consumed':
    init_sub_curse_eater_the_consumed()
if subclassSelection == 'Shell Dancer — The Breaker':
    init_sub_shell_dancer_the_breaker()
if subclassSelection == 'Shell Dancer — The Survivor':
    init_sub_shell_dancer_the_survivor()
if subclassSelection == 'Shell Dancer — The Scavenger':
    init_sub_shell_dancer_the_scavenger()
if subclassSelection == 'Fracture Knight — The Claimed':
    init_sub_fracture_knight_the_claimed()
if subclassSelection == 'Fracture Knight — Haunted Legion':
    init_sub_fracture_knight_haunted_legion()
if subclassSelection == 'Fracture Knight — The Anchor':
    init_sub_fracture_knight_the_anchor()
if subclassSelection == 'The Unnamed — Convergent':
    init_sub_the_unnamed_convergent()
if subclassSelection == 'The Unnamed — Divergent':
    init_sub_the_unnamed_divergent()
