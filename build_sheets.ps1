$base    = 'c:\Users\nroberts\TechnoNinja\FullQuestboundReadyToZip'
$appdata = "$base\application data"
$rid     = '4244b851-579a-4e85-b8e5-2932326df9ed'
$testId  = '0a0fa763-a1b8-408a-982a-4f91a4c94b0b'
$ts      = '2026-04-02T18:10:45.240Z'
$enc     = [System.Text.UTF8Encoding]::new($false)

# =============================================================================
# STYLE PRESETS
# =============================================================================

# Card panel background
$sCard = @{
    opacity=1; backgroundColor='#0d0d22';
    outlineWidth=1; outlineColor='#1c1c3c';
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
    boxShadow='0 2px 12px rgba(0,0,0,0.6)'
}

# Section header bar (dark, slightly different from card)
$sHdrBar = @{
    opacity=1; backgroundColor='#16163a';
    outlineWidth=0;
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0
}

# Diamond ornament (used with rotation=45 on the component)
$sDia = @{
    opacity=1; backgroundColor='#c8a84b';
    outlineWidth=0;
    borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0
}

# Section header text (centered gold, bold)
$sHdrTxt = @{
    opacity=1; color='#e0ca60'; fontSize=12; fontWeight='700';
    outlineWidth=0;
    borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    textAlign='center'; verticalAlign='center'
}

# Field label (muted blue-grey)
$sLbl = @{
    opacity=1; color='#6060a0'; fontSize=12; fontWeight='400';
    outlineWidth=0;
    borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    textAlign='start'; verticalAlign='center'; paddingLeft=4
}

# LARGE editable input — HP / AP current
$sBig = @{
    opacity=1; color='#ffffff'; fontSize=28; fontWeight='700';
    outlineWidth=2; outlineColor='#3030a0';
    borderRadiusTopLeft=6; borderRadiusTopRight=6;
    borderRadiusBottomLeft=6; borderRadiusBottomRight=6;
    backgroundColor='#111136'; verticalAlign='center'; textAlign='center';
    boxShadow='inset 0 1px 5px rgba(0,0,0,0.7)'
}

# MEDIUM editable input — HP / AP max
$sMed = @{
    opacity=1; color='#a0a0e0'; fontSize=18; fontWeight='600';
    outlineWidth=1; outlineColor='#222260';
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
    backgroundColor='#080820'; verticalAlign='center'; textAlign='center'
}

# SMALL editable number input — resources, guard, level, zone radius
$sNum = @{
    opacity=1; color='#d8d8ff'; fontSize=15; fontWeight='600';
    outlineWidth=1; outlineColor='#2020a0';
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
    backgroundColor='#080820'; verticalAlign='center'; textAlign='center'
}

# TEXT input — editable string fields (paths, aug slots, monster info)
$sTxt = @{
    opacity=1; color='#d8d8ff'; fontSize=13; fontWeight='500';
    outlineWidth=1; outlineColor='#2020a0';
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
    backgroundColor='#080820'; verticalAlign='center'; textAlign='start';
    paddingLeft=6
}

# READ-ONLY display — species, class (set by archetype)
$sDsp = @{
    opacity=1; color='#c0c0e8'; fontSize=14; fontWeight='500';
    outlineWidth=1; outlineColor='#1a1a50';
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
    backgroundColor='#080820'; verticalAlign='center'; textAlign='center'
}

# Separator "/"
$sSep = @{
    opacity=0.35; color='#9090c0'; fontSize=22; fontWeight='200';
    outlineWidth=0;
    borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    verticalAlign='center'; textAlign='center'
}

# Progress bars
$sGrHp  = @{ opacity=1; backgroundColor='#8b0000'; outlineWidth=0;
             borderRadiusTopLeft=2; borderRadiusTopRight=2;
             borderRadiusBottomLeft=2; borderRadiusBottomRight=2 }
$sGrAp  = @{ opacity=1; backgroundColor='#0d4f8c'; outlineWidth=0;
             borderRadiusTopLeft=2; borderRadiusTopRight=2;
             borderRadiusBottomLeft=2; borderRadiusBottomRight=2 }
$sGrMon = @{ opacity=1; backgroundColor='#7a4800'; outlineWidth=0;
             borderRadiusTopLeft=2; borderRadiusTopRight=2;
             borderRadiusBottomLeft=2; borderRadiusBottomRight=2 }

# Portrait background placeholder
$sPortBg = @{
    opacity=1; backgroundColor='#080818';
    outlineWidth=1; outlineColor='#2a2a6a';
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=4; borderRadiusBottomRight=4
}

# Stat name label (bright, bold — these are primary game stats)
$sStatLbl = @{
    opacity=1; color='#b0b8e8'; fontSize=13; fontWeight='700';
    outlineWidth=0;
    borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    textAlign='start'; verticalAlign='center'; paddingLeft=4
}

# Muted small descriptor (e.g., "melee damage · force")
$sStatNote = @{
    opacity=0.4; color='#9090c8'; fontSize=11; fontWeight='400';
    outlineWidth=0;
    borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    textAlign='start'; verticalAlign='center'; paddingLeft=4
}

# Formula text — gold, centered (for HP = (FRAME×8) + X)
$sFormula = @{
    opacity=0.9; color='#c8a84b'; fontSize=14; fontWeight='600';
    outlineWidth=0;
    borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    textAlign='center'; verticalAlign='center'
}

# Question label (dim white, used for narrative prompts)
$sQLabel = @{
    opacity=0.65; color='#a8a8d8'; fontSize=12; fontWeight='600';
    outlineWidth=0;
    borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    textAlign='start'; verticalAlign='center'; paddingLeft=2
}

# =============================================================================
# HELPERS
# =============================================================================

function Merge($base, $over) {
    $r = @{}
    foreach ($k in $base.Keys) { $r[$k] = $base[$k] }
    foreach ($k in $over.Keys)  { $r[$k] = $over[$k]  }
    return $r
}

function C($id, $winId, $type, $x, $y, $w, $h, $data, $style,
           $attrId=$null, $actionId=$null, $scriptId=$null, $childWinId=$null) {
    [PSCustomObject]@{
        id                = $id
        createdAt         = $ts; updatedAt = $ts
        rulesetId         = $rid
        windowId          = $winId
        type              = $type
        x                 = $x; y = $y; z = 0
        width             = $w; height = $h; rotation = 0
        data              = ($data  | ConvertTo-Json -Compress)
        style             = ($style | ConvertTo-Json -Compress)
        locked            = $false
        groupId           = $null; parentComponentId = $null
        attributeId       = $attrId
        actionId          = $actionId
        scriptId          = $scriptId
        childWindowId     = $childWinId
    }
}

# Background card shape
function BG($id, $winId, $x, $y, $w, $h) {
    C $id $winId 'shape' $x $y $w $h @{sides=4} $sCard
}

# Clickable toggle checkbox: outlined box + fill that appears when true + label text.
# Adds 3 components. $attr is the boolean attribute id the click toggles.
function AddChk([System.Collections.Generic.List[PSCustomObject]]$list, $pfx, $win, $x, $y, $w, $h, $attr, $label) {
    $boxStyle = @{
        opacity=1; backgroundColor='#111136'; outlineWidth=1; outlineColor='#3030a0';
        borderRadiusTopLeft=3; borderRadiusTopRight=3;
        borderRadiusBottomLeft=3; borderRadiusBottomRight=3
    }
    $fillStyle = @{
        opacity=1; backgroundColor='#8888c8'; outlineWidth=0;
        borderRadiusTopLeft=2; borderRadiusTopRight=2;
        borderRadiusBottomLeft=2; borderRadiusBottomRight=2
    }
    $bgY = $y + [Math]::Floor(($h - 20) / 2)
    $list.Add((C "${pfx}_bg" $win 'shape' $x $bgY 20 20 @{sides=4; toggleBooleanAttributeId=$attr} $boxStyle $attr))
    $list.Add((C "${pfx}_fl" $win 'shape' ($x+4) ($bgY+4) 12 12 @{sides=4; conditionalRenderAttributeId=$attr; toggleBooleanAttributeId=$attr} $fillStyle $attr))
    $list.Add((C "${pfx}_lb" $win 'text' ($x+26) $y ($w-26) $h @{value=$label} $sLbl))
}

# Decorated section header: dark bar + left/right gold diamonds + centered label
# Adds 4 components to $list. Header height is always 28px.
function AddHdr([System.Collections.Generic.List[PSCustomObject]]$list, $pfx, $win, $x, $y, $w, $label) {
    # Header bar background
    $bar = C "${pfx}_hb" $win 'shape' $x $y $w 28 @{sides=4} $sHdrBar
    $list.Add($bar)
    # Left diamond ornament (rotated square)
    $ld = C "${pfx}_ld" $win 'shape' ($x+10) ($y+9) 10 10 @{sides=4} $sDia
    $ld.rotation = 45
    $list.Add($ld)
    # Right diamond ornament
    $rd = C "${pfx}_rd" $win 'shape' ($x+$w-20) ($y+9) 10 10 @{sides=4} $sDia
    $rd.rotation = 45
    $list.Add($rd)
    # Header label text
    $txt = C "${pfx}_ht" $win 'text' $x $y $w 28 @{value=$label} $sHdrTxt
    $list.Add($txt)
}

# =============================================================================
# IDs
# =============================================================================
$wCbt = 'win_combat_core'
$wRes = 'win_class_resources'
$wIdn = 'win_identity'
$wMon = 'win_monster_combat'
$wSts = 'win_stats'
$wBkg = 'win_background'

$pCbt = 'page_character_combat'
$pIdn = 'page_character_identity'
$pMon = 'page_monster_sheet'
$pCre = 'page_character_creation'

$allComps = [System.Collections.Generic.List[PSCustomObject]]::new()

# =============================================================================
# WIN_COMBAT_CORE  (360px wide)
# Sections: HEALTH | ACTION POINTS | DEFENSE & STATE | ACTIVE STATUSES | TURN TRACKER
# =============================================================================

# --- Card backgrounds ---
$allComps.Add((BG 'cc_bg_hp'  $wCbt  0   0   360 116))
$allComps.Add((BG 'cc_bg_ap'  $wCbt  0   124 360 116))
$allComps.Add((BG 'cc_bg_def' $wCbt  0   248 360 70))
$allComps.Add((BG 'cc_bg_sts' $wCbt  0   326 360 118))
$allComps.Add((BG 'cc_bg_trk' $wCbt  0   452 360 86))

# --- HEALTH ---
AddHdr $allComps 'cc_hp' $wCbt 0 0 360 'HEALTH'
$allComps.Add((C 'cc_hp_graph' $wCbt 'graph' 10 32  340 18 @{numeratorAttributeId='attr_current_hp'; denominatorAttributeId='attr_max_hp'; graphVariant='horizontal-linear'; inverseFill=$false} $sGrHp))
$allComps.Add((C 'cc_hp_curr'  $wCbt 'comp-input' 10 54  130 56 @{viewAttributeId='attr_current_hp'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sBig 'attr_current_hp'))
$allComps.Add((C 'cc_hp_sep'   $wCbt 'text'  144 54  18  56 @{value='/'} $sSep))
$allComps.Add((C 'cc_hp_max'   $wCbt 'comp-input' 166 54  110 56 @{viewAttributeId='attr_max_hp'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sMed 'attr_max_hp'))
$allComps.Add((C 'cc_hp_lbl'   $wCbt 'text'  280 54  70  56 @{value='HP'} $sLbl))

# --- ACTION POINTS ---
AddHdr $allComps 'cc_ap' $wCbt 0 124 360 'ACTION POINTS'
$allComps.Add((C 'cc_ap_graph' $wCbt 'graph' 10 156 340 18 @{numeratorAttributeId='attr_ap_current'; denominatorAttributeId='attr_ap_max'; graphVariant='horizontal-linear'; inverseFill=$false} $sGrAp))
$allComps.Add((C 'cc_ap_curr'  $wCbt 'comp-input' 10 178 130 56 @{viewAttributeId='attr_ap_current'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sBig 'attr_ap_current'))
$allComps.Add((C 'cc_ap_sep'   $wCbt 'text'  144 178 18  56 @{value='/'} $sSep))
$allComps.Add((C 'cc_ap_max'   $wCbt 'comp-input' 166 178 110 56 @{viewAttributeId='attr_ap_max'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sMed 'attr_ap_max'))
$allComps.Add((C 'cc_ap_lbl'   $wCbt 'text'  280 178 70  56 @{value='AP'} $sLbl))

# --- DEFENSE & STATE ---
AddHdr $allComps 'cc_def' $wCbt 0 248 360 'DEFENSE & STATE'
$allComps.Add((C 'cc_grd_lbl'  $wCbt 'text'     10  280 104 34 @{value='Guard Value'} $sLbl))
$allComps.Add((C 'cc_grd_val'  $wCbt 'comp-input'    118 280 76  34 @{viewAttributeId='attr_guard_value'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_guard_value'))
AddChk $allComps 'cc_turn' $wCbt 200 280 150 34 'attr_active_turn' 'Active Turn'

# --- ACTIVE STATUSES ---
AddHdr $allComps 'cc_sts' $wCbt 0 326 360 'ACTIVE STATUSES'
$allComps.Add((C 'cc_sts_val'  $wCbt 'text' 10 358 340 80 @{viewAttributeId='attr_status_list'; viewAttributeReadOnly=$true} (Merge $sDsp @{verticalAlign='start'; textAlign='start'; fontSize=12; paddingLeft=6; paddingTop=4}) 'attr_status_list'))

# --- TURN TRACKER ---
AddHdr $allComps 'cc_trk' $wCbt 0 452 360 'TURN TRACKER'
$allComps.Add((C 'cc_crd_lbl'  $wCbt 'text'     10  484 108 26 @{value='Cards Played'} $sLbl))
$allComps.Add((C 'cc_crd_val'  $wCbt 'text'     122 484 228 26 @{viewAttributeId='attr_cards_played_this_turn'; viewAttributeReadOnly=$true} (Merge $sDsp @{fontSize=12; textAlign='start'; paddingLeft=6}) 'attr_cards_played_this_turn'))
AddChk $allComps 'cc_bau' $wCbt 10  514 170 20 'attr_basic_attack_used_this_turn' 'Basic Attack Used'
AddChk $allComps 'cc_lck' $wCbt 186 514 164 20 'attr_card_play_locked' 'Card Play Locked'

# =============================================================================
# WIN_CLASS_RESOURCES  (380px wide)
# Editable number inputs for all resource counters
# Row layout: label (left) | input (right) [| optional checkbox far right]
# =============================================================================

$allComps.Add((BG 'cr_bg_res' $wRes  0   0   380 268))
$allComps.Add((BG 'cr_bg_dmy' $wRes  0   276 380 118))
$allComps.Add((BG 'cr_bg_tgl' $wRes  0   402 380 96))
$allComps.Add((BG 'cr_bg_oth' $wRes  0   506 380 100))

# --- CLASS RESOURCES ---
AddHdr $allComps 'cr_res' $wRes 0 0 380 'CLASS RESOURCES'

# Echo Speaker — Grief Stacks
$allComps.Add((C 'cr_grief_lbl' $wRes 'text'  10  34  156 28 @{value='Grief Stacks'} $sLbl))
$allComps.Add((C 'cr_grief_inp' $wRes 'comp-input' 170 34  70  28 @{viewAttributeId='attr_echo_speaker_grief_stacks'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_echo_speaker_grief_stacks'))

# Shell Dancer — Cascade Count + In Shell Step
$allComps.Add((C 'cr_casc_lbl'  $wRes 'text'     10  68  140 28 @{value='Cascade Count'} $sLbl))
$allComps.Add((C 'cr_casc_inp'  $wRes 'comp-input'    154 68  66  28 @{viewAttributeId='attr_shell_dancer_cascade_count'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_shell_dancer_cascade_count'))
AddChk $allComps 'cr_shlstp' $wRes 228 68  142 28 'attr_shell_dancer_in_shell_step' 'In Shell Step'

# Fracture Knight — Phantom Charges + Fracture Self
$allComps.Add((C 'cr_phnt_lbl'  $wRes 'text'  10  102 156 28 @{value='Phantom Charges'} $sLbl))
$allComps.Add((C 'cr_phnt_inp'  $wRes 'comp-input' 170 102 70  28 @{viewAttributeId='attr_fracture_knight_phantom_charges'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_fracture_knight_phantom_charges'))
$allComps.Add((C 'cr_frac_lbl'  $wRes 'text'  10  136 140 28 @{value='Fracture Stacks'} $sLbl))
$allComps.Add((C 'cr_frac_inp'  $wRes 'comp-input' 154 136 66  28 @{viewAttributeId='attr_fracture_knight_fracture_stacks_self'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_fracture_knight_fracture_stacks_self'))

# Puppet Binder — Binding Threads + Vessel Active
$allComps.Add((C 'cr_bind_lbl'  $wRes 'text'     10  170 140 28 @{value='Binding Threads'} $sLbl))
$allComps.Add((C 'cr_bind_inp'  $wRes 'comp-input'    154 170 66  28 @{viewAttributeId='attr_puppet_binder_binding_threads'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_puppet_binder_binding_threads'))
AddChk $allComps 'cr_vess' $wRes 228 170 142 28 'attr_puppet_binder_vessel_active' 'Vessel Active'

# Curse Eater — Loaded Count | Corruption
$allComps.Add((C 'cr_load_lbl'  $wRes 'text'  10  204 108 28 @{value='Loaded Count'} $sLbl))
$allComps.Add((C 'cr_load_inp'  $wRes 'comp-input' 122 204 60  28 @{viewAttributeId='attr_curse_eater_loaded_count'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_curse_eater_loaded_count'))
$allComps.Add((C 'cr_corr_lbl'  $wRes 'text'  192 204 86  28 @{value='Corruption'} $sLbl))
$allComps.Add((C 'cr_corr_inp'  $wRes 'comp-input' 282 204 88  28 @{viewAttributeId='attr_curse_eater_corruption_points'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_curse_eater_corruption_points'))

# Oni Hunter — Quarry Marked + Dissolution
AddChk $allComps 'cr_qrry' $wRes 10  238 148 28 'attr_oni_hunter_quarry_marked' 'Quarry Marked'
$allComps.Add((C 'cr_diss_lbl'  $wRes 'text'     166 238 80  28 @{value='Dissolution'} $sLbl))
$allComps.Add((C 'cr_diss_inp'  $wRes 'comp-input'    250 238 120 28 @{viewAttributeId='attr_oni_hunter_dissolution_resonance'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_oni_hunter_dissolution_resonance'))

# --- DAIMYO / HERALD ---
AddHdr $allComps 'cr_dmy' $wRes 0 276 380 'DAIMYO / HERALD'

# Shadow Daimyo — Intelligence | Contacts
$allComps.Add((C 'cr_intel_lbl' $wRes 'text'  10  310 90  30 @{value='Intelligence'} $sLbl))
$allComps.Add((C 'cr_intel_inp' $wRes 'comp-input' 104 310 66  30 @{viewAttributeId='attr_shadow_daimyo_intelligence'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_shadow_daimyo_intelligence'))
$allComps.Add((C 'cr_cont_lbl'  $wRes 'text'  180 310 80  30 @{value='Contacts'} $sLbl))
$allComps.Add((C 'cr_cont_inp'  $wRes 'comp-input' 264 310 106 30 @{viewAttributeId='attr_shadow_daimyo_contacts'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_shadow_daimyo_contacts'))

# Iron Herald — Command Zone Active + Radius
AddChk $allComps 'cr_czact' $wRes 10  346 158 30 'attr_iron_herald_command_zone_active' 'Command Zone'
$allComps.Add((C 'cr_czrad_lbl' $wRes 'text'     174 346 84  30 @{value='Zone Radius'} $sLbl))
$allComps.Add((C 'cr_czrad_inp' $wRes 'comp-input'    262 346 108 30 @{viewAttributeId='attr_iron_herald_command_zone_radius'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_iron_herald_command_zone_radius'))

# --- STATE TOGGLES ---
AddHdr $allComps 'cr_tgl' $wRes 0 402 380 'STATE TOGGLES'
AddChk $allComps 'cr_incorp' $wRes 10  434 178 26 'attr_void_walker_incorporeal_state' 'Incorporeal'
AddChk $allComps 'cr_btwn'   $wRes 196 434 174 26 'attr_iron_monk_between_state' 'Between'
AddChk $allComps 'cr_blhf'   $wRes 10  464 178 26 'attr_iron_monk_below_half_bonus' 'Below Half Bonus'
AddChk $allComps 'cr_pcns'   $wRes 196 464 174 26 'attr_pulse_caller_preconscious_fire' 'Preconscious Fire'

# --- OTHER RESOURCES ---
AddHdr $allComps 'cr_oth' $wRes 0 506 380 'OTHER RESOURCES'
$allComps.Add((C 'cr_ast_lbl'    $wRes 'text'  10  538 86  28 @{value='Active Stat'} $sLbl))
$allComps.Add((C 'cr_ast_inp'    $wRes 'comp-input' 100 538 120 28 @{viewAttributeId='attr_unnamed_active_stat'; viewAttributeReadOnly=$false; type='text'; placeholder='stat'} $sTxt 'attr_unnamed_active_stat'))
$allComps.Add((C 'cr_xpd_lbl'    $wRes 'text'  228 538 90  28 @{value='Exp. Designs'} $sLbl))
$allComps.Add((C 'cr_xpd_inp'    $wRes 'comp-input' 322 538 48  28 @{viewAttributeId='attr_chrome_shaper_experimental_designs'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_chrome_shaper_experimental_designs'))
$allComps.Add((C 'cr_echo_lbl'   $wRes 'text'  10  570 120 28 @{value='Echomind Level'} $sLbl))
$allComps.Add((C 'cr_echo_inp'   $wRes 'comp-input' 134 570 66  28 @{viewAttributeId='attr_sutensai_echomind_reading_level'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_sutensai_echomind_reading_level'))
$allComps.Add((C 'cr_hptier_lbl' $wRes 'text'  208 570 70  28 @{value='HP Tier'} $sLbl))
$allComps.Add((C 'cr_hptier_inp' $wRes 'comp-input' 282 570 88  28 @{viewAttributeId='attr_flesh_shaper_hp_tier'; viewAttributeReadOnly=$false; type='text'; placeholder='full'} $sTxt 'attr_flesh_shaper_hp_tier'))

# =============================================================================
# WIN_IDENTITY  (340px wide)
# Portrait + Identity | Subclass Path | Forged Augmentations
# =============================================================================

$allComps.Add((BG 'id_bg_port' $wIdn  0   0   340 160))
$allComps.Add((BG 'id_bg_idn'  $wIdn  0   168 340 148))
$allComps.Add((BG 'id_bg_sub'  $wIdn  0   324 340 164))
$allComps.Add((BG 'id_bg_aug'  $wIdn  0   496 340 100))

# --- CHARACTER PORTRAIT ---
$allComps.Add((C 'id_portrait' $wIdn 'image' 10 10 140 140 @{useCharacterImage=$true; altText='Character Portrait'} @{
    opacity=1; outlineWidth=1; outlineColor='#2a2a6a';
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
    backgroundColor='#060616'
}))
# Species + Class displayed next to portrait
$allComps.Add((C 'id_spc_lbl'  $wIdn 'text'  158 14  50  22 @{value='Species'} $sLbl))
$allComps.Add((C 'id_spc_dsp'  $wIdn 'text'  158 38  174 34 @{viewAttributeId='attr_species'; viewAttributeReadOnly=$true} $sDsp 'attr_species'))
$allComps.Add((C 'id_cls_lbl'  $wIdn 'text'  158 78  50  22 @{value='Class'} $sLbl))
$allComps.Add((C 'id_cls_dsp'  $wIdn 'text'  158 102 174 52 @{viewAttributeId='attr_class'; viewAttributeReadOnly=$true} $sDsp 'attr_class'))

# --- IDENTITY ---
AddHdr $allComps 'id_idn' $wIdn 0 168 340 'IDENTITY'
$allComps.Add((C 'id_lvl_lbl'  $wIdn 'text'  10  200 80  34 @{value='Level'} $sLbl))
$allComps.Add((C 'id_lvl_inp'  $wIdn 'comp-input' 94  200 90  34 @{viewAttributeId='attr_level'; viewAttributeReadOnly=$false; type='number'; placeholder='1'} $sNum 'attr_level'))
$allComps.Add((C 'id_lvl_note' $wIdn 'text'  190 200 140 34 @{value='(set by archetype)'} @{
    opacity=0.35; color='#8888a8'; fontSize=11; fontWeight='400';
    outlineWidth=0; borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    textAlign='start'; verticalAlign='center'; paddingLeft=4
}))
$allComps.Add((C 'id_spc_note' $wIdn 'text'  10 240 320 22 @{value='Species and Class are set by your chosen Archetype'} @{
    opacity=0.4; color='#8888a8'; fontSize=11; fontWeight='400';
    outlineWidth=0; borderRadiusTopLeft=0; borderRadiusTopRight=0;
    borderRadiusBottomLeft=0; borderRadiusBottomRight=0;
    textAlign='center'; verticalAlign='center'
}))
$allComps.Add((C 'id_arc_lbl'  $wIdn 'text'  10  268 90  26 @{value='Archetype'} $sLbl))
$allComps.Add((C 'id_arc_dsp'  $wIdn 'text'  104 268 226 26 @{value='(selected on archetype panel)'} @{
    opacity=0.4; color='#a0a0c0'; fontSize=12; fontWeight='400';
    outlineWidth=1; outlineColor='#1a1a50';
    borderRadiusTopLeft=4; borderRadiusTopRight=4;
    borderRadiusBottomLeft=4; borderRadiusBottomRight=4;
    backgroundColor='#080820'; verticalAlign='center'; textAlign='start'; paddingLeft=6
}))

# --- SUBCLASS PATH ---
AddHdr $allComps 'id_sub' $wIdn 0 324 340 'SUBCLASS PATH'
$allComps.Add((C 'id_vein_lbl' $wIdn 'text'  10  356 82  30 @{value='Vein Path'} $sLbl))
$allComps.Add((C 'id_vein_inp' $wIdn 'comp-input' 96  356 234 30 @{viewAttributeId='attr_vein_path'; viewAttributeReadOnly=$false; type='text'; placeholder='choose vein path'} $sTxt 'attr_vein_path'))
$allComps.Add((C 'id_ronin_lbl' $wIdn 'text'  10  392 82  30 @{value='Ronin Path'} $sLbl))
$allComps.Add((C 'id_ronin_inp' $wIdn 'comp-input' 96  392 234 30 @{viewAttributeId='attr_ronin_path'; viewAttributeReadOnly=$false; type='text'; placeholder='choose ronin path'} $sTxt 'attr_ronin_path'))
$allComps.Add((C 'id_ashp_lbl'  $wIdn 'text'  10  428 82  30 @{value='Ashfoot Path'} $sLbl))
$allComps.Add((C 'id_ashp_inp'  $wIdn 'comp-input' 96  428 234 30 @{viewAttributeId='attr_ashfoot_path'; viewAttributeReadOnly=$false; type='text'; placeholder='choose ashfoot path'} $sTxt 'attr_ashfoot_path'))
$allComps.Add((C 'id_vlbp_lbl'  $wIdn 'text'  10  464 82  30 @{value='Veilblade Path'} $sLbl))
$allComps.Add((C 'id_vlbp_inp'  $wIdn 'comp-input' 96  464 234 30 @{viewAttributeId='attr_veilblade_path'; viewAttributeReadOnly=$false; type='text'; placeholder='choose veilblade path'} $sTxt 'attr_veilblade_path'))

# --- FORGED AUGMENTATIONS ---
AddHdr $allComps 'id_aug' $wIdn 0 496 340 'FORGED AUGMENTATIONS'
$allComps.Add((C 'id_aug1_lbl' $wIdn 'text'  10  528 54  32 @{value='Slot 1'} $sLbl))
$allComps.Add((C 'id_aug1_inp' $wIdn 'comp-input' 68  528 262 32 @{viewAttributeId='attr_forged_aug_1'; viewAttributeReadOnly=$false; type='text'; placeholder='augmentation slot 1'} $sTxt 'attr_forged_aug_1'))
$allComps.Add((C 'id_aug2_lbl' $wIdn 'text'  10  566 54  32 @{value='Slot 2'} $sLbl))
$allComps.Add((C 'id_aug2_inp' $wIdn 'comp-input' 68  566 262 32 @{viewAttributeId='attr_forged_aug_2'; viewAttributeReadOnly=$false; type='text'; placeholder='augmentation slot 2'} $sTxt 'attr_forged_aug_2'))

# =============================================================================
# WIN_MONSTER_COMBAT  (360px wide)
# Sections: MONSTER IDENTITY | HEALTH | ACTION POINTS | TURN STATE
# =============================================================================

$allComps.Add((BG 'mn_bg_idn' $wMon  0   0   360 166))
$allComps.Add((BG 'mn_bg_hp'  $wMon  0   174 360 116))
$allComps.Add((BG 'mn_bg_ap'  $wMon  0   298 360 116))
$allComps.Add((BG 'mn_bg_trn' $wMon  0   422 360 114))

# --- MONSTER IDENTITY ---
AddHdr $allComps 'mn_idn' $wMon 0 0 360 'MONSTER IDENTITY'
$allComps.Add((C 'mn_tier_lbl' $wMon 'text'  10  32  74  32 @{value='Tier'} $sLbl))
$allComps.Add((C 'mn_tier_inp' $wMon 'comp-input' 88  32  262 32 @{viewAttributeId='attr_monster_tier'; viewAttributeReadOnly=$false; type='text'; placeholder='monster tier'} $sTxt 'attr_monster_tier'))
$allComps.Add((C 'mn_role_lbl' $wMon 'text'  10  70  74  32 @{value='Role'} $sLbl))
$allComps.Add((C 'mn_role_inp' $wMon 'comp-input' 88  70  262 32 @{viewAttributeId='attr_monster_role'; viewAttributeReadOnly=$false; type='text'; placeholder='monster role'} $sTxt 'attr_monster_role'))
$allComps.Add((C 'mn_thrt_lbl' $wMon 'text'  10  108 88  28 @{value='Threat State'} $sLbl))
$allComps.Add((C 'mn_thrt_inp' $wMon 'comp-input' 102 108 248 28 @{viewAttributeId='attr_monster_threat_state'; viewAttributeReadOnly=$false; type='text'; placeholder='threat state'} $sTxt 'attr_monster_threat_state'))
$allComps.Add((C 'mn_tgt_lbl'  $wMon 'text'  10  142 88  20 @{value='Target Lock'} $sLbl))
$allComps.Add((C 'mn_tgt_inp'  $wMon 'comp-input' 102 142 248 20 @{viewAttributeId='attr_monster_target_lock'; viewAttributeReadOnly=$false; type='text'; placeholder='target lock'} $sTxt 'attr_monster_target_lock'))

# --- HEALTH ---
AddHdr $allComps 'mn_hp' $wMon 0 174 360 'HEALTH'
$allComps.Add((C 'mn_hp_graph' $wMon 'graph' 10  206 340 18 @{numeratorAttributeId='attr_current_hp'; denominatorAttributeId='attr_max_hp'; graphVariant='horizontal-linear'; inverseFill=$false} $sGrHp))
$allComps.Add((C 'mn_hp_curr'  $wMon 'comp-input' 10  228 130 56 @{viewAttributeId='attr_current_hp'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sBig 'attr_current_hp'))
$allComps.Add((C 'mn_hp_sep'   $wMon 'text'  144 228 18  56 @{value='/'} $sSep))
$allComps.Add((C 'mn_hp_max'   $wMon 'comp-input' 166 228 110 56 @{viewAttributeId='attr_max_hp'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sMed 'attr_max_hp'))
$allComps.Add((C 'mn_hp_lbl'   $wMon 'text'  280 228 70  56 @{value='HP'} $sLbl))

# --- ACTION POINTS ---
AddHdr $allComps 'mn_ap' $wMon 0 298 360 'ACTION POINTS'
$allComps.Add((C 'mn_ap_graph' $wMon 'graph' 10  330 340 18 @{numeratorAttributeId='attr_monster_ap_current'; denominatorAttributeId='attr_monster_ap_max'; graphVariant='horizontal-linear'; inverseFill=$false} $sGrMon))
$allComps.Add((C 'mn_ap_curr'  $wMon 'comp-input' 10  352 130 56 @{viewAttributeId='attr_monster_ap_current'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sBig 'attr_monster_ap_current'))
$allComps.Add((C 'mn_ap_sep'   $wMon 'text'  144 352 18  56 @{value='/'} $sSep))
$allComps.Add((C 'mn_ap_max'   $wMon 'comp-input' 166 352 110 56 @{viewAttributeId='attr_monster_ap_max'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sMed 'attr_monster_ap_max'))
$allComps.Add((C 'mn_ap_lbl'   $wMon 'text'  280 352 70  56 @{value='AP'} $sLbl))

# --- TURN STATE ---
AddHdr $allComps 'mn_trn' $wMon 0 422 360 'TURN STATE'
AddChk $allComps 'mn_turn'  $wMon 10  454 166 28 'attr_active_turn' 'Active Turn'
AddChk $allComps 'mn_react' $wMon 184 454 166 28 'attr_monster_reaction_card_used' 'Reaction Used'
$allComps.Add((C 'mn_mcrd_lbl'  $wMon 'text'     10  486 108 28 @{value='Cards Played'} $sLbl))
$allComps.Add((C 'mn_mcrd_dsp'  $wMon 'text'     122 486 228 28 @{viewAttributeId='attr_monster_cards_played_this_turn'; viewAttributeReadOnly=$true} (Merge $sDsp @{fontSize=12; textAlign='start'; paddingLeft=6}) 'attr_monster_cards_played_this_turn'))
AddChk $allComps 'mn_mbau' $wMon 10  518 340 16 'attr_monster_basic_attack_used_this_turn' 'Basic Attack Used'

# =============================================================================
# WIN_STATS  (360px wide)
# Sections: STAT DISTRIBUTION | HP FORMULA | HAND SIZE
# =============================================================================

$allComps.Add((BG 'st_bg_dist' $wSts  0   0   360 268))
$allComps.Add((BG 'st_bg_hp'   $wSts  0   276 360 90))
$allComps.Add((BG 'st_bg_hand' $wSts  0   374 360 76))

# --- STAT DISTRIBUTION ---
AddHdr $allComps 'st_dist' $wSts 0 0 360 'STAT DISTRIBUTION'

# Row layout per stat: label(10,y,86,30) | input(100,y,56,30) | note(162,y,188,30)
$statRows = @(
    @{ pfx='st_iron'; y=34;  attr='attr_stat_iron';      lbl='IRON';      note='melee damage · force'      }
    @{ pfx='st_edge'; y=68;  attr='attr_stat_edge';      lbl='EDGE';      note='initiative · precision'    }
    @{ pfx='st_frm';  y=102; attr='attr_stat_frame';     lbl='FRAME';     note='HP · endurance'            }
    @{ pfx='st_sig';  y=136; attr='attr_stat_signal';    lbl='SIGNAL';    note='Wire Craft · hacking'      }
    @{ pfx='st_res';  y=170; attr='attr_stat_resonance'; lbl='RESONANCE'; note='spiritual · healing'       }
    @{ pfx='st_vel';  y=204; attr='attr_stat_veil';      lbl='VEIL';      note='social · concealment'      }
)
foreach ($r in $statRows) {
    $allComps.Add((C "$($r.pfx)_lbl" $wSts 'text'  10  $r.y 86  30 @{value=$r.lbl}  $sStatLbl))
    $allComps.Add((C "$($r.pfx)_inp" $wSts 'comp-input' 100 $r.y 56  30 @{viewAttributeId=$r.attr; viewAttributeReadOnly=$false; type='number'; placeholder='1'} $sNum $r.attr))
    $allComps.Add((C "$($r.pfx)_nte" $wSts 'text'  162 $r.y 188 30 @{value=$r.note} $sStatNote))
}

# Points spent tracker
$allComps.Add((C 'st_pts_lbl' $wSts 'text'  10  242 154 22 @{value='Points Spent (of 20):'} $sLbl))
$allComps.Add((C 'st_pts_inp' $wSts 'comp-input' 168 242 56  22 @{viewAttributeId='attr_stat_points_spent'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_stat_points_spent'))
$allComps.Add((C 'st_pts_nte' $wSts 'text'  232 242 118 22 @{value='max 5 per stat'} $sStatNote))

# --- HP FORMULA ---
AddHdr $allComps 'st_hp' $wSts 0 276 360 'HP FORMULA'
$allComps.Add((C 'st_hp_fml'  $wSts 'text'  10  304 134 56 @{value='(FRAME × 8) +'} $sFormula))
$allComps.Add((C 'st_hp_mod'  $wSts 'comp-input' 148 304 60  56 @{viewAttributeId='attr_hp_base_mod'; viewAttributeReadOnly=$false; type='number'; placeholder='14'} $sMed 'attr_hp_base_mod'))
$allComps.Add((C 'st_hp_eq'   $wSts 'text'  212 304 20  56 @{value='='} $sSep))
$allComps.Add((C 'st_hp_max'  $wSts 'comp-input' 236 304 114 56 @{viewAttributeId='attr_max_hp'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sBig 'attr_max_hp'))

# --- HAND SIZE ---
AddHdr $allComps 'st_hnd' $wSts 0 374 360 'HAND SIZE'
$allComps.Add((C 'st_hnd_blbl' $wSts 'text'  10  404 38  42 @{value='Base'} $sLbl))
$allComps.Add((C 'st_hnd_binp' $wSts 'comp-input' 52  404 50  42 @{viewAttributeId='attr_hand_size_base'; viewAttributeReadOnly=$false; type='number'; placeholder='6'} $sNum 'attr_hand_size_base'))
$allComps.Add((C 'st_hnd_plus' $wSts 'text'  106 404 20  42 @{value='+'} $sSep))
$allComps.Add((C 'st_hnd_rlbl' $wSts 'text'  130 404 38  42 @{value='Race'} $sLbl))
$allComps.Add((C 'st_hnd_rinp' $wSts 'comp-input' 172 404 46  42 @{viewAttributeId='attr_hand_size_race_mod'; viewAttributeReadOnly=$false; type='number'; placeholder='0'} $sNum 'attr_hand_size_race_mod'))
$allComps.Add((C 'st_hnd_eq'   $wSts 'text'  222 404 20  42 @{value='='} $sSep))
$allComps.Add((C 'st_hnd_tot'  $wSts 'comp-input' 246 404 104 42 @{viewAttributeId='attr_hand_size_total'; viewAttributeReadOnly=$false; type='number'; placeholder='6'} $sMed 'attr_hand_size_total'))

# =============================================================================
# WIN_BACKGROUND  (380px wide)
# Sections: WORLD PLACEMENT | CHARACTER QUESTIONS
# =============================================================================

$allComps.Add((BG 'bk_bg_wld' $wBkg  0   0   380 158))
$allComps.Add((BG 'bk_bg_qst' $wBkg  0   166 380 256))

# --- WORLD PLACEMENT ---
AddHdr $allComps 'bk_wld' $wBkg 0 0 380 'WORLD PLACEMENT'

$placementRows = @(
    @{ pfx='bk_rch'; y=32;  attr='attr_reach';   lbl='Reach'   }
    @{ pfx='bk_cst'; y=66;  attr='attr_caste';   lbl='Caste'   }
    @{ pfx='bk_fct'; y=100; attr='attr_faction'; lbl='Faction' }
)
foreach ($r in $placementRows) {
    $allComps.Add((C "$($r.pfx)_lbl" $wBkg 'text'  10  $r.y 68  30 @{value=$r.lbl} $sLbl))
    $allComps.Add((C "$($r.pfx)_inp" $wBkg 'comp-input' 82  $r.y 288 30 @{viewAttributeId=$r.attr; viewAttributeReadOnly=$false; type='text'; placeholder=$r.lbl} $sTxt $r.attr))
}
$allComps.Add((C 'bk_wld_nte' $wBkg 'text' 10 134 360 20 @{value='Reach · Caste · and Faction are set at character creation and rarely change.'} $sStatNote))

# --- CHARACTER QUESTIONS ---
AddHdr $allComps 'bk_qst' $wBkg 0 166 380 'CHARACTER QUESTIONS'
$allComps.Add((C 'bk_dbt_lbl' $wBkg 'text'  10  198 360 20 @{value='Who do you owe?'} $sQLabel))
$allComps.Add((C 'bk_dbt_inp' $wBkg 'comp-input' 10  222 360 64 @{viewAttributeId='attr_character_debt'; viewAttributeReadOnly=$false; type='text'; placeholder='A lord, a debt, a contract, a ghost...'} $sTxt 'attr_character_debt'))
$allComps.Add((C 'bk_ned_lbl' $wBkg 'text'  10  292 360 20 @{value='What do you need?'} $sQLabel))
$allComps.Add((C 'bk_ned_inp' $wBkg 'comp-input' 10  316 360 96 @{viewAttributeId='attr_character_need'; viewAttributeReadOnly=$false; type='text'; placeholder='Not want — need. The thing driving you into danger.'} $sTxt 'attr_character_need'))

Write-Host "Components built: $($allComps.Count)"

# =============================================================================
# WINDOWS
# =============================================================================

$windows = @(
    [PSCustomObject]@{ id=$wCbt; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Combat Core';     category='character'; description='HP, AP, Guard, Status, Turn Tracker'; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$wRes; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Class Resources'; category='character'; description='All class resource pools and toggles'; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$wIdn; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Identity';        category='character'; description='Species, Class, Level, Paths, Augmentations'; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$wMon; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Monster Combat';  category='monster';   description='Monster identity, HP, AP, turn tracking'; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$wSts; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Stats';           category='creation';  description='6 stats, points tracker, HP formula, hand size'; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$wBkg; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Background';      category='creation';  description='Reach, Caste, Faction, character questions'; hideFromPlayerView=$false }
)

# =============================================================================
# PAGES
# =============================================================================

$pages = @(
    [PSCustomObject]@{ id=$pCbt; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; label='Combat';        category='character'; backgroundColor='#080818'; backgroundOpacity=1; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$pIdn; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; label='Identity';      category='character'; backgroundColor='#080818'; backgroundOpacity=1; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$pMon; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; label='Monster Sheet'; category='monster';   backgroundColor='#060610'; backgroundOpacity=1; hideFromPlayerView=$false }
    [PSCustomObject]@{ id=$pCre; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; label='Creation';      category='character'; backgroundColor='#060614'; backgroundOpacity=1; hideFromPlayerView=$false }
)

# =============================================================================
# RULESET WINDOWS
# =============================================================================

$rulesetWindows = @(
    [PSCustomObject]@{ id='rw_cbt_core'; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Combat Core';     windowId=$wCbt; pageId=$pCbt; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='rw_cbt_res';  createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Class Resources'; windowId=$wRes; pageId=$pCbt; x=380; y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='rw_idn';      createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Identity';        windowId=$wIdn; pageId=$pIdn; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='rw_mon';      createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Monster Combat';  windowId=$wMon; pageId=$pMon; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='rw_cre_sts';  createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Stats';           windowId=$wSts; pageId=$pCre; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='rw_cre_bkg';  createdAt=$ts; updatedAt=$ts; rulesetId=$rid; title='Background';      windowId=$wBkg; pageId=$pCre; x=380; y=10; isCollapsed=$false; displayScale=1 }
)

# =============================================================================
# CHARACTER PAGES + WINDOWS
# =============================================================================

$charPages = @(
    [PSCustomObject]@{ id='cp_test_cbt'; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; characterId=$testId; pageId=$pCbt; label='Combat';        category='character'; backgroundColor='#080818'; backgroundOpacity=1; sheetFitToViewport=$false }
    [PSCustomObject]@{ id='cp_test_idn'; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; characterId=$testId; pageId=$pIdn; label='Identity';       category='character'; backgroundColor='#080818'; backgroundOpacity=1; sheetFitToViewport=$false }
    [PSCustomObject]@{ id='cp_test_mon'; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; characterId=$testId; pageId=$pMon; label='Monster Sheet';  category='monster';   backgroundColor='#060610'; backgroundOpacity=1; sheetFitToViewport=$false }
    [PSCustomObject]@{ id='cp_test_cre'; createdAt=$ts; updatedAt=$ts; rulesetId=$rid; characterId=$testId; pageId=$pCre; label='Creation';       category='character'; backgroundColor='#060614'; backgroundOpacity=1; sheetFitToViewport=$false }
)

$charWindows = @(
    [PSCustomObject]@{ id='cw_cbt_core'; createdAt=$ts; updatedAt=$ts; title='Combat Core';     characterId=$testId; characterPageId='cp_test_cbt'; windowId=$wCbt; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='cw_cbt_res';  createdAt=$ts; updatedAt=$ts; title='Class Resources'; characterId=$testId; characterPageId='cp_test_cbt'; windowId=$wRes; x=380; y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='cw_idn';      createdAt=$ts; updatedAt=$ts; title='Identity';        characterId=$testId; characterPageId='cp_test_idn'; windowId=$wIdn; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='cw_mon';      createdAt=$ts; updatedAt=$ts; title='Monster Combat';  characterId=$testId; characterPageId='cp_test_mon'; windowId=$wMon; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='cw_cre_sts';  createdAt=$ts; updatedAt=$ts; title='Stats';           characterId=$testId; characterPageId='cp_test_cre'; windowId=$wSts; x=10;  y=10; isCollapsed=$false; displayScale=1 }
    [PSCustomObject]@{ id='cw_cre_bkg';  createdAt=$ts; updatedAt=$ts; title='Background';      characterId=$testId; characterPageId='cp_test_cre'; windowId=$wBkg; x=380; y=10; isCollapsed=$false; displayScale=1 }
)

# =============================================================================
# WRITE FILES
# =============================================================================

[IO.File]::WriteAllText("$appdata\components.json",      ($allComps      | ConvertTo-Json -Depth 10), $enc)
[IO.File]::WriteAllText("$appdata\windows.json",         ($windows       | ConvertTo-Json -Depth 4),  $enc)
[IO.File]::WriteAllText("$appdata\pages.json",           ($pages         | ConvertTo-Json -Depth 4),  $enc)
[IO.File]::WriteAllText("$appdata\rulesetWindows.json",  ($rulesetWindows| ConvertTo-Json -Depth 4),  $enc)
[IO.File]::WriteAllText("$appdata\characterPages.json",  ($charPages     | ConvertTo-Json -Depth 4),  $enc)
[IO.File]::WriteAllText("$appdata\characterWindows.json",($charWindows   | ConvertTo-Json -Depth 4),  $enc)
Write-Host "All sheet files written."

# =============================================================================
# UPDATE METADATA
# =============================================================================

$meta = Get-Content "$appdata\metadata.json" -Raw | ConvertFrom-Json
$meta.counts.windows          = $windows.Count
$meta.counts.components       = $allComps.Count
$meta.counts.pages            = $pages.Count
$meta.counts.rulesetWindows   = $rulesetWindows.Count
$meta.counts.characterWindows = $charWindows.Count
$meta.counts.characterPages   = $charPages.Count
[IO.File]::WriteAllText("$appdata\metadata.json", ($meta | ConvertTo-Json -Depth 6), $enc)
Write-Host "Metadata updated: $($allComps.Count) components, $($pages.Count) pages, $($windows.Count) windows."

# =============================================================================
# REBUILD ZIP
# =============================================================================

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
