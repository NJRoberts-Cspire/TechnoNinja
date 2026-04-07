$base    = 'c:\Users\nroberts\TechnoNinja\FullQuestboundReadyToZip'
$appdata = "$base\application data"
$rid     = '4244b851-579a-4e85-b8e5-2932326df9ed'
$testId  = '0a0fa763-a1b8-408a-982a-4f91a4c94b0b'
$ts      = '2026-04-02T18:10:45.240Z'
$enc     = [System.Text.UTF8Encoding]::new($false)

# ── STYLE PRESETS ────────────────────────────────────────────────────────────

$sHeader = @{ opacity=1; color='#c8a84b'; fontSize=11; fontWeight='700';
              outlineWidth=0; borderRadiusTopLeft=0; borderRadiusTopRight=0;
              borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
              paddingLeft=2; verticalAlign='center' }

$sLabel  = @{ opacity=1; color='#888898'; fontSize=12; fontWeight='400';
              outlineWidth=0; borderRadiusTopLeft=0; borderRadiusTopRight=0;
              borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
              verticalAlign='center'; paddingLeft=4 }

$sValue  = @{ opacity=1; color='#d0d0e0'; fontSize=14; fontWeight='500';
              outlineWidth=1; outlineColor='#2a2a4a';
              borderRadiusTopLeft=4; borderRadiusTopRight=4;
              borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
              backgroundColor='#16162c'; verticalAlign='center';
              textAlign='center'; paddingLeft=4 }

$sInput  = @{ opacity=1; color='#ffffff'; fontSize=18; fontWeight='700';
              outlineWidth=1; outlineColor='#3a3a6a';
              borderRadiusTopLeft=4; borderRadiusTopRight=4;
              borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
              backgroundColor='#16162c'; verticalAlign='center'; textAlign='center' }

$sSep    = @{ opacity=1; color='#555577'; fontSize=16; fontWeight='300';
              outlineWidth=0; borderRadiusTopLeft=0; borderRadiusTopRight=0;
              borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
              verticalAlign='center'; textAlign='center' }

$sCheck  = @{ opacity=1; outlineWidth=0; borderRadiusTopLeft=4; borderRadiusTopRight=4;
              borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
              color='#d0d0e0'; fontSize=12; fontWeight='400'; paddingLeft=4 }

$sGrHp   = @{ opacity=1; backgroundColor='#7a0000'; outlineWidth=0;
              borderRadiusTopLeft=4; borderRadiusTopRight=4;
              borderRadiusBottomLeft=4; borderRadiusBottomRight=4 }

$sGrAp   = @{ opacity=1; backgroundColor='#0d4f8c'; outlineWidth=0;
              borderRadiusTopLeft=4; borderRadiusTopRight=4;
              borderRadiusBottomLeft=4; borderRadiusBottomRight=4 }

$sGrMon  = @{ opacity=1; backgroundColor='#4a2f00'; outlineWidth=0;
              borderRadiusTopLeft=4; borderRadiusTopRight=4;
              borderRadiusBottomLeft=4; borderRadiusBottomRight=4 }

# ── HASHTABLE MERGE HELPER ───────────────────────────────────────────────────
function Merge($base, $over) {
    $r = @{}
    foreach ($k in $base.Keys) { $r[$k] = $base[$k] }
    foreach ($k in $over.Keys)  { $r[$k] = $over[$k]  }
    return $r
}

# ── COMPONENT BUILDER ────────────────────────────────────────────────────────

function C($id, $winId, $type, $x, $y, $w, $h, $data, $style,
           $attrId=$null, $actionId=$null, $scriptId=$null, $childWinId=$null) {
    [PSCustomObject]@{
        id                  = $id
        createdAt           = $ts; updatedAt = $ts
        rulesetId           = $rid
        windowId            = $winId
        type                = $type
        x                   = $x; y = $y; z = 0
        width               = $w; height = $h; rotation = 0
        data                = ($data  | ConvertTo-Json -Compress)
        style               = ($style | ConvertTo-Json -Compress)
        locked              = $false
        groupId             = $null; parentComponentId = $null
        attributeId         = $attrId
        actionId            = $actionId
        scriptId            = $scriptId
        childWindowId       = $childWinId
    }
}

# ── WINDOW IDs ───────────────────────────────────────────────────────────────
$wCbt = 'win_combat_core'
$wRes = 'win_class_resources'
$wIdn = 'win_identity'
$wMon = 'win_monster_combat'

# ── PAGE IDs ─────────────────────────────────────────────────────────────────
$pCbt = 'page_character_combat'
$pIdn = 'page_character_identity'
$pMon = 'page_monster_sheet'

# ═══════════════════════════════════════════════════════════════════════════
# COMPONENTS
# ═══════════════════════════════════════════════════════════════════════════

$allComps = [System.Collections.Generic.List[PSCustomObject]]::new()

# ─────────────────────────────────────────────────────────────────────────────
# WIN_COMBAT_CORE
# ─────────────────────────────────────────────────────────────────────────────

# HEALTH section
$allComps.Add((C 'cc_hdr_hp'    $wCbt 'text' 0 0   300 18 @{value='— HEALTH ────────────────────────────'} $sHeader))
$allComps.Add((C 'cc_hp_graph'  $wCbt 'graph' 0 22  300 26 @{numeratorAttributeId='attr_current_hp'; denominatorAttributeId='attr_max_hp'; graphVariant='horizontal-linear'; inverseFill=$false} $sGrHp))
$allComps.Add((C 'cc_hp_curr'   $wCbt 'input' 0 52  90  36 @{viewAttributeId='attr_current_hp'; viewAttributeReadOnly=$false; type='number'; placeholder='HP'} $sInput 'attr_current_hp'))
$allComps.Add((C 'cc_hp_sep'    $wCbt 'text'  94 52 20  36 @{value='/'} $sSep))
$allComps.Add((C 'cc_hp_max'    $wCbt 'text'  118 52 90 36 @{viewAttributeId='attr_max_hp'; viewAttributeReadOnly=$true} $sValue 'attr_max_hp'))
$allComps.Add((C 'cc_hp_lbl'    $wCbt 'text'  214 52 86 36 @{value='HP'} $sLabel))

# ACTION POINTS section
$allComps.Add((C 'cc_hdr_ap'    $wCbt 'text'  0 96  300 18 @{value='— ACTION POINTS ──────────────────────'} $sHeader))
$allComps.Add((C 'cc_ap_graph'  $wCbt 'graph' 0 118 300 26 @{numeratorAttributeId='attr_ap_current'; denominatorAttributeId='attr_ap_max'; graphVariant='horizontal-linear'; inverseFill=$false} $sGrAp))
$allComps.Add((C 'cc_ap_curr'   $wCbt 'input' 0 148 90  36 @{viewAttributeId='attr_ap_current'; viewAttributeReadOnly=$false; type='number'; placeholder='AP'} $sInput 'attr_ap_current'))
$allComps.Add((C 'cc_ap_sep'    $wCbt 'text'  94 148 20 36 @{value='/'} $sSep))
$allComps.Add((C 'cc_ap_max'    $wCbt 'text'  118 148 90 36 @{viewAttributeId='attr_ap_max'; viewAttributeReadOnly=$true} $sValue 'attr_ap_max'))
$allComps.Add((C 'cc_ap_lbl'    $wCbt 'text'  214 148 86 36 @{value='AP'} $sLabel))

# DEFENSE & STATE section
$allComps.Add((C 'cc_hdr_def'   $wCbt 'text'  0 192 300 18 @{value='— DEFENSE & TURN STATE ───────────────'} $sHeader))
$allComps.Add((C 'cc_grd_lbl'   $wCbt 'text'  0 214 105 30 @{value='Guard Value'} $sLabel))
$allComps.Add((C 'cc_grd_val'   $wCbt 'input' 110 214 60 30 @{viewAttributeId='attr_guard_value'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sInput 'attr_guard_value'))
$allComps.Add((C 'cc_turn_chk'  $wCbt 'checkbox' 180 214 118 30 @{viewAttributeId='attr_active_turn'} $sCheck 'attr_active_turn'))

# STATUS section
$allComps.Add((C 'cc_hdr_sts'   $wCbt 'text'  0 252 300 18 @{value='— ACTIVE STATUSES ────────────────────'} $sHeader))
$allComps.Add((C 'cc_sts_val'   $wCbt 'text'  0 274 300 76 @{viewAttributeId='attr_status_list'; viewAttributeReadOnly=$true} (Merge $sValue @{verticalAlign='start'; textAlign='start'; fontSize=12; paddingLeft=6; paddingTop=4}) 'attr_status_list'))

# TURN TRACKER section
$allComps.Add((C 'cc_hdr_trk'   $wCbt 'text'  0 358 300 18 @{value='— TURN TRACKER ───────────────────────'} $sHeader))
$allComps.Add((C 'cc_crd_lbl'   $wCbt 'text'  0 380 90  28 @{value='Cards Played'} $sLabel))
$allComps.Add((C 'cc_crd_val'   $wCbt 'text'  94 380 206 28 @{viewAttributeId='attr_cards_played_this_turn'; viewAttributeReadOnly=$true} (Merge $sValue @{fontSize=11; textAlign='start'; paddingLeft=6}) 'attr_cards_played_this_turn'))
$allComps.Add((C 'cc_bau_chk'   $wCbt 'checkbox' 0 412 148 28 @{viewAttributeId='attr_basic_attack_used_this_turn'} $sCheck 'attr_basic_attack_used_this_turn'))
$allComps.Add((C 'cc_lck_chk'   $wCbt 'checkbox' 152 412 148 28 @{viewAttributeId='attr_card_play_locked'} $sCheck 'attr_card_play_locked'))

# ─────────────────────────────────────────────────────────────────────────────
# WIN_CLASS_RESOURCES
# ─────────────────────────────────────────────────────────────────────────────

$allComps.Add((C 'cr_hdr_res'   $wRes 'text' 0 0   300 18 @{value='— CLASS RESOURCES ────────────────────'} $sHeader))

# Echo Speaker
$allComps.Add((C 'cr_grief_lbl' $wRes 'text' 0 22  170 26 @{value='Grief Stacks'} $sLabel))
$allComps.Add((C 'cr_grief_val' $wRes 'text' 174 22 56  26 @{viewAttributeId='attr_echo_speaker_grief_stacks'; viewAttributeReadOnly=$true} $sValue 'attr_echo_speaker_grief_stacks'))

# Shell Dancer
$allComps.Add((C 'cr_casc_lbl'  $wRes 'text' 0 52  120 26 @{value='Cascade Count'} $sLabel))
$allComps.Add((C 'cr_casc_val'  $wRes 'text' 124 52 52  26 @{viewAttributeId='attr_shell_dancer_cascade_count'; viewAttributeReadOnly=$true} $sValue 'attr_shell_dancer_cascade_count'))
$allComps.Add((C 'cr_shlstp_ch' $wRes 'checkbox' 182 52 118 26 @{viewAttributeId='attr_shell_dancer_in_shell_step'} $sCheck 'attr_shell_dancer_in_shell_step'))

# Fracture Knight
$allComps.Add((C 'cr_phnt_lbl'  $wRes 'text' 0 82  130 26 @{value='Phantom Charges'} $sLabel))
$allComps.Add((C 'cr_phnt_val'  $wRes 'text' 134 82 52  26 @{viewAttributeId='attr_fracture_knight_phantom_charges'; viewAttributeReadOnly=$true} $sValue 'attr_fracture_knight_phantom_charges'))
$allComps.Add((C 'cr_frac_lbl'  $wRes 'text' 0 112 120 26 @{value='Fracture (Self)'} $sLabel))
$allComps.Add((C 'cr_frac_val'  $wRes 'text' 124 112 52 26 @{viewAttributeId='attr_fracture_knight_fracture_stacks_self'; viewAttributeReadOnly=$true} $sValue 'attr_fracture_knight_fracture_stacks_self'))

# Puppet Binder
$allComps.Add((C 'cr_bind_lbl'  $wRes 'text' 0 142 120 26 @{value='Binding Threads'} $sLabel))
$allComps.Add((C 'cr_bind_val'  $wRes 'text' 124 142 52 26 @{viewAttributeId='attr_puppet_binder_binding_threads'; viewAttributeReadOnly=$true} $sValue 'attr_puppet_binder_binding_threads'))
$allComps.Add((C 'cr_vess_chk'  $wRes 'checkbox' 182 142 118 26 @{viewAttributeId='attr_puppet_binder_vessel_active'} $sCheck 'attr_puppet_binder_vessel_active'))

# Curse Eater
$allComps.Add((C 'cr_load_lbl'  $wRes 'text' 0 172 110 26 @{value='Loaded Count'} $sLabel))
$allComps.Add((C 'cr_load_val'  $wRes 'text' 114 172 52 26 @{viewAttributeId='attr_curse_eater_loaded_count'; viewAttributeReadOnly=$true} $sValue 'attr_curse_eater_loaded_count'))
$allComps.Add((C 'cr_corr_lbl'  $wRes 'text' 172 172 82 26 @{value='Corruption'} $sLabel))
$allComps.Add((C 'cr_corr_val'  $wRes 'text' 258 172 42 26 @{viewAttributeId='attr_curse_eater_corruption_points'; viewAttributeReadOnly=$true} $sValue 'attr_curse_eater_corruption_points'))

# Oni Hunter
$allComps.Add((C 'cr_qrry_chk'  $wRes 'checkbox' 0 202 132 26 @{viewAttributeId='attr_oni_hunter_quarry_marked'} $sCheck 'attr_oni_hunter_quarry_marked'))
$allComps.Add((C 'cr_diss_lbl'  $wRes 'text' 138 202 90 26 @{value='Dissolution'} $sLabel))
$allComps.Add((C 'cr_diss_val'  $wRes 'text' 234 202 66 26 @{viewAttributeId='attr_oni_hunter_dissolution_resonance'; viewAttributeReadOnly=$true} $sValue 'attr_oni_hunter_dissolution_resonance'))

$allComps.Add((C 'cr_hdr_dmy'   $wRes 'text' 0 232 300 18 @{value='— DAIMYO / HERALD ────────────────────'} $sHeader))

# Shadow Daimyo
$allComps.Add((C 'cr_intel_lbl' $wRes 'text' 0 254 100 26 @{value='Intelligence'} $sLabel))
$allComps.Add((C 'cr_intel_val' $wRes 'text' 104 254 52 26 @{viewAttributeId='attr_shadow_daimyo_intelligence'; viewAttributeReadOnly=$true} $sValue 'attr_shadow_daimyo_intelligence'))
$allComps.Add((C 'cr_cont_lbl'  $wRes 'text' 164 254 80 26 @{value='Contacts'} $sLabel))
$allComps.Add((C 'cr_cont_val'  $wRes 'text' 248 254 52 26 @{viewAttributeId='attr_shadow_daimyo_contacts'; viewAttributeReadOnly=$true} $sValue 'attr_shadow_daimyo_contacts'))

# Iron Herald
$allComps.Add((C 'cr_czact_chk' $wRes 'checkbox' 0 284 148 26 @{viewAttributeId='attr_iron_herald_command_zone_active'} $sCheck 'attr_iron_herald_command_zone_active'))
$allComps.Add((C 'cr_czrad_lbl' $wRes 'text' 154 284 76 26 @{value='Zone Radius'} $sLabel))
$allComps.Add((C 'cr_czrad_val' $wRes 'text' 234 284 66 26 @{viewAttributeId='attr_iron_herald_command_zone_radius'; viewAttributeReadOnly=$true} $sValue 'attr_iron_herald_command_zone_radius'))

$allComps.Add((C 'cr_hdr_tgl'   $wRes 'text' 0 314 300 18 @{value='— STATE TOGGLES ──────────────────────'} $sHeader))

# State toggles
$allComps.Add((C 'cr_incorp_ch' $wRes 'checkbox' 0 336 148 26 @{viewAttributeId='attr_void_walker_incorporeal_state'} $sCheck 'attr_void_walker_incorporeal_state'))
$allComps.Add((C 'cr_btwn_chk'  $wRes 'checkbox' 152 336 148 26 @{viewAttributeId='attr_iron_monk_between_state'} $sCheck 'attr_iron_monk_between_state'))
$allComps.Add((C 'cr_blhf_chk'  $wRes 'checkbox' 0 366 148 26 @{viewAttributeId='attr_iron_monk_below_half_bonus'} $sCheck 'attr_iron_monk_below_half_bonus'))
$allComps.Add((C 'cr_pcns_chk'  $wRes 'checkbox' 152 366 148 26 @{viewAttributeId='attr_pulse_caller_preconscious_fire'} $sCheck 'attr_pulse_caller_preconscious_fire'))

$allComps.Add((C 'cr_hdr_oth'   $wRes 'text' 0 396 300 18 @{value='— OTHER RESOURCES ────────────────────'} $sHeader))

# Unnamed / Sutensai / Chrome Shaper / Flesh Shaper
$allComps.Add((C 'cr_ast_lbl'   $wRes 'text' 0 418 90  26 @{value='Active Stat'} $sLabel))
$allComps.Add((C 'cr_ast_val'   $wRes 'text' 94 418 100 26 @{viewAttributeId='attr_unnamed_active_stat'; viewAttributeReadOnly=$true} $sValue 'attr_unnamed_active_stat'))
$allComps.Add((C 'cr_xpd_lbl'   $wRes 'text' 202 418 64 26 @{value='Exp.Designs'} $sLabel))
$allComps.Add((C 'cr_xpd_val'   $wRes 'text' 270 418 30 26 @{viewAttributeId='attr_chrome_shaper_experimental_designs'; viewAttributeReadOnly=$true} $sValue 'attr_chrome_shaper_experimental_designs'))
$allComps.Add((C 'cr_echo_lbl'  $wRes 'text' 0 448 120 26 @{value='Echomind Level'} $sLabel))
$allComps.Add((C 'cr_echo_val'  $wRes 'text' 124 448 52 26 @{viewAttributeId='attr_sutensai_echomind_reading_level'; viewAttributeReadOnly=$true} $sValue 'attr_sutensai_echomind_reading_level'))
$allComps.Add((C 'cr_hptier_lbl' $wRes 'text' 182 448 68 26 @{value='HP Tier'} $sLabel))
$allComps.Add((C 'cr_hptier_val' $wRes 'text' 254 448 46 26 @{viewAttributeId='attr_flesh_shaper_hp_tier'; viewAttributeReadOnly=$true} $sValue 'attr_flesh_shaper_hp_tier'))

# ─────────────────────────────────────────────────────────────────────────────
# WIN_IDENTITY
# ─────────────────────────────────────────────────────────────────────────────

$allComps.Add((C 'id_hdr_idn'   $wIdn 'text' 0 0   300 18 @{value='— IDENTITY ──────────────────────────'} $sHeader))
$allComps.Add((C 'id_spc_lbl'   $wIdn 'text' 0 22  90  30 @{value='Species'} $sLabel))
$allComps.Add((C 'id_spc_val'   $wIdn 'text' 94 22  206 30 @{viewAttributeId='attr_species'; viewAttributeReadOnly=$true} $sValue 'attr_species'))
$allComps.Add((C 'id_cls_lbl'   $wIdn 'text' 0 56  90  30 @{value='Class'} $sLabel))
$allComps.Add((C 'id_cls_val'   $wIdn 'text' 94 56  206 30 @{viewAttributeId='attr_class'; viewAttributeReadOnly=$true} $sValue 'attr_class'))
$allComps.Add((C 'id_lvl_lbl'   $wIdn 'text' 0 90  90  30 @{value='Level'} $sLabel))
$allComps.Add((C 'id_lvl_inp'   $wIdn 'input' 94 90 80  30 @{viewAttributeId='attr_level'; viewAttributeReadOnly=$false; type='number'; placeholder='1'} $sInput 'attr_level'))

$allComps.Add((C 'id_hdr_sub'   $wIdn 'text' 0 128 300 18 @{value='— SUBCLASS PATH ─────────────────────'} $sHeader))
$allComps.Add((C 'id_vein_lbl'  $wIdn 'text' 0 150 90  28 @{value='Vein Path'} $sLabel))
$allComps.Add((C 'id_vein_val'  $wIdn 'text' 94 150 206 28 @{viewAttributeId='attr_vein_path'; viewAttributeReadOnly=$true} $sValue 'attr_vein_path'))
$allComps.Add((C 'id_rsub_lbl'  $wIdn 'text' 0 182 90  28 @{value='Ronin Path'} $sLabel))
$allComps.Add((C 'id_rsub_val'  $wIdn 'text' 94 182 206 28 @{viewAttributeId='attr_ronin_path'; viewAttributeReadOnly=$true} $sValue 'attr_ronin_path'))
$allComps.Add((C 'id_ashp_lbl'  $wIdn 'text' 0 214 90  28 @{value='Ashfoot Path'} $sLabel))
$allComps.Add((C 'id_ashp_val'  $wIdn 'text' 94 214 206 28 @{viewAttributeId='attr_ashfoot_path'; viewAttributeReadOnly=$true} $sValue 'attr_ashfoot_path'))
$allComps.Add((C 'id_vlbp_lbl'  $wIdn 'text' 0 246 90  28 @{value='Veilblade Path'} $sLabel))
$allComps.Add((C 'id_vlbp_val'  $wIdn 'text' 94 246 206 28 @{viewAttributeId='attr_veilblade_path'; viewAttributeReadOnly=$true} $sValue 'attr_veilblade_path'))

$allComps.Add((C 'id_hdr_aug'   $wIdn 'text' 0 282 300 18 @{value='— FORGED AUGMENTATIONS ───────────────'} $sHeader))
$allComps.Add((C 'id_aug1_lbl'  $wIdn 'text' 0 304 60  28 @{value='Slot 1'} $sLabel))
$allComps.Add((C 'id_aug1_val'  $wIdn 'text' 64 304 234 28 @{viewAttributeId='attr_forged_aug_1'; viewAttributeReadOnly=$true} $sValue 'attr_forged_aug_1'))
$allComps.Add((C 'id_aug2_lbl'  $wIdn 'text' 0 336 60  28 @{value='Slot 2'} $sLabel))
$allComps.Add((C 'id_aug2_val'  $wIdn 'text' 64 336 234 28 @{viewAttributeId='attr_forged_aug_2'; viewAttributeReadOnly=$true} $sValue 'attr_forged_aug_2'))

# ─────────────────────────────────────────────────────────────────────────────
# WIN_MONSTER_COMBAT
# ─────────────────────────────────────────────────────────────────────────────

$allComps.Add((C 'mn_hdr_idn'   $wMon 'text' 0 0   300 18 @{value='— MONSTER IDENTITY ───────────────────'} $sHeader))
$allComps.Add((C 'mn_tier_lbl'  $wMon 'text' 0 22  60  28 @{value='Tier'} $sLabel))
$allComps.Add((C 'mn_tier_val'  $wMon 'text' 64 22  236 28 @{viewAttributeId='attr_monster_tier'; viewAttributeReadOnly=$true} $sValue 'attr_monster_tier'))
$allComps.Add((C 'mn_role_lbl'  $wMon 'text' 0 54  60  28 @{value='Role'} $sLabel))
$allComps.Add((C 'mn_role_val'  $wMon 'text' 64 54  236 28 @{viewAttributeId='attr_monster_role'; viewAttributeReadOnly=$true} $sValue 'attr_monster_role'))
$allComps.Add((C 'mn_thrt_lbl'  $wMon 'text' 0 86  80  28 @{value='Threat State'} $sLabel))
$allComps.Add((C 'mn_thrt_val'  $wMon 'text' 84 86  216 28 @{viewAttributeId='attr_monster_threat_state'; viewAttributeReadOnly=$true} $sValue 'attr_monster_threat_state'))
$allComps.Add((C 'mn_tgt_lbl'   $wMon 'text' 0 118 80  28 @{value='Target Lock'} $sLabel))
$allComps.Add((C 'mn_tgt_val'   $wMon 'text' 84 118 216 28 @{viewAttributeId='attr_monster_target_lock'; viewAttributeReadOnly=$true} $sValue 'attr_monster_target_lock'))

$allComps.Add((C 'mn_hdr_hp'    $wMon 'text' 0 154 300 18 @{value='— HEALTH ────────────────────────────'} $sHeader))
$allComps.Add((C 'mn_hp_graph'  $wMon 'graph' 0 176 300 26 @{numeratorAttributeId='attr_current_hp'; denominatorAttributeId='attr_max_hp'; graphVariant='horizontal-linear'; inverseFill=$false} $sGrHp))
$allComps.Add((C 'mn_hp_curr'   $wMon 'input' 0 206 90  36 @{viewAttributeId='attr_current_hp'; viewAttributeReadOnly=$false; type='number'; placeholder='HP'} $sInput 'attr_current_hp'))
$allComps.Add((C 'mn_hp_sep'    $wMon 'text'  94 206 20 36 @{value='/'} $sSep))
$allComps.Add((C 'mn_hp_max'    $wMon 'text'  118 206 90 36 @{viewAttributeId='attr_max_hp'; viewAttributeReadOnly=$true} $sValue 'attr_max_hp'))
$allComps.Add((C 'mn_hp_lbl'    $wMon 'text'  214 206 86 36 @{value='HP'} $sLabel))

$allComps.Add((C 'mn_hdr_ap'    $wMon 'text' 0 250 300 18 @{value='— ACTION POINTS ──────────────────────'} $sHeader))
$allComps.Add((C 'mn_ap_graph'  $wMon 'graph' 0 272 300 26 @{numeratorAttributeId='attr_monster_ap_current'; denominatorAttributeId='attr_monster_ap_max'; graphVariant='horizontal-linear'; inverseFill=$false} $sGrMon))
$allComps.Add((C 'mn_ap_curr'   $wMon 'input' 0 302 90  36 @{viewAttributeId='attr_monster_ap_current'; viewAttributeReadOnly=$false; type='number'; placeholder='AP'} $sInput 'attr_monster_ap_current'))
$allComps.Add((C 'mn_ap_sep'    $wMon 'text'  94 302 20 36 @{value='/'} $sSep))
$allComps.Add((C 'mn_ap_max'    $wMon 'text'  118 302 90 36 @{viewAttributeId='attr_monster_ap_max'; viewAttributeReadOnly=$true} $sValue 'attr_monster_ap_max'))
$allComps.Add((C 'mn_ap_lbl'    $wMon 'text'  214 302 86 36 @{value='AP'} $sLabel))

$allComps.Add((C 'mn_hdr_trn'   $wMon 'text' 0 346 300 18 @{value='— TURN STATE ────────────────────────'} $sHeader))
$allComps.Add((C 'mn_turn_chk'  $wMon 'checkbox' 0 368 148 28 @{viewAttributeId='attr_active_turn'} $sCheck 'attr_active_turn'))
$allComps.Add((C 'mn_react_chk' $wMon 'checkbox' 152 368 148 28 @{viewAttributeId='attr_monster_reaction_card_used'} $sCheck 'attr_monster_reaction_card_used'))
$allComps.Add((C 'mn_mcrd_lbl'  $wMon 'text' 0 400 90  28 @{value='Cards Played'} $sLabel))
$allComps.Add((C 'mn_mcrd_val'  $wMon 'text' 94 400 206 28 @{viewAttributeId='attr_monster_cards_played_this_turn'; viewAttributeReadOnly=$true} (Merge $sValue @{fontSize=11; textAlign='start'; paddingLeft=6}) 'attr_monster_cards_played_this_turn'))
$allComps.Add((C 'mn_mbau_chk'  $wMon 'checkbox' 0 432 300 28 @{viewAttributeId='attr_monster_basic_attack_used_this_turn'} $sCheck 'attr_monster_basic_attack_used_this_turn'))

Write-Host "Components built: $($allComps.Count)"

# ═══════════════════════════════════════════════════════════════════════════
# WINDOWS
# ═══════════════════════════════════════════════════════════════════════════

$windows = @(
    [PSCustomObject]@{ id=$wCbt; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Combat Core';     category='character'; description='Core combat stats: HP, AP, Guard, Status, Turn Tracker'; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$wRes; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Class Resources'; category='character'; description='Class-specific resource pools and state toggles';            hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$wIdn; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Identity';        category='character'; description='Species, Class, Level, Subclass Path, Augmentation Slots'; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$wMon; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Monster Combat';  category='monster';   description='Monster tier, role, HP, AP, and turn tracking';            hideFromPlayerView=$false }
)

# ═══════════════════════════════════════════════════════════════════════════
# PAGES
# ═══════════════════════════════════════════════════════════════════════════

$pages = @(
    [PSCustomObject]@{ id=$pCbt; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; label='Combat';       category='character'; backgroundColor='#0b0b1a'; backgroundOpacity=1; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$pIdn; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; label='Identity';     category='character'; backgroundColor='#0b0b1a'; backgroundOpacity=1; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$pMon; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; label='Monster Sheet'; category='monster';  backgroundColor='#0a0a12'; backgroundOpacity=1; hideFromPlayerView=$false }
)

# ═══════════════════════════════════════════════════════════════════════════
# RULESET WINDOWS (page layout)
# ═══════════════════════════════════════════════════════════════════════════

$rulesetWindows = @(
    [PSCustomObject]@{ id='rw_combat_cbt';   createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Combat Core';     windowId=$wCbt; pageId=$pCbt; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='rw_resources_cbt'; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Class Resources'; windowId=$wRes; pageId=$pCbt; x=330; y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='rw_identity_idn'; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Identity';        windowId=$wIdn; pageId=$pIdn; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='rw_monster_mon';  createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Monster Combat';  windowId=$wMon; pageId=$pMon; x=10;  y=10; isCollapsed=$false; displayScale=1 }
)

# ═══════════════════════════════════════════════════════════════════════════
# CHARACTER PAGES (test character → pages)
# ═══════════════════════════════════════════════════════════════════════════

$charPages = @(
    [PSCustomObject]@{ id='cp_test_combat';   createdAt=$ts; updatedAt=$ts; rulesetId=$rid; characterId=$testId; pageId=$pCbt; label='Combat';        category='character'; backgroundColor='#0b0b1a'; backgroundOpacity=1; sheetFitToViewport=$false }
    [PSCustomObject]@{ id='cp_test_identity'; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; characterId=$testId; pageId=$pIdn; label='Identity';       category='character'; backgroundColor='#0b0b1a'; backgroundOpacity=1; sheetFitToViewport=$false }
    [PSCustomObject]@{ id='cp_test_monster';  createdAt=$ts; updatedAt=$ts; rulesetId=$rid; characterId=$testId; pageId=$pMon; label='Monster Sheet';  category='monster';   backgroundColor='#0a0a12'; backgroundOpacity=1; sheetFitToViewport=$false }
)

# ═══════════════════════════════════════════════════════════════════════════
# CHARACTER WINDOWS (test character window positions)
# ═══════════════════════════════════════════════════════════════════════════

$charWindows = @(
    [PSCustomObject]@{ id='cw_test_cbt_core'; createdAt=$ts; updatedAt=$ts; title='Combat Core';     characterId=$testId; characterPageId='cp_test_combat';   windowId=$wCbt; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='cw_test_cbt_res';  createdAt=$ts; updatedAt=$ts; title='Class Resources'; characterId=$testId; characterPageId='cp_test_combat';   windowId=$wRes; x=330; y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='cw_test_idn';      createdAt=$ts; updatedAt=$ts; title='Identity';        characterId=$testId; characterPageId='cp_test_identity'; windowId=$wIdn; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='cw_test_mon';      createdAt=$ts; updatedAt=$ts; title='Monster Combat';  characterId=$testId; characterPageId='cp_test_monster';  windowId=$wMon; x=10;  y=10; isCollapsed=$false; displayScale=1 }
)

# ═══════════════════════════════════════════════════════════════════════════
# WRITE ALL FILES
# ═══════════════════════════════════════════════════════════════════════════

[IO.File]::WriteAllText("$appdata\components.json",      ($allComps      | ConvertTo-Json -Depth 10), $enc)
[IO.File]::WriteAllText("$appdata\windows.json",         ($windows       | ConvertTo-Json -Depth 4),  $enc)
[IO.File]::WriteAllText("$appdata\pages.json",           ($pages         | ConvertTo-Json -Depth 4),  $enc)
[IO.File]::WriteAllText("$appdata\rulesetWindows.json",  ($rulesetWindows| ConvertTo-Json -Depth 4),  $enc)
[IO.File]::WriteAllText("$appdata\characterPages.json",  ($charPages     | ConvertTo-Json -Depth 4),  $enc)
[IO.File]::WriteAllText("$appdata\characterWindows.json",($charWindows   | ConvertTo-Json -Depth 4),  $enc)
Write-Host "All sheet files written."

# ═══════════════════════════════════════════════════════════════════════════
# UPDATE METADATA COUNTS
# ═══════════════════════════════════════════════════════════════════════════

$meta = Get-Content "$appdata\metadata.json" -Raw | ConvertFrom-Json
$meta.counts.windows         = $windows.Count
$meta.counts.components      = $allComps.Count
$meta.counts.pages           = $pages.Count
$meta.counts.rulesetWindows  = $rulesetWindows.Count
$meta.counts.characterWindows= $charWindows.Count
$meta.counts.characterPages  = $charPages.Count
[IO.File]::WriteAllText("$appdata\metadata.json", ($meta | ConvertTo-Json -Depth 6), $enc)
Write-Host "Metadata updated: $($allComps.Count) components, $($pages.Count) pages, $($windows.Count) windows."

# ═══════════════════════════════════════════════════════════════════════════
# REBUILD ZIP
# ═══════════════════════════════════════════════════════════════════════════

Add-Type -Assembly System.IO.Compression.FileSystem
Add-Type -Assembly System.IO.Compression

$dest = 'c:\Users\nroberts\TechnoNinja\tesshari_0.3.0.zip'
if (Test-Path $dest) { Remove-Item $dest }
$stream  = [IO.File]::Open($dest, [IO.FileMode]::Create)
$archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
Get-ChildItem -Path $base -Recurse -File | ForEach-Object {
    $rel   = $_.FullName.Substring($base.Length + 1).Replace('\','/')
    $entry = $archive.CreateEntry($rel, [IO.Compression.CompressionLevel]::Optimal)
    $es    = $entry.Open(); $fs = [IO.File]::OpenRead($_.FullName)
    $fs.CopyTo($es); $fs.Close(); $es.Close()
}
$archive.Dispose(); $stream.Close()
Write-Host "tesshari_0.3.0.zip rebuilt with sheets."
