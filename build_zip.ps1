$base    = 'c:\Users\nroberts\TechnoNinja\FullQuestboundReadyToZip'
$rid     = '4244b851-579a-4e85-b8e5-2932326df9ed'
$ts      = '2026-04-02T18:10:45.240Z'
$enc     = [System.Text.UTF8Encoding]::new($false)
$charts  = "$base\charts"
$appdata = "$base\application data"

New-Item -ItemType Directory -Path $charts -Force | Out-Null

function WC($id, $title, $rows) {
    $safe = ($title.ToLower() -replace '[^a-z0-9]+','_').Trim('_')
    $file = "$charts\${safe}_{${id}}.tsv"
    $content = ($rows | ForEach-Object { $_ -join "`t" }) -join "`n"
    [IO.File]::WriteAllText($file, $content, $enc)
    Write-Host "  chart: $title"
}

# ── CHARTS ──────────────────────────────────────────────────────────────────

WC 'chart_card_action_schema' 'Card Action Schema' @(
    ,@('field','description')
    ,@('card_id','Unique identifier for the action card (e.g. act_class_ronin_blade_flash)')
    ,@('title','Display name shown on the card in-game')
    ,@('ap_cost','AP required to play; 0 = free')
    ,@('play_limit_per_turn','Max times per turn; 1 = once, 0 = unlimited')
    ,@('is_basic_attack','true if classified as basic attack; limits to once per turn')
    ,@('resolution_type','Effect category: attack / defense / utility / status / mobility')
)

WC 'chart_resolution_types' 'Resolution Types' @(
    ,@('key','description')
    ,@('attack','Deals direct damage or forces a contested roll against a target')
    ,@('defense','Mitigates or negates incoming damage; applies defensive buffs')
    ,@('utility','Non-combat or mixed-use effects including movement and setup')
    ,@('status','Applies or manipulates status conditions on targets or self')
    ,@('mobility','Repositions the user or alters engagement range')
)

WC 'chart_turn_sequence' 'Turn Sequence' @(
    ,@('step','script_hook')
    ,@('start_turn','beginTurn()')
    ,@('play_card','runCard(actionKey, apCost, isBasicAttack)')
    ,@('end_turn','endTurnLock()')
)

WC 'chart_forged_heritage_options' 'Forged Heritage Options' @(
    ,@('key','name','asi_bonus','notes')
    ,@('ironhold','Ironhold','CON +1, STR +1','Martial heritage; heavy chassis, oath-mark tradition')
    ,@('wire_market','Wire Market','INT +1, DEX +1','Tech-mercantile heritage; lightweight frame, signal-dense implants')
    ,@('ashlands','Ashlands','CON +1, DEX +1, WIS +1','Survivor heritage; field-repaired chassis, mixed provenance')
    ,@('unaligned','Unaligned','+1 to two different scores','No institutional origin; self-assembled or black-market chassis')
)

WC 'chart_forged_augmentation_options' 'Forged Augmentation Options' @(
    ,@('key','name','effect_summary','requires_level')
    ,@('reinforced_limb','Reinforced Limb Module','Raise unarmed die to 1d6; bonus to Athletics','1')
    ,@('optical_suite','Optical Targeting Suite','+1 to ranged attack rolls; ignore partial cover','1')
    ,@('vox_modulator','Vox Modulator','Advantage on Persuasion and Deception via voice','1')
    ,@('subdermal_plating','Subdermal Plating','+1 AC; lose Stealth advantage; resistance to slashing','3')
    ,@('neural_accelerator','Neural Accelerator','+1 Initiative; once per short rest reroll one skill check','5')
    ,@('intake_filter','Environmental Intake Filter','Immunity to inhaled hazards; advantage on CON saves vs environment','3')
    ,@('hydraulic_frame','Hydraulic Frame Upgrade','+1 STR modifier for carry capacity and Athletics; heavy lift','5')
)

WC 'chart_maintenance_states' 'Maintenance States' @(
    ,@('key','label','mechanical_effect')
    ,@('serviced','Serviced','No penalties; full chassis performance')
    ,@('degraded','Degraded','-1 to all physical ability checks until long rest maintenance is completed')
)

WC 'chart_ironclad_level_progression' 'Ironclad Level Progression' @(
    ,@('level','feature_ids','notes')
    ,@('1','oath_bond, vein_access','Gain Vein Path and initial Oath; unlock starting hand')
    ,@('2','fracture_threshold_1','First Fracture threshold; oath-break consequence active')
    ,@('3','vein_tier_1','Vein Path tier 1 abilities unlocked')
    ,@('4','oath_reinforcement','Oath bond deepens; secondary oath benefit activates')
    ,@('5','fracture_threshold_2','Second Fracture threshold; expanded consequence table')
    ,@('6','vein_tier_2','Vein Path tier 2 abilities unlocked')
    ,@('7','sustained_resonance','Passive resonance aura; radius 10 ft')
    ,@('8','oath_test_1','First Oath Test event unlocks campaign beat')
    ,@('9','fracture_threshold_3','Third Fracture threshold; transformation risk present')
    ,@('10','vein_tier_3','Vein Path tier 3; signature card unlocked')
    ,@('11','resonance_amplify','Resonance aura radius increases to 20 ft')
    ,@('12','oath_bond_deep','Deep bond; party-wide oath-support passive')
    ,@('13','fracture_threshold_4','Fourth threshold; fracture-as-power mechanic available')
    ,@('14','vein_tier_4','Vein Path tier 4; capstone card available')
    ,@('15','oath_test_2','Second Oath Test; claimant acknowledgment event')
    ,@('16','resonance_burst','Once per long rest: resonance burst (30 ft area)')
    ,@('17','fracture_mastery','Fracture no longer ends Vein access; redirect mechanic')
    ,@('18','vein_ascendant','Vein Path ascendant form unlocked')
    ,@('19','oath_culmination','Final Oath event; choose fulfillment or fracture path')
    ,@('20','convergence_ready','Convergence-tier power; campaign endgame card available')
)

WC 'chart_ironclad_vein_oaths' 'Vein Oaths' @(
    ,@('key','name','fracture_violation_example')
    ,@('loyalty','Oath of Loyalty','Betraying or abandoning a sworn ward or ally in direct peril')
    ,@('restraint','Oath of Restraint','Using lethal force against a surrendered or defenseless enemy')
    ,@('sacrifice','Oath of Sacrifice','Choosing self-preservation over lives of sworn charges')
    ,@('clarity','Oath of Clarity','Deceiving those you have sworn to serve or protect')
)

WC 'chart_ironclad_vein_path_options' 'Vein Path Options' @(
    ,@('key','name','theme')
    ,@('oath_iron_lord','Oath of the Iron Lord','Ward-protection and fealty; defensive auras and ally shields')
    ,@('oath_sutensai_blade','Oath of the Sutensai Blade','Theology enforcement; rite mechanics and consecration effects')
    ,@('oath_undying_debt','Oath of the Undying Debt','Vengeance and memory; target-marked escalation damage')
    ,@('oath_flesh_temple','Oath of the Flesh Temple','Combat as worship; form-based transformations and pain thresholds')
)

WC 'chart_ironclad_starting_gear' 'Ironclad Starting Gear' @(
    ,@('item_id','quantity','notes')
    ,@('item_ironclad_resonant_blade','1','Primary weapon; resonance-charged edge')
    ,@('item_ironclad_armor_choice','1','Choose one: plated chassis or reinforced frame')
    ,@('item_voidsteel_tanto','1','Secondary sidearm; concealed carry legal in most Reaches')
    ,@('item_ironclad_oath_mark','1','Oath seal; required for Vein Path mechanics')
    ,@('item_basic_maintenance_kit','1','Long rest maintenance tool; prevents degraded state')
    ,@('item_trade_metal','3','Standard currency; 3 units')
)

WC 'chart_monster_ap_by_tier' 'Monster AP by Tier' @(
    ,@('tier','ap_max_default')
    ,@('minion','1')
    ,@('standard','2')
    ,@('elite','3')
    ,@('boss','4')
)

WC 'chart_monster_role_card_weights' 'Monster Role Card Weights' @(
    ,@('role','attack_weight','defense_weight','control_weight','sustain_weight')
    ,@('skirmisher','3','1','2','0')
    ,@('brute','4','1','1','0')
    ,@('controller','1','1','4','0')
    ,@('support','1','2','1','3')
    ,@('boss','3','2','2','1')
)

WC 'chart_monster_turn_priority' 'Monster Turn Priority' @(
    ,@('priority','condition','card_type')
    ,@('1','Target at or below 20% HP','finisher')
    ,@('2','Self below 30% HP and mobility available','mobility')
    ,@('3','No control applied this round','control')
    ,@('4','Default action','attack')
    ,@('5','Ally needs sustain and support available','sustain')
)

WC 'chart_monster_card_tags' 'Monster Card Tags' @(
    ,@('tag','description')
    ,@('attack','Deals damage or forces a contested roll')
    ,@('defense','Reduces incoming damage or applies defensive buff')
    ,@('control','Applies status conditions or limits target actions')
    ,@('mobility','Repositions the monster or alters threat range')
    ,@('sustain','Heals the monster or a nearby ally')
    ,@('finisher','High-damage execution; prioritized against weakened targets')
    ,@('reaction','Triggers off incoming player action; interrupts or counters')
)

WC 'chart_status_catalog' 'Status Catalog' @(
    ,@('status_id','name','type','default_duration','max_stacks','stack_rule','summary')
    ,@('st_guard','Guard','defensive_buff','1','5','add','Reduce incoming damage by Guard Value per stack; decrement at turn end')
    ,@('st_fortify','Fortify','defensive_buff','2','3','refresh','Reduce potency of incoming control effects while active')
    ,@('st_expose','Expose','offensive_debuff','2','5','add','Increase incoming damage by Expose Value per stack')
    ,@('st_stagger','Stagger','offensive_debuff','1','1','refresh','Unit cannot play power cards this turn')
    ,@('st_bleed','Bleed','damage_over_time','2','5','add','Take fixed damage at end of turn per stack')
    ,@('st_burn','Burn','damage_over_time','2','5','add','Take fixed damage at turn end; removes one Guard stack before damage')
    ,@('st_overheat','Overheat','resource_pressure','3','6','add','Reduce AP max by 1 at threshold; clears below threshold')
    ,@('st_mark','Mark','tactical_debuff','2','1','refresh','Mark-synergy cards deal bonus effects against this target')
    ,@('st_root','Root','mobility_lock','1','1','refresh','Unit cannot reposition via mobility cards')
    ,@('st_silence','Silence','casting_lock','1','1','refresh','Unit cannot play utility or control card categories')
    ,@('st_veil','Veil','defensive_buff','1','1','refresh','First incoming hostile card this turn loses bonus riders')
    ,@('st_taunt','Taunt','aggro_control','1','1','refresh','Unit must target taunt source when possible')
    ,@('st_vulnerable','Vulnerable','offensive_debuff','1','3','add','Increase final damage multiplier by fixed step per stack')
    ,@('st_regen','Regeneration','sustain_buff','2','3','add','Recover fixed HP at start of turn per stack')
    ,@('st_shielded','Shielded','defensive_buff','2','1','refresh','Temporary shield pool consumed before HP damage')
)

WC 'chart_status_timing' 'Status Timing Rules' @(
    ,@('timing_key','description')
    ,@('on_apply','Fires immediately when status is applied to a unit')
    ,@('on_turn_start','Fires at the beginning of the afflicted unit''s turn')
    ,@('on_turn_end','Fires at end of turn; used by Bleed, Burn, Guard decrement')
    ,@('on_hit','Fires when this unit deals damage to another')
    ,@('on_damaged','Fires when this unit receives damage')
    ,@('on_card_play','Fires when this unit plays any card')
    ,@('on_expire','Fires when duration reaches zero and status is removed')
)

WC 'chart_status_dispel_groups' 'Status Dispel Groups' @(
    ,@('group_id','members')
    ,@('defensive_buffs','Guard, Fortify, Veil, Shielded, Regeneration')
    ,@('offensive_debuffs','Expose, Stagger, Mark, Taunt, Vulnerable, Bleed, Burn')
    ,@('mobility_locks','Root, Silence')
    ,@('resource_pressure','Overheat')
)

WC 'chart_races_overview' 'All Races - Overview' @(
    ,@('race','primary_stats','hand_size','hp_mod_tier','passive_count','card_count','subtype')
    ,@('Forged','STR/CON or INT/DEX or CON/DEX/WIS','Standard','Medium','3','3','4 heritage variants')
    ,@('Tethered','CON/WIS','Standard','High','4','2','None')
    ,@('Echoed','CHA/WIS','Standard','Low','4','2','None')
    ,@('Wireborn','INT/DEX','Standard','Medium','3','2','None')
    ,@('Stitched','Varies (Component A+B)','Standard','Medium','5','2','None')
    ,@('Shellbroken','WIS/CHA','Standard','Low','4','2','None')
    ,@('Iron Blessed','CHA/CON','Standard +1 or -1','Medium','6','2','Tended or Unregistered')
    ,@('Diminished','DEX/WIS','Standard +2','Low','5','2','None')
)

WC 'chart_classes_overview' 'All Classes - Overview' @(
    ,@('class','primary_stats','hand_size','hp_mod','subclass_count','subclass_names')
    ,@('Ironclad','STR/CHA','Standard','High','4','Iron Lord, Sutensai Blade, Undying Debt, Flesh Temple')
    ,@('Ronin','STR/DEX','Standard','Medium','2','Ascendant Blade, Shadow Wanderer')
    ,@('Ashfoot','DEX/CON','Standard','Low','2','Skirmish Specialist, Salvage Seeker')
    ,@('Veilblade','DEX/CHA','-1','Medium','2','Shadow Operative, Wire Ghost')
    ,@('Oni Hunter','STR/WIS','Standard','Medium','2','Dissolution Specialist, Prey Reader')
    ,@('Forge Tender','CON/WIS','Standard','High','2','Resonance Keeper, Rebuild Saint')
    ,@('Wireweave','INT/DEX','Standard','Medium','2','Combat Weave, Signal Loom')
    ,@('Chrome Shaper','INT/CON','Standard','Medium','2','War Shaper, Forge Genius')
    ,@('Pulse Caller','INT/DEX','Standard','Low','2','Single Point, Scatter Pulse')
    ,@('Iron Monk','STR/WIS','-2 (hand 5)','High','2','Orthodoxy, Between Form')
    ,@('Echo Speaker','CHA/WIS','Standard','Medium','2','Sutensai Aligned, Grief Conductor')
    ,@('Void Walker','DEX/INT','Standard','Low','2','Ghost Operative, Phase Anchor')
    ,@('Sutensai','INT/CHA','Standard','Low','2','Inquisitor, Truth Seeker')
    ,@('Flesh Shaper','CON/WIS','Standard','High','2','The Mender, Flesh Architect')
    ,@('Puppet Binder','INT/CHA','Standard','Medium','2','The Architect, Thread Cutter')
    ,@('Blood Smith','STR/CON','Standard','Medium','2','The Weaponsmith, Iron Ritual')
    ,@('The Hollow','CON/WIS','Standard','High','2','The Empty, Resonant Void')
    ,@('Shadow Daimyo','INT/CHA','Standard','Low','2','Spymaster, Ghost Network')
    ,@('Voice of Debt','CHA/WIS','Standard','Medium','2','Oath Keeper, Debt Lord')
    ,@('Merchant Knife','DEX/INT','Standard','Medium','2','Supply Cutter, Trade War')
    ,@('Iron Herald','STR/CHA','Standard','High','2','Warbanner, Iron Preacher')
    ,@('Curse Eater','CON/WIS','Standard','Medium','2','Purifier, Consumed')
    ,@('Shell Dancer','DEX/CON','Standard','Medium','2','The Breaker, Echo Step')
    ,@('Fracture Knight','STR/INT','Standard','Medium','2','The Claimed, Phantom Forge')
    ,@('The Unnamed','Any (Active Stat)','Standard','Medium','0','None (self-defined)')
)

WC 'chart_ap_cost_reference' 'AP Cost Reference' @(
    ,@('ap_cost','tier_name','typical_power','examples')
    ,@('0','Free','Basic attack or passive trigger','Basic Attack, on_add initialize, passive racial')
    ,@('1','Standard','Core class ability','Most class signature cards, status applications')
    ,@('2','Significant','Empowered or multi-effect','Enhanced attacks, dual-status cards, form shifts')
    ,@('3','Major','Signature or capstone','Class capstone cards, Convergence-tier abilities')
)

WC 'chart_keyword_glossary' 'Keyword Glossary' @(
    ,@('keyword','type','effect_summary','stacking_rule')
    ,@('Guard','defensive_buff','Reduce incoming damage by Guard Value per stack','Add; max 5')
    ,@('Fortify','defensive_buff','Reduce control effect potency while active','Refresh; max 3')
    ,@('Expose','offensive_debuff','Increase incoming damage per stack','Add; max 5')
    ,@('Stagger','offensive_debuff','Target cannot play power cards this turn','Refresh; max 1')
    ,@('Bleed','damage_over_time','Deal fixed damage at turn end per stack','Add; max 5')
    ,@('Burn','damage_over_time','Deal fixed damage at turn end; removes Guard first','Add; max 5')
    ,@('Overheat','resource_pressure','Reduce AP max at threshold stacks','Add; max 6')
    ,@('Mark','tactical_debuff','Enable mark-synergy bonus effects against this target','Refresh; max 1')
    ,@('Root','mobility_lock','Prevent mobility card repositioning','Refresh; max 1')
    ,@('Silence','casting_lock','Prevent utility and control card play','Refresh; max 1')
    ,@('Regen','sustain_buff','Recover HP at turn start per stack','Add; max 3')
    ,@('Shield','defensive_buff','Absorb damage before HP; temporary pool','Refresh pool; max 1')
    ,@('Vulnerable','offensive_debuff','Increase final damage multiplier per stack','Add; max 3')
    ,@('Pierce','passive_modifier','Ignore Guard or Shield value when dealing damage','Not stackable')
    ,@('Veil','defensive_buff','Negate bonus riders on first incoming hostile card','Refresh; max 1')
    ,@('Taunt','aggro_control','Force attacker to prioritize this target','Refresh; max 1')
    ,@('Echo','card_modifier','Repeat a card base effect once without riders','Triggered; not stacked')
    ,@('Cascade','class_resource','Shell Dancer charge pool; generates on incoming damage','Add; max 10')
    ,@('Debt','class_resource','Voice of Debt stack on target; detonates for bonus damage','Add; no cap')
    ,@('Loaded','class_resource','Curse Eater absorbed debuff stack; spent on purge','Add; no cap')
    ,@('Fracture','class_resource','Fracture Knight stack on target or self','Add; max 5')
    ,@('Phantom','class_resource','Fracture Knight charge pool; spent for phantom strikes','Add; max 6')
)

WC 'chart_caste_system' 'Caste System Reference' @(
    ,@('caste','label','enhancement_access','social_context','example_professions')
    ,@('Resonant','The Resonant','Full legal access; Orthodoxy-registered','Highest institutional caste; Sutensai-aligned','Ironclad officers, Sutensai priests, resonance engineers')
    ,@('Craftbound','The Craftbound','Licensed access via guild registration','Skilled labor caste; guild-protected','Wire Market traders, Forge Tenders, Chrome Shapers')
    ,@('Ironblood','The Ironblood','Military-issue only; no civilian augmentation','Soldier caste; Korrath-aligned','Pulse Callers, Iron Monks, Iron Heralds')
    ,@('Ashwalker','The Ashwalker','Black market or self-sourced only','Fringe caste; outside institutional reach','Ronin, Ashfoot, Void Walkers')
    ,@('Voided','The Voided','None legally recognized; outlawed enhancement','Outcast status; no Reach protection','Shellbroken, unregistered Iron Blessed, exile Ironclad')
)

WC 'chart_faction_matrix' 'Faction Matrix' @(
    ,@('faction','leader','territory','primary_goal','conflict_with','notes')
    ,@('Korrath','Korrath the Unbroken','Sunder Reach','Ascend as God-Claimant; remake Tesshari under iron law','Iron Sutra, Vaen','Largest military force; uses Ironblood caste as instrument')
    ,@('Vaen','Vaen of the Empty Hand','Veilward Reach','Complete the Pilgrimage; reach the Gap through surrender of self','Korrath, Iron Sutra','Hollow Author-favored; most enigmatic claimant; minimal army')
    ,@('Hollow Author','Unknown','No fixed territory (network)','Infiltrate all factions; control the outcome of Convergence','All claimants','True identity unknown; operates through proxies; may be multiple entities')
    ,@('Iron Sutra','High Inquisitor (unnamed)','Pale Reach (partial)','Maintain orthodoxy; prevent unregistered ascension','Korrath, Hollow Author','Sutensai institutional arm; controls legal enhancement access')
    ,@('Wire Market','Guild Master Harren','Pale Reach (commercial)','Profit from Convergence; sell to all sides','None permanently','Neutral mercantile power; will shift allegiance for advantage')
    ,@('Pilgrimage','Vaen (symbolic)','Veilward Reach / mobile','Follow Vaen to the Gap; survive Convergence as witnesses','Korrath military','Loose coalition; many Shellbroken and Echoed followers')
    ,@('Sutensai Order','Chars Voice (presumed)','Iron Teeth Reach (temple)','Preserve the Sutensai revelation; choose correct Claimant','Hollow Author','Theocratic faction; controls resonance orthodoxy certification')
)

WC 'chart_claimant_reference' 'Claimant Reference' @(
    ,@('claimant','true_nature','public_face','key_relic','campaign_threat')
    ,@('Korrath the Unbroken','Prior-cycle Ironclad who survived Fracture and emerged changed; not fully human','Warlord-king uniting the Reaches under iron law','The Unbroken Blade (resonance-anchored; cannot be dropped or stolen)','Military conquest; will sacrifice any number of Forged to achieve ascension')
    ,@('Vaen of the Empty Hand','A Diminished who has partially crossed into the Gap and returned','Wandering ascetic leading a pilgrimage to the edge of existence','The Empty Hand (literal missing limb; the absence is the relic)','Pulls followers toward dissolution; Convergence may unmake the world if Vaen succeeds')
    ,@('The Hollow Author','Unknown; possibly a distributed resonance entity spanning multiple hosts','Never appears directly; known only through proxies and forged documents','The Manuscript (a living document that rewrites itself; origin unknown)','Information warfare; may have already compromised key NPCs or player characters')
)

WC 'chart_reach_overview' 'Broken Reaches Overview' @(
    ,@('reach','dominant_faction','caste_balance','key_locations','encounter_flavor')
    ,@('Sunder','Korrath','Ironblood-heavy; Ashwalker suppressed','Cinderfort, Engine Scar','Military patrols, conscription pressure, Fracture-scarred terrain')
    ,@('Veilward','Vaen / Pilgrimage','Mixed; many Voided welcomed','Shore of Last Words, Ruined Citadel','Philosophical encounters, dissolution phenomena, Echoed communities')
    ,@('Pale','Wire Market / Iron Sutra','Craftbound-dominant','Preparation Halls, Deep Temple','Commerce encounters, orthodoxy inspections, information brokers')
    ,@('Iron Teeth','Sutensai Order','Resonant-dominated','Iron Teeth Temple complex','Theological challenges, resonance tests, Ironclad patrols')
    ,@('Ash River','None dominant','Ashwalker and Voided majority','Ash River camps, makeshift settlements','Survival encounters, faction recruiters, desperate communities')
)

WC 'chart_encounter_sunder_reach' 'Encounter Table - Sunder Reach' @(
    ,@('roll','type','description')
    ,@('1','Military patrol','Korrath conscription squad checks papers; demands proof of caste registration')
    ,@('2','Fracture scarring','Party encounters unstable resonance zone; exposure risk or navigation challenge')
    ,@('3','Deserter','Ironblood soldier seeks passage out of Sunder; has intel but is being pursued')
    ,@('4','Ambush','Ashwalker resistance cell mistakes party for Korrath agents')
    ,@('5','Supply convoy','Korrath war supplies moving through; opportunity for theft or intelligence')
    ,@('6','Broken Forged','Degraded chassis unit abandoned by Korrath forces; needs help or is hostile')
    ,@('7','Cinder priest','Sutensai agent observing Korrath movements; will trade information for escort')
    ,@('8','Korrath loyalist','True believer confronts party about their faction allegiances')
    ,@('9','Iron Herald advance scout','Testing party for potential recruitment into Korrath forces')
    ,@('10','Engine Scar phenomenon','Strange resonance event near the scar; tied to prior-cycle remnant')
)

WC 'chart_encounter_veilward_reach' 'Encounter Table - Veilward Reach' @(
    ,@('roll','type','description')
    ,@('1','Pilgrimage traveler','Follower of Vaen shares visions and asks party to join the walk')
    ,@('2','Dissolution zone','Area where reality thins; Echoed hear voices, Shellbroken feel pulled toward the Gap')
    ,@('3','Vaen sighting','Distant glimpse of Vaen; pursuit leads to an abandoned campsite with a message')
    ,@('4','Wire Market scout','Merchant assessing Veilward; nervously watching Pilgrimage movements')
    ,@('5','Hollow Author proxy','NPC behaving strangely; carrying a page of the Manuscript; denies knowing what it is')
    ,@('6','Echoed community','Village of Echoed settled near a resonance thin-point; protective of their space')
    ,@('7','Iron Sutra investigator','Orthodoxy agent tracking unregistered enhancements through Veilward')
    ,@('8','Shore of Last Words','Party arrives at the coast where the Gap is visible; strange compulsion mechanics')
    ,@('9','Ruined citadel guardian','Prior-cycle remnant defends the citadel; not fully hostile; bound by ancient oath')
    ,@('10','Vaen''s trail','Physical evidence of Vaen''s passage; interacting reveals the next step of the Pilgrimage')
)

WC 'chart_encounter_pale_reach' 'Encounter Table - Pale Reach' @(
    ,@('roll','type','description')
    ,@('1','Iron Sutra checkpoint','Orthodoxy inspection; demands enhancement registration papers')
    ,@('2','Wire Market deal','Guild representative offers a lucrative contract with unstated risks')
    ,@('3','Information broker','Neutral party selling verified intel about all three claimants; price is high')
    ,@('4','Hollow Author contact','Someone passes a note; it contains information the party should not have')
    ,@('5','Guild enforcer','Craftbound guild collecting debt from a local; party can intervene or observe')
    ,@('6','Preparation Halls access','Opportunity to enter the Halls; contains restricted Sutensai archives')
    ,@('7','Resonance merchant','Sells black-market enhancements; Iron Sutra closing in on their location')
    ,@('8','Caste dispute','Voided individual being denied services; party response affects faction reputation')
    ,@('9','Deep Temple envoy','Sutensai priest invites party to the Deep Temple for an evaluation')
    ,@('10','Wire Market auction','Rare prior-cycle artifact being auctioned; multiple factions sending agents')
)

WC 'chart_encounter_iron_teeth_reach' 'Encounter Table - Iron Teeth Reach' @(
    ,@('roll','type','description')
    ,@('1','Resonance test','Sutensai acolyte administers mandatory resonance alignment test to travelers')
    ,@('2','Ironclad patrol','Sutensai-aligned Ironclad escorts party through the reach; evaluating them')
    ,@('3','Temple trial','Party invited to undertake a minor temple trial; reward is a certification mark')
    ,@('4','Theological debate','Local scholar challenges party understanding of the Sutensai revelation')
    ,@('5','Korrath agent','Disguised Korrath scout mapping Iron Teeth defenses')
    ,@('6','Cinder priest revelation','A priest breaks orthodoxy to share a secret about the Hollow Author in the Order')
    ,@('7','Chars Voice messenger','Cryptic message delivered from the presumed leader of the Sutensai Order')
    ,@('8','Resonance predator','Creature that feeds on resonance energy attacks near the temple perimeter')
    ,@('9','Ironclad schism','Two Ironclad units with conflicting oath interpretations ask party to arbitrate')
    ,@('10','Temple archive access','Party gains access to historical records about the prior Convergence cycle')
)

WC 'chart_encounter_ash_river_reach' 'Encounter Table - Ash River Reach' @(
    ,@('roll','type','description')
    ,@('1','Refugee camp','Settlement of displaced Ashwalkers and Voided; needs supplies or protection')
    ,@('2','Faction recruiter','All three claimants have agents here; each approaches party separately')
    ,@('3','Desperate merchant','Salvage trader selling stripped chassis parts; some from recently fallen Forged')
    ,@('4','Iron Blessed community','Unregistered Iron Blessed living communally; fear Orthodoxy raids')
    ,@('5','Diminished network','Information-sharing network; will trade intel for discretion')
    ,@('6','River phenomenon','Ash River carries resonance runoff from Sunder; strange effects on Forged nearby')
    ,@('7','Korrath conscription raid','Forcible recruitment sweep; Ashwalker and Voided have no legal protection')
    ,@('8','Vaen rumor','Multiple witnesses report seeing Vaen crossing the river; trail is fresh')
    ,@('9','Hollow Author evidence','A cluster of people all received identical dreams last night; party investigates')
    ,@('10','Convergence pressure','Unusual resonance buildup suggests Convergence is accelerating; urgency encounter')
)

WC 'chart_npc_reference' 'NPC Quick Reference' @(
    ,@('npc_id','name','role','faction','location','secret')
    ,@('forge_sister_kessen','Forge Sister Kessen','Sutensai resonance engineer; maintains the Iron Teeth temple apparatus','Sutensai Order','Iron Teeth Reach','Is a prior-cycle Forged who survived two Convergences; memories are fragmentary')
    ,@('general_soten_vari','General Soten Vari','Korrath battlefield commander; runs Sunder Reach military operations','Korrath','Sunder Reach','Has private doubts about Korrath claim; waiting for a reason to defect')
    ,@('governor_maret_suno','Governor Maret Suno','Wire Market governance representative in Pale Reach','Wire Market','Pale Reach','Is a Hollow Author proxy; does not know it yet')
    ,@('guild_master_harren','Guild Master Harren','Head of the Wire Market guild council','Wire Market','Pale Reach','Has already sold Hollow Author information about all three claimants')
    ,@('lord_tessik','Lord Tessik','Korrath oath-bound enforcer; hunts oath-breakers and deserters','Korrath','Mobile / Sunder Reach','His oath chain is fracturing; he knows and is terrified')
    ,@('mira_pale','Mira Pale','Independent cartographer mapping resonance changes across all Reaches','Neutral','Mobile','Her maps show a fifth location no one has identified yet')
    ,@('runner_seven','Runner Seven','Wire Market courier with perfect information recall','Wire Market','Mobile / Pale Reach','Is a Wireborn with an illegal neural modification; has recorded everything ever delivered')
    ,@('chars_voice','Chars Voice','Presumed leader of the Sutensai Order; communicates only through intermediaries','Sutensai Order','Iron Teeth (Deep Temple)','May not be a single individual; the Voice may rotate among senior priests')
    ,@('cinder_priest','The Cinder Priest','Wandering Sutensai agent monitoring Korrath activity in Sunder','Sutensai Order','Sunder Reach','Carries a sealed directive from Chars Voice that has not yet been opened')
    ,@('the_collector','The Collector','Black market dealer in prior-cycle artifacts','Unknown','Mobile / Pale Reach','Is aware of the Manuscript; has sold pages to multiple parties')
    ,@('drowned_archivist','The Drowned Archivist','Echoed scholar preserving knowledge about prior Convergence cycles','Neutral','Veilward Reach / Shore','Died in a prior cycle and came back; their memories are not from this cycle')
    ,@('garden_keeper','The Garden Keeper','Maintains the Preparation Halls in Pale Reach','Iron Sutra','Pale Reach','The Halls contain a sealed chamber the Iron Sutra has never opened')
    ,@('the_signal','The Signal','Wireborn who broadcasts encrypted information to underground networks','Neutral / Ashwalker','Mobile','Is simultaneously the Hollow Author''s most valuable asset and most persistent investigative target')
    ,@('tidecourt_speaker_veran','Tidecourt Speaker Veran','Diminished political voice representing Ash River communities','Neutral / Pilgrimage-aligned','Ash River Reach','Has met Vaen personally; knows the actual destination of the Pilgrimage')
    ,@('veil_master_soren_hai','Veil Master Soren Hai','Veilblade instructor operating out of Veilward Reach','Independent','Veilward Reach','Trained operatives for all three claimants; keeps records of everyone')
    ,@('warden_tessen','Warden Tessen','Iron Sutra warden overseeing unregistered enhancement containment','Iron Sutra','Pale Reach','Has been accepting bribes; entire containment operation is compromised')
)

WC 'chart_location_reference' 'Location Quick Reference' @(
    ,@('location_id','name','region','key_threat','key_opportunity','encounter_theme')
    ,@('cinderfort','Cinderfort','Sunder Reach','Korrath military garrison; active conscription zone','Intel on Korrath troop movements; potential Ironblood defector','Military tension, oath-under-pressure, survival')
    ,@('deep_temple','Deep Temple','Iron Teeth Reach (underground)','Iron Sutra warden squads; sealed chamber unknown contents','Sutensai archive access; Chars Voice communication channel','Theological revelation, forbidden knowledge, resonance testing')
    ,@('preparation_halls','Preparation Halls','Pale Reach','Iron Sutra inspection presence; Hollow Author agent embedded','Restricted Sutensai historical records; black market access via the Collector','Information acquisition, faction maneuvering, moral ambiguity')
    ,@('engine_scar','Engine Scar','Sunder Reach','Unstable resonance field; prior-cycle remnant guardians','Prior-cycle technology; potential Fracture reversal components','Environmental hazard, prior-cycle mystery, power at cost')
    ,@('shore_of_last_words','Shore of Last Words','Veilward Reach','Dissolution pull toward the Gap; compulsion effects','Vaen''s trail; Drowned Archivist knowledge repository','Existential encounters, identity, the cost of ascension')
    ,@('ruined_citadel','Ruined Citadel','Veilward Reach','Prior-cycle guardian bound to defend; Hollow Author observation post','Prior-cycle archival fragments; oath-bond relic possibly stored here','Ruin exploration, prior oath mechanics, claimant intelligence')
)

WC 'chart_monster_catalog' 'Monster Catalog - All Types' @(
    ,@('monster_id','name','type','tier','role','key_abilities','source_file')
    ,@('shell_entity_standard','Shell Entity (Standard)','shell_entities','standard','brute','Resonance pulse, Shell Drain, Mindless Advance','monsters/shell_entities.md')
    ,@('shell_entity_swarm','Shell Entity Swarm','shell_entities','minion','skirmisher','Overwhelm, Signal Interference','monsters/shell_entities.md')
    ,@('iron_afterlife_warden','Iron Afterlife Warden','iron_afterlife','elite','controller','Already Died Mirror, Phase Lock, Grief Anchor','monsters/iron_afterlife.md')
    ,@('corrupted_forged_soldier','Corrupted Forged Soldier','corrupted_forged','standard','brute','Fracture Strike, Enhancement Malfunction, Oath Echo','monsters/corrupted_forged.md')
    ,@('corrupted_forged_commander','Corrupted Forged Commander','corrupted_forged','elite','controller','Command Aura, Oath Inversion, Mass Fracture','monsters/corrupted_forged.md')
    ,@('war_beast_ashlands','Ashlands War Beast','war_beasts','standard','brute','Ash Charge, Toxic Exhalation, Spine Strike','monsters/war_beasts.md')
    ,@('ashlands_crawler','Ashlands Crawler','ashlands_phenomena','minion','skirmisher','Burrow, Poison Spray, Pack Flank','monsters/ashlands.md')
    ,@('oni_echo','Oni Echo','oni_equivalents','elite','controller','Mark Target, Dissolution Field, Hunter Lock','monsters/oni.md')
    ,@('wire_plague_node','Wire Plague Node','wire_plague','standard','support','Plague Spread, Signal Boost, Network Pulse','monsters/wire_plague.md')
    ,@('the_hollowed_wanderer','The Hollowed Wanderer','the_hollowed','standard','controller','Reality Blur, Void Touch, Untethered Strike','monsters/hollowed.md')
    ,@('resonance_predator','Resonance Predator','resonance_predators','elite','brute','Resonance Feed, Drain Aura, Amplified Strike','monsters/resonance_predators.md')
    ,@('between_walker','Between Walker','between_walkers','elite','skirmisher','Phase Step, Between Strike, Anchor Break','monsters/between_walkers.md')
    ,@('ironhold_construct','Ironhold War Construct','ironhold_constructs','boss','brute','Iron Barrage, Fortress Mode, Oath Engine','monsters/ironhold.md')
    ,@('sutensai_manifestation','Sutensai Manifestation','sutensai_manifestations','elite','controller','Revelation Pulse, Truth Bind, Orthodoxy Seal','monsters/sutensai.md')
    ,@('prior_ascended_remnant','Prior Ascended Remnant','prior_ascended_remnants','boss','controller','Convergence Memory, Cycle Anchor, Ascendant Form','monsters/prior_ascended.md')
    ,@('ashlands_horror','Ashlands Horror','ashlands_horrors','boss','brute','Toxic Storm, Ash Burial, Mindless Rampage','monsters/ashlands.md')
)

WC 'chart_damage_types' 'Damage Types' @(
    ,@('type','common_sources','resisted_by','keywords_applied')
    ,@('slashing','Blades, claws, edge weapons','Plating augmentations, Fortify','Bleed')
    ,@('piercing','Spears, fangs, drill weapons','Shield, Guard','Pierce (ignores Guard)')
    ,@('bludgeoning','Hammers, hydraulic strikes, constructs','Fortify, Guard','Stagger on heavy hits')
    ,@('resonant','Sutensai abilities, resonance predators, Pulse Caller','Veil, resonance resistance','Mark, Expose')
    ,@('fire','Burn cards, Ashlands phenomena, Overheat discharge','None standard','Burn, Overheat')
    ,@('signal','Wireborn abilities, Wire Plague, Veilblade wire integration','Signal resistance (Wireborn passive)','Silence, Root')
    ,@('void','Void Walker abilities, Hollow Author agents, Gap exposure','None standard','Veil, phase effects')
    ,@('spiritual','Echoed abilities, iron afterlife entities, Sutensai rites','Sutensai alignment','Mark, special conditions')
    ,@('bleed_poison','Bleed stacks, Ashlands toxins','CON saves, Cleanse','Bleed (ongoing)')
)

WC 'chart_rest_actions' 'Rest Actions' @(
    ,@('rest_type','duration','what_resets','what_requires')
    ,@('short_rest','10 minutes in-game','Short rest class resources; Quarry Mark; some pool refills','No active combat; minimal activity; no maintenance required')
    ,@('long_rest','8 hours in-game','All short rest resources; HP to max; status effects expire; degraded state clears; all class pools reset','Safe location; maintenance kit for Forged; full downtime period')
)

WC 'chart_loot_tables' 'Loot Tables by Tier' @(
    ,@('tier','item_category','item_quality','currency_range','notes')
    ,@('minion','Consumables, basic tools','Common','1-3 trade metal','Typically one consumable item and minimal currency')
    ,@('standard','Weapons, armor pieces, augmentation components','Common to uncommon','3-8 trade metal','May carry faction-specific item or low-tier augmentation component')
    ,@('elite','Named weapons, full augmentation modules, faction gear','Uncommon to rare','8-20 trade metal','Often carries one unique item; may have Sutensai seal or Wire Market contract')
    ,@('boss','Artifacts, claimant relics, unique augmentations','Rare to legendary','20-50 trade metal plus unique','Always carries a unique item; may drop campaign-significant intelligence')
    ,@('environmental','Salvage, resonance crystals, prior-cycle fragments','Varies','0-5 trade metal','Location-specific; requires investigation or skill check to identify value')
)

WC 'chart_level_milestones' 'Level Milestone Reference' @(
    ,@('level','typical_features_unlocked','campaign_beats')
    ,@('1','Base class feature, starting hand, racial passive','Party formation; first faction contact; initial claimant awareness')
    ,@('2','First class resource or mechanic','Minor faction conflict; first encounter with a claimant agent')
    ,@('3','Second class ability or subclass preview','Party reputation established; first major moral choice')
    ,@('4','Subclass path chosen; path feature 1','Mid-act 1 conflict; claimant agendas begin to conflict directly')
    ,@('5','Class threshold mechanic activated','Act 1 conclusion; major faction shift or party loss event')
    ,@('6','Subclass feature 2; enhanced resource pool','Act 2 opens; second Reach accessible; Hollow Author presence confirmed')
    ,@('7','Passive aura or persistent effect','Party discovers Hollow Author infiltration in a trusted faction')
    ,@('8','Class feature or oath deepening','First Oath Test or class-defining personal event')
    ,@('9','Advanced threshold or escalation mechanic','Convergence signs accelerate; claimant military conflict imminent')
    ,@('10','Signature card; major class power active','Mid-campaign climax; party must choose primary claimant allegiance')
    ,@('11','Aura expansion or area effect enhancement','Second Reach fully accessible; faction war goes hot')
    ,@('12','Party-synergy or ally-buff passive','Major NPC death or betrayal; reputation forces alignment declaration')
    ,@('13','Dangerous power or double-edged mechanic','Third Reach opens; Hollow Author identity partially revealed')
    ,@('14','Subclass capstone feature','Personal story arc conclusion for each character')
    ,@('15','Second Oath Test or class evolution event','Pre-endgame; all claimant agendas converging on Convergence site')
    ,@('16','Burst power; once per long rest major effect','Final NPC reveals; party learns Convergence timing')
    ,@('17','Class mastery; redirect or override mechanic','Last chance for claimant negotiation or betrayal')
    ,@('18','Ascendant form or peak class expression','Convergence site reached; final faction positions locked')
    ,@('19','Final Oath event or class-defining capstone choice','Endgame begins; party chooses Convergence outcome')
    ,@('20','Convergence-tier card; campaign-ending power','Resolution; chosen Claimant ascends or is defeated; world changes')
)

WC 'chart_seventh_convergence_clocks' 'Campaign Clocks' @(
    ,@('clock_id','name','current_progress','threshold','trigger_event')
    ,@('korrath_ascension','Korrath''s Ascension March','0','10','At threshold: Korrath army reaches Convergence site; military endgame forces immediate resolution')
    ,@('vaen_pilgrimage','Vaen''s Pilgrimage Progress','0','10','At threshold: Vaen reaches the Gap threshold; dissolution cascade begins affecting all Reaches')
    ,@('hollow_author_network','Hollow Author Network Exposure','0','8','At threshold: Hollow Author identity forced into the open; all proxies activated simultaneously')
    ,@('iron_sutra_response','Iron Sutra Orthodoxy Response','0','6','At threshold: Iron Sutra declares all claimants heretical; military lockdown of Pale and Iron Teeth Reaches')
    ,@('convergence_approach','Convergence Approach','0','12','At threshold: The Convergence event begins; all campaign clocks freeze; endgame sequence initiates')
)

Write-Host "All 38 chart TSV files written."

# ── CHARTS.JSON ──────────────────────────────────────────────────────────────

$chartsMeta = @(
    @{ id='chart_card_action_schema';        rulesetId=$rid; title='Card Action Schema';                description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_resolution_types';          rulesetId=$rid; title='Resolution Types';                 description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_turn_sequence';             rulesetId=$rid; title='Turn Sequence';                    description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_forged_heritage_options';   rulesetId=$rid; title='Forged Heritage Options';          description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_forged_augmentation_options'; rulesetId=$rid; title='Forged Augmentation Options';  description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_maintenance_states';        rulesetId=$rid; title='Maintenance States';               description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_ironclad_level_progression'; rulesetId=$rid; title='Ironclad Level Progression';    description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_ironclad_vein_oaths';       rulesetId=$rid; title='Vein Oaths';                      description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_ironclad_vein_path_options'; rulesetId=$rid; title='Vein Path Options';             description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_ironclad_starting_gear';    rulesetId=$rid; title='Ironclad Starting Gear';          description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_monster_ap_by_tier';        rulesetId=$rid; title='Monster AP by Tier';              description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_monster_role_card_weights'; rulesetId=$rid; title='Monster Role Card Weights';       description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_monster_turn_priority';     rulesetId=$rid; title='Monster Turn Priority';           description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_monster_card_tags';         rulesetId=$rid; title='Monster Card Tags';               description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_status_catalog';            rulesetId=$rid; title='Status Catalog';                  description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_status_timing';             rulesetId=$rid; title='Status Timing Rules';             description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_status_dispel_groups';      rulesetId=$rid; title='Status Dispel Groups';            description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_races_overview';            rulesetId=$rid; title='All Races - Overview';            description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_classes_overview';          rulesetId=$rid; title='All Classes - Overview';          description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_ap_cost_reference';         rulesetId=$rid; title='AP Cost Reference';               description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_keyword_glossary';          rulesetId=$rid; title='Keyword Glossary';                description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_caste_system';              rulesetId=$rid; title='Caste System Reference';          description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_faction_matrix';            rulesetId=$rid; title='Faction Matrix';                  description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_claimant_reference';        rulesetId=$rid; title='Claimant Reference';              description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_reach_overview';            rulesetId=$rid; title='Broken Reaches Overview';         description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_encounter_sunder_reach';    rulesetId=$rid; title='Encounter Table - Sunder Reach';  description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_encounter_veilward_reach';  rulesetId=$rid; title='Encounter Table - Veilward Reach'; description=''; createdAt=$ts; updatedAt=$ts }
    @{ id='chart_encounter_pale_reach';      rulesetId=$rid; title='Encounter Table - Pale Reach';    description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_encounter_iron_teeth_reach'; rulesetId=$rid; title='Encounter Table - Iron Teeth Reach'; description=''; createdAt=$ts; updatedAt=$ts }
    @{ id='chart_encounter_ash_river_reach'; rulesetId=$rid; title='Encounter Table - Ash River Reach'; description=''; createdAt=$ts; updatedAt=$ts }
    @{ id='chart_npc_reference';             rulesetId=$rid; title='NPC Quick Reference';             description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_location_reference';        rulesetId=$rid; title='Location Quick Reference';        description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_monster_catalog';           rulesetId=$rid; title='Monster Catalog - All Types';     description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_damage_types';              rulesetId=$rid; title='Damage Types';                    description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_rest_actions';              rulesetId=$rid; title='Rest Actions';                    description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_loot_tables';              rulesetId=$rid; title='Loot Tables by Tier';              description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_level_milestones';          rulesetId=$rid; title='Level Milestone Reference';       description='';  createdAt=$ts; updatedAt=$ts }
    @{ id='chart_seventh_convergence_clocks'; rulesetId=$rid; title='Campaign Clocks';               description='';  createdAt=$ts; updatedAt=$ts }
) | ForEach-Object { [PSCustomObject]$_ }

[IO.File]::WriteAllText("$appdata\charts.json", ($chartsMeta | ConvertTo-Json -Depth 3), $enc)
Write-Host "charts.json written (38 entries)."

# ── ARCHETYPES ───────────────────────────────────────────────────────────────

$existing = Get-Content "$appdata\archetypes.json" -Raw | ConvertFrom-Json

$newArcs = @(
    # ── RACES (7 remaining) ──
    [PSCustomObject]@{ id='arc_race_tethered_base';    rulesetId=$rid; name='Race: Tethered';     description='High-CON/WIS biological chassis; Augmentation slots locked at 0; Echomind Undivided and Biological Acuity passives'; testCharacterId=$null; isDefault=$false; loadOrder=20; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_race_echoed_base';      rulesetId=$rid; name='Race: Echoed';       description='Already Died mechanic (once-per-encounter drop to 1 HP instead of 0); Iron Afterlife Awareness and Afterlife affinity passives'; testCharacterId=$null; isDefault=$false; loadOrder=21; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_race_wireborn_base';    rulesetId=$rid; name='Race: Wireborn';     description='Signal Vulnerability active (Silence effects +1 turn); Ambient Wire Sense, Digital Navigation, and Circuit Trace passives'; testCharacterId=$null; isDefault=$false; loadOrder=22; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_race_stitched_base';    rulesetId=$rid; name='Race: Stitched';     description='Modular Construction with Component A and B; Stagger Resistance once per combat; Inconsistent Resonance Signature and Drift State tracking'; testCharacterId=$null; isDefault=$false; loadOrder=23; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_race_shellbroken_base'; rulesetId=$rid; name='Race: Shellbroken';  description='Survivor Clarity (Guard +4 free reaction on first below-half-HP trigger per combat); Void-Touched Mind and Shell-State Awareness passives'; testCharacterId=$null; isDefault=$false; loadOrder=24; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_race_iron_blessed_base'; rulesetId=$rid; name='Race: Iron Blessed'; description='Resonant Attunement and Sutensai Attention; hand size +1 (Tended) or -1 (Unregistered); Formation mechanics and Spine-Speak Competency'; testCharacterId=$null; isDefault=$false; loadOrder=25; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_race_diminished_base';  rulesetId=$rid; name='Race: Diminished';   description='Social Invisibility; Lean Target; hand size +2; Environmental Awareness, Deep School Training, and Infrastructure Knowledge passives'; testCharacterId=$null; isDefault=$false; loadOrder=26; createdAt=$ts; updatedAt=$ts }
    # ── CLASSES (24 remaining) ──
    [PSCustomObject]@{ id='arc_class_ronin_base';          rulesetId=$rid; name='Class: Ronin';          description='Corrupted Resonance Signature; Oath Status and Contract Target trackers; Ascendant Blade or Shadow Wanderer path'; testCharacterId=$null; isDefault=$false; loadOrder=27; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_ashfoot_base';        rulesetId=$rid; name='Class: Ashfoot';        description='Caste Tier and Enhancement Quality trackers; salvage-first kit philosophy; Skirmish Specialist or Salvage Seeker path'; testCharacterId=$null; isDefault=$false; loadOrder=28; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_veilblade_base';      rulesetId=$rid; name='Class: Veilblade';      description='Resonant Signature suppressed; Wire Integration Active; hand size -1; Shadow Operative or Wire Ghost path'; testCharacterId=$null; isDefault=$false; loadOrder=29; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_oni_hunter_base';     rulesetId=$rid; name='Class: Oni Hunter';     description='Quarry Mark mechanic; Dissolution Resonance tracker; mark-conditional bonuses; Dissolution Specialist or Prey Reader path'; testCharacterId=$null; isDefault=$false; loadOrder=30; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_forge_tender_base';   rulesetId=$rid; name='Class: Forge Tender';   description='Community Dependent passive; Resonance Keepers Aligned tracker; heal uses per short rest; Resonance Keeper or Rebuild Saint path'; testCharacterId=$null; isDefault=$false; loadOrder=31; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_wireweave_base';      rulesetId=$rid; name='Class: Wireweave';      description='Wire-based combat mechanics; integrated signal weaponry; Combat Weave or Signal Loom path'; testCharacterId=$null; isDefault=$false; loadOrder=32; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_chrome_shaper_base';  rulesetId=$rid; name='Class: Chrome Shaper';  description='Configuration switch mechanics; Experimental Designs tracker; active config state management; War Shaper or Forge Genius path'; testCharacterId=$null; isDefault=$false; loadOrder=33; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_pulse_caller_base';   rulesetId=$rid; name='Class: Pulse Caller';   description='Integrated Weapon Active; Preconscious Fire state tracker; ranged resonance weaponry; Single Point or Scatter Pulse path'; testCharacterId=$null; isDefault=$false; loadOrder=34; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_iron_monk_base';      rulesetId=$rid; name='Class: Iron Monk';      description='Between State Active toggle; below-half-HP bonus tracking; smallest hand size (5); Orthodoxy or Between Form path'; testCharacterId=$null; isDefault=$false; loadOrder=35; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_echo_speaker_base';   rulesetId=$rid; name='Class: Echo Speaker';   description='Afterlife Affinity passive; Grief Stacks accumulate on ally death and fuel abilities; Sutensai Aligned or Grief Conductor path'; testCharacterId=$null; isDefault=$false; loadOrder=36; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_void_walker_base';    rulesetId=$rid; name='Class: Void Walker';    description='Incorporeal State Active toggle; Anchor Points tracker; phase-conditional defenses; Ghost Operative or Phase Anchor path'; testCharacterId=$null; isDefault=$false; loadOrder=37; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_sutensai_base';       rulesetId=$rid; name='Class: Sutensai';       description='Reader Authority; HP cost payment mechanic for advanced cards; theological enforcement role; Inquisitor or Truth Seeker path'; testCharacterId=$null; isDefault=$false; loadOrder=38; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_flesh_shaper_base';   rulesetId=$rid; name='Class: Flesh Shaper';   description='HP tier tracking (full/wounded/critical) gates abilities; Crisis Mend mechanic; The Mender or Flesh Architect path'; testCharacterId=$null; isDefault=$false; loadOrder=39; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_puppet_binder_base';  rulesetId=$rid; name='Class: Puppet Binder';  description='Binding Threads tracker; Vessel Active toggle; bound target ID map; The Architect or Thread Cutter path'; testCharacterId=$null; isDefault=$false; loadOrder=40; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_blood_smith_base';    rulesetId=$rid; name='Class: Blood Smith';    description='Iron Tolerance reduces HP card costs; Enhancement Status (stable/stressed/failing) tracks HP tiers; The Weaponsmith or Iron Ritual path'; testCharacterId=$null; isDefault=$false; loadOrder=41; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_hollow_base';         rulesetId=$rid; name='Class: The Hollow';     description='HP percent tracking drives path abilities; no defined class identity until defined through play; The Empty or Resonant Void path'; testCharacterId=$null; isDefault=$false; loadOrder=42; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_shadow_daimyo_base';  rulesetId=$rid; name='Class: Shadow Daimyo';  description='Intelligence Gathered tracker per target; Active Contacts resource pool; intelligence and debt serialized maps; Spymaster or Ghost Network path'; testCharacterId=$null; isDefault=$false; loadOrder=43; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_voice_of_debt_base';  rulesetId=$rid; name='Class: Voice of Debt';  description='Debt stack map per target; Detonation counter; Debt stacks detonate for bonus damage; Oath Keeper or Debt Lord path'; testCharacterId=$null; isDefault=$false; loadOrder=44; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_merchant_knife_base'; rulesetId=$rid; name='Class: Merchant Knife'; description='Intelligence map per target (max 3 stacks); debt tracking; dual-leverage mechanic; Supply Cutter or Trade War path'; testCharacterId=$null; isDefault=$false; loadOrder=45; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_iron_herald_base';    rulesetId=$rid; name='Class: Iron Herald';    description='Command Zone Active toggle (15 ft radius default); Priority Target designation; zone-synergy cards; Warbanner or Iron Preacher path'; testCharacterId=$null; isDefault=$false; loadOrder=46; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_curse_eater_base';    rulesetId=$rid; name='Class: Curse Eater';    description='Loaded Count tracks absorbed debuff stacks; Corruption Points (Consumed path only); purge for power; Purifier or Consumed path'; testCharacterId=$null; isDefault=$false; loadOrder=47; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_shell_dancer_base';   rulesetId=$rid; name='Class: Shell Dancer';   description='Cascade Count (0-10) generated from incoming damage; Shell Step evasion toggle; Cascade spend mechanic; The Breaker or Echo Step path'; testCharacterId=$null; isDefault=$false; loadOrder=48; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_fracture_knight_base'; rulesetId=$rid; name='Class: Fracture Knight'; description='Phantom Charges (0-6) resource pool; Fracture stack maps on self and targets; phantom strike variants; The Claimed or Phantom Forge path'; testCharacterId=$null; isDefault=$false; loadOrder=49; createdAt=$ts; updatedAt=$ts }
    [PSCustomObject]@{ id='arc_class_unnamed_base';        rulesetId=$rid; name='Class: The Unnamed';    description='Active Stat cycling (IRON/EDGE/SIGNAL/RESONANCE/VEIL/FRAME); card naming mechanic; identity defined through play; self-defined convergent path'; testCharacterId=$null; isDefault=$false; loadOrder=50; createdAt=$ts; updatedAt=$ts }
)

# Upsert: merge new arcs into existing by ID (no duplicates on repeated runs)
$arcMap = [ordered]@{}
foreach ($a in $existing) { $arcMap[$a.id] = $a }
foreach ($a in $newArcs)  { $arcMap[$a.id] = $a }
$all = @($arcMap.Values)
[IO.File]::WriteAllText("$appdata\archetypes.json", ($all | ConvertTo-Json -Depth 4), $enc)
Write-Host "archetypes.json updated ($($all.Count) total archetypes)."

# ── METADATA COUNTS ──────────────────────────────────────────────────────────

$meta = Get-Content "$appdata\metadata.json" -Raw | ConvertFrom-Json
$meta.counts.archetypes = $all.Count
$meta.counts.charts     = 38
[IO.File]::WriteAllText("$appdata\metadata.json", ($meta | ConvertTo-Json -Depth 6), $enc)
Write-Host "metadata.json updated (archetypes=$($all.Count), charts=38)."

# ── REBUILD ZIP ──────────────────────────────────────────────────────────────

Add-Type -Assembly System.IO.Compression.FileSystem
Add-Type -Assembly System.IO.Compression

$dest = 'c:\Users\nroberts\TechnoNinja\tesshari_0.3.0.zip'
if (Test-Path $dest) { Remove-Item $dest }

$stream  = [IO.File]::Open($dest, [IO.FileMode]::Create)
$archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)

Get-ChildItem -Path $base -Recurse -File | ForEach-Object {
    $rel  = $_.FullName.Substring($base.Length + 1).Replace('\','/')
    $entry = $archive.CreateEntry($rel, [IO.Compression.CompressionLevel]::Optimal)
    $es   = $entry.Open()
    $fs   = [IO.File]::OpenRead($_.FullName)
    $fs.CopyTo($es)
    $fs.Close(); $es.Close()
}

$archive.Dispose(); $stream.Close()
Write-Host "tesshari_0.3.0.zip rebuilt."
