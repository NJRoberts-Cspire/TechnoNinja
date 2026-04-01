# TESSHARI BALANCE AUDIT
## Version 1.0 — Conducted April 2026

This document records every balance issue identified across the reviewed class files, monster files, and referenced rules. Each entry lists the specific card or stat, the file and line where it appears, the problem, the fix applied or recommended, and whether the fix was applied directly.

---

## AUDIT SCOPE

Files reviewed:
- `system/00_core_rules.md`
- `classes/24_fracture_knight.md`
- `classes/10_iron_monk.md`
- `classes/16_blood_smith.md`
- `classes/17_the_hollow.md`
- `classes/19_voice_of_debt.md`
- `classes/01_ironclad_samurai.md` (unlock list and overview only)
- `classes/11_echo_speaker.md`
- `monsters/11_ironhold_war_constructs.md`
- `monsters/01_shell_entities.md`
- `items/13_resonant_items.md`

---

## ISSUE 1 — Fracture Knight Capstone Damage Ceiling (CRITICAL)

**Card:** Between: The Final Blow
**File:** `classes/24_fracture_knight.md`, Level 20 Capstone
**Original text:** Deal (28 + IRON) + (6 × Phantom Charges spent) + (4 × 5 self-Fracture stacks) damage

**Problem:**
At maximum Phantom Charges (6) and maximum self-Fracture (5), this card resolves at:
- 28 + IRON + 36 + 20 = 84 + IRON (confirmed in design note in the file)
- With IRON 8 (achievable through enhancements): **92 damage**
- This ignores all Guard, Shield, and damage reduction (Pierce all mitigation)
- Standard boss HP at Level 15-20: (FRAME 8 × 8) + 40 = 104 HP
- A single card dealing 92 damage to an unmitigated boss represents an 88% one-shot

**Threshold:** No single card should exceed 50 + primary stat damage at Tier 3 (maximum ~65 at high stat). This card at optimal setup exceeds the threshold by 27+ points before stat is added.

**The setup requirement does not justify the ceiling.** Between: The Final Blow requires spending all Phantom Charges (minimum 2, max 6) and self-applying Fracture 5, both of which can be accomplished in the same turn via Fracture: Maximum (Level 10, 2 AP, applies Fracture 5 to self + 2 Phantom Charges) and other Phantom Charge sources. At Level 20, a Fracture Knight can reasonably enter any combat with 6 Phantom Charges (starting 2 + build-up over prior turns) and spend 1 AP on Fracture: Maximum, then 3 AP on The Final Blow for a near-one-shot nova turn.

**Fix Applied:**
Reduce base damage from 28 to 18. Reduce self-Fracture multiplier from 4 per stack to 3 per stack (5 stacks = 15 bonus instead of 20). Keep 6 × Phantom Charges.

New maximum: 18 + IRON + 36 + 15 = 69 + IRON. At IRON 8 = **77 damage**.
This is still the highest single-card damage in the game and still requires maximum setup. It no longer one-shots a boss at Level 15-20 (104 HP) and requires the boss to be at ~74% HP to finish them with a single card. The Fracture Knight's identity as the "highest ceiling" class is preserved.

The design note at the bottom of the file is updated to reflect the new formula.

**STATUS: FIXED DIRECTLY**

---

## ISSUE 2 — Iron Monk Between Anchor Guard Value (MODERATE)

**Card:** Between Anchor
**File:** `classes/10_iron_monk.md`, Level 11
**Original text:** Gain Guard 10 and Fortify. You cannot be moved by forced movement this round. Below half HP: Also gain Regen 3 for 1 round.

**Problem:**
Between Anchor is a Tier 2 (2 AP) card. The threshold for Tier 2 Guard cards is Guard 5–7 max. Guard 10 from a single Tier 2 card effectively negates a full standard enemy turn at Tier 1 (which deals ~10-14 damage total). Combined with Fortify (which reduces Control effects), this card provides too much mitigation for its AP cost.

The Iron Monk has multiple Tier 2 cards already at Guard 8 (Iron Body, Resonant Barrier), which are already at the upper edge of acceptable. Between Anchor at Guard 10 is 2–3 points over the Tier 2 ceiling.

**Fix Applied:**
Reduce Guard 10 to Guard 7 on Between Anchor. The below-half-HP Regen 3 bonus is unchanged. The Fortify and anti-forced-movement effects are unchanged. Guard 7 at Tier 2 is now at the high end of the Tier 2 threshold rather than above it.

**STATUS: FIXED DIRECTLY**

---

## ISSUE 3 — Iron Monk Iron Body Guard Value (MODERATE)

**Card:** Iron Body
**File:** `classes/10_iron_monk.md`, Level 8
**Original text:** Gain Guard 10 and immunity to Stagger for 1 round. Below half HP: Also gain Regen 3 and immunity to Silence for 1 round.

**Problem:**
Iron Body is a Tier 2 (2 AP) card. Guard 10 at Tier 2 is over the stated threshold (Guard 5–7 for Tier 2). The additional Stagger immunity makes this card's total value even higher — at Tier 2, a card providing Guard 10 + Stagger immunity is comparable in power to some Tier 3 defense cards.

The Iron Monk has multiple Guard 8 Tier 2 cards (Resonant Barrier, Between Speaks allies, Perfect Balance); Iron Body at Guard 10 is an outlier.

**Fix Applied:**
Reduce Guard 10 to Guard 7 on Iron Body. Stagger immunity and below-half-HP bonuses are unchanged.

**STATUS: FIXED DIRECTLY**

---

## ISSUE 4 — Blood Smith HP-Cost Sustainability (MINOR — NO FIX REQUIRED)

**Class:** Blood Smith
**File:** `classes/16_blood_smith.md`

**Assessment:**
At Level 10, FRAME 5: HP = (5 × 8) + 14 = 54 HP.

A high-output turn combining e.g. Blood Forge (3 AP, 10 HP cost) + one T1 HP card (4 HP cost) = 14 HP expenditure per turn. Over 3 full nova turns: 42 HP lost — leaving a Blood Smith at 12 HP before enemy damage, below the safe threshold.

However, the following recovery tools exist and are accessible without using offensive AP:
- **Scar Tissue** (Tier 1 passive, L6): +3 HP per turn if paid HP last turn — passive, no action cost
- **Pain is Data** (Tier 1 passive, L8): +6 HP + Guard 4+IRON on first drop below half HP — passive, no action cost
- **Iron Body** (Tier 2 passive, L14): +3 HP per turn if paid HP last turn — stacks with Scar Tissue
- **Sustained Liquefaction** (Tier 2 passive, L17): +4 HP per turn + −3 to all HP costs — this alone makes high-output turns sustainable at high level
- **Pain Dividend** (Tier 1, 0 AP, L5): 0 AP cost, pay 8 HP, return 8+RESONANCE next turn — marginal positive if RESONANCE ≥ 1, which is guaranteed

**Finding:** The class has the tools to sustain 5+ rounds of output, but they require holding 1-2 passive slots specifically for recovery, which competes with damage passives. This is correct design — the Blood Smith must invest in recovery infrastructure or accept a short combat window. The tension is intentional and the tools exist. No fix required.

The capstone "The Bleeding Edge" (Level 20) at 20 HP + 10 HP deferred cost with 16 HP refund represents a net -14 HP over 2 turns, which is meaningful but not degenerate at high-level HP (L20 Blood Smith with FRAME 5 and 19 levels of HP gain: 54 + 19×5 = 149 HP). No fix required.

**STATUS: NO FIX — DESIGN INTENT CONFIRMED**

---

## ISSUE 5 — Monster HP Formula Violations (CRITICAL — multiple)

**File:** `monsters/11_ironhold_war_constructs.md` and `monsters/01_shell_entities.md`

**Formula:** (FRAME × 8) + tier bonus [Minion +4, Standard +12, Elite +24, Boss +40]

Checked all monsters against formula:

| Monster | FRAME | Tier | Formula HP | Listed HP | Status |
|---|---|---|---|---|---|
| Sentry Platform | 3 | Minion | 28 | 20 | **WRONG (−8)** |
| Harrower | 5 | Standard | 52 | 52 | Correct |
| Reclamation Engine | 8 | Standard | 76 | 76 | Correct |
| Warden-Type | 8 | Elite | 88 | 88 | Correct |
| Siege-Walker | 10 | Boss | 120 | 160 | **See note** |
| Override Prime | 7 | Boss | 96 | 120 | **WRONG (+24)** |
| Null-Frame | 10 | Boss | 120 | 200 | **See note** |
| Newly Shelled | 3 | Standard | 36 | 36 | Correct |
| Soldier-Shell | 6 | Elite | 72 | 72 | Correct |
| Hunger-Shell | 7 | Elite | 80 | 80 | Correct |
| Cathedral | 10 | Boss | 120 | 152 | **See note** |
| Cascade | 8 | Boss | 104 | 120 | **WRONG (+16)** |

**Notes on deliberate-seeming deviations:**

- **Siege-Walker (160 HP):** Formula gives 120. The file explicitly frames the Siege-Walker as a near-campaign encounter requiring creative approaches (climbing it, accessing the control interface) rather than direct combat. The 40 HP excess may be intentional to ensure it survives long enough for the skill-challenge approach to matter. However, the audit threshold is formula accuracy, and this is a 33% deviation. **Fixed to 120 HP** — the encounter notes (climbing, control interface) provide encounter difficulty beyond raw HP.

- **Null-Frame (200 HP):** Formula gives 120. The file explicitly designates this as a "Campaign-Scale Threat, not a dungeon encounter" with notes stating "combat with it as an open engagement ends in party death." This is intentionally not meant to be defeated by direct combat, making HP a narrative element rather than a balance element. **Flagged but not fixed** — the encounter design context justifies the deviation. A note is added to the stat block explaining the deliberate override.

- **Cathedral (152 HP):** Formula gives 120, but the listed HP notation explicitly states "FRAME 10 × 8 + 40 + 32 regeneration pool" — the 32 HP excess is labeled as a regeneration pool, not base HP. The stat block separately lists a Passive giving 15 HP regen per turn. This is a design choice where the displayed HP includes a separate pool, not a formula violation. **Flagged, not fixed** — the notation should be clarified for consistency, but the intent is documented.

**Fixes Applied:**

- **Sentry Platform:** HP corrected from 20 to 28. (FRAME 3 × 8 + 4 Minion bonus)
- **Override Prime:** HP corrected from 120 to 96. (FRAME 7 × 8 + 40 Boss bonus). Note: at 96 HP, the Override Prime is still a challenging Boss encounter due to Adaptive Protocol and Counter-Protocol mechanics — raw HP is not its primary threat.
- **Siege-Walker:** HP corrected from 160 to 120. (FRAME 10 × 8 + 40 Boss bonus). Encounter notes remain unchanged.
- **Cascade:** HP corrected from 120 to 104. (FRAME 8 × 8 + 40 Boss bonus).

**STATUS: 4 MONSTERS FIXED DIRECTLY. 2 FLAGGED, NOT FIXED (Null-Frame, Cathedral — intentional design deviations noted).**

---

## ISSUE 6 — Monster Damage vs Player HP (MINOR — one flag)

**File:** `monsters/11_ironhold_war_constructs.md`

**Threshold:** Standard monster turn (2 AP): ~20–35 damage total. Elite turn (3 AP): ~35–55 damage total. Boss turn (4 AP): ~50–75 total.

Checked damage output per AP budget:

| Monster | Tier | AP | Typical Turn Damage | Threshold | Status |
|---|---|---|---|---|---|
| Sentry Platform | Minion | 1 | 8 (basic only) | ~10–14 | Slightly low |
| Harrower | Standard | 2 | Basic (10) + Breach Arm (12) = 22 | 20–35 | OK |
| Reclamation Engine | Standard | 2 | Basic (18) + Haul (control) = 18 + control | 20–35 | Marginally low |
| Warden-Type | Elite | 3 | Basic (15) + Lockdown Pulse (12) = 27 damage | 35–55 | **Low** |
| Siege-Walker | Boss | 4 | Basic (23) + Main Cannon (26) = 49 | 50–75 | OK |
| Override Prime | Boss | 4 | Basic (16) × 3 via Tactical Barrage (2 AP) = 48 | 50–75 | Marginally low |

**Warden-Type flag:** The Warden-Type's primary function is control and detention, not damage dealing. Its 3 AP can deliver Basic (15) + Lockdown Pulse (12, area) + Transfer to Detention (control, no damage) = 27 raw damage plus Roots, control lockdown, and detention mechanics. Its total threat comes from control effects compounding, not damage. Adjusting its raw damage would misrepresent its role as a puzzle/control Elite. **No fix applied** — the damage output is intentionally low for a control-focused Elite; the encounter notes correctly identify it as not a pure combat threat.

**Sentry Platform** basic attack (8 damage) is slightly below the Minion threshold of 10-14. However, Minions with 1 AP have no room for a card AND a basic attack in one turn. The basic attack alone at 8 is consistent with a stationary zone-denial hazard. **No fix applied.**

**STATUS: NO FIXES APPLIED — all deviations are design-consistent.**

---

## ISSUE 7 — Status Effect Stacking: Voice of Debt Debt Cap (CRITICAL)

**Class:** Voice of Debt
**File:** `classes/19_voice_of_debt.md`

**Problem:**
The Voice of Debt class has no stated maximum Debt stack cap. Two high-level passives compound this:

- **The Living Ledger** (Level 11, Tier 2 passive): At the start of each turn, apply Debt 1 to all enemies within 30 feet who already carry at least 1 Debt stack. No cap stated.
- **The Living Record** (Level 18, Tier 2 passive): Whenever you apply Debt stacks, apply 1 additional Debt stack beyond the listed amount.

With both passives active and several Debt-application cards played, a target can reach 10-15+ Debt stacks over 4-5 rounds.

**Detonation damage at high stacks:**

- **Apex Detonation** (Level 16): 14 + VEIL + 7 per Debt stack. At 12 stacks, VEIL 7: 14 + 7 + 84 = **105 damage** — nearly one-shotting a full HP boss from a Tier 3 card.
- **The Debt of All Things** (Capstone): 14 + VEIL + 6 per stack against all enemies within 60 feet. At 12 stacks, VEIL 7: 14 + 7 + 72 = 93 damage to every enemy in range simultaneously — an AoE wipe at optimized stack counts.
- **Iron Verdict** (Level 14): 14 + VEIL + 6 per stack. Same degenerate scaling.

**Normal stack count analysis (no passives):** Without the two passives, a Voice of Debt applying Debt aggressively over 3 turns can stack roughly Debt 8-9 on a primary target (Debt 2-3 per turn via cards). At 8 stacks and VEIL 6: Apex Detonation = 14+6+56 = 76 damage — within the nova threshold (60-85). This is acceptable.

**With both passives and 4+ turns of setup:** Stacks compound to 12+ making detonations dramatically above nova ceiling.

**Fix Applied:**
Add a stated maximum Debt stack cap of **8** to the class mechanics section. This is achievable through normal play (several single-turn application cards plus The Living Record), high enough to feel powerful at detonation (Apex Detonation at 8 stacks, VEIL 6 = 76 damage), and prevents the degenerate 12-15 stack scenarios.

The Living Ledger and The Living Record remain as written — they accelerate reaching the cap and keep stacks at cap, they do not push beyond it. This preserves the "debt compounds automatically" flavor without enabling infinite scaling.

**Damage check at cap:** Apex Detonation at 8 stacks, VEIL 8 (near maximum): 14 + 8 + 56 = **78 damage**. Below nova ceiling of 85. Acceptable.

**STATUS: FIXED DIRECTLY** — cap language added to class mechanics section.

---

## ISSUE 8 — Status Effect Stacking: Bleed and Expose at Tier 1 (MINOR — no fix required)

**Classes:** Blood Smith, The Hollow
**Files:** `classes/16_blood_smith.md`, `classes/17_the_hollow.md`

**Assessment:**

Blood Smith Tier 1 single-card maximum Bleed application:
- Blood Weapon: Bleed 2
- Blood Spike: Bleed 2 (Bleed 3 if below half HP)

Two Tier 1 Blood Smith attack cards in one turn = maximum Bleed 4 at Tier 1 + 1 AP investment from a second card. The threshold was "Bleed 5+ in one turn with 3 AP." Two Tier 1 cards at 1 AP each = 2 AP for Bleed 4 — below the trigger threshold. At Tier 2, Combat Forge (Bleed 3) brings it to Bleed 7 over 3 AP — but this requires 3 separate cards and different AP expenditures.

No single card applies Bleed 5+ at Tier 1 in the Blood Smith's kit. The Apex Blade (Level 15, Tier 3) applies Bleed 5 — but this is Tier 3 behavior, which is expected.

Expose stacking through The Hollow's "Resonant Field" (Tier 1 passive): Expose 1 per turn to all enhanced enemies. Passives stack with cards, so a turn could produce Expose 1 (Resonant Field) + Expose 2 (The Edge of Presence starting card) = Expose 3 in one turn. Three stacks from passives and starting cards is within acceptable range.

**STATUS: NO FIX — within acceptable thresholds.**

---

## ISSUE 9 — Echo Speaker Capstone Safety Clause (MODERATE)

**Card:** Voice of Both Worlds
**File:** `classes/11_echo_speaker.md`, Level 20 Capstone
**Original text:** "When this card resolves, you are reduced to 1 HP — the bridge, used fully, costs everything."

**Problem:**
The card reduces the caster to 1 HP at resolution. There is no "not below 1 HP" clause and no protection against dying during the round before or after this reduction. Two scenarios create a death risk:

1. **Enemy action during the same round:** The card's effect lasts "for 1 round" — allies are protected and enemies are harmed, but there is nothing preventing an enemy from dealing damage to the Echo Speaker after the card resolves (in the same round, if enemies act after the Speaker). At 1 HP, any attack ends the Speaker.

2. **Already-reduced HP:** If the Speaker is at 15 HP when they play this card, they are set to 1 HP at resolution. This is expected. But if they take 20 damage later in the round, they die. The card creates a suicide window.

The Fracture Knight "Death's Proximity" (Tier 2, Level 6) explicitly states: "until start of your next turn, you cannot be reduced below 1 HP by any single damage instance." The Iron Monk capstone "The Between Made Flesh" also includes: "you cannot be reduced below 1 HP." The Echo Speaker capstone, as the highest-tier card in the class, should have equivalent protection.

**Fix Applied:**
Add "you cannot be reduced below 1 HP until the start of your next turn" to the Voice of Both Worlds text. The reduction to 1 HP at resolution is preserved — the cost of the capstone is real. But the Speaker is protected from dying to their own capstone during the round they use it.

The updated text reads: "When this card resolves, you are reduced to 1 HP — the bridge, used fully, costs everything. You cannot be reduced below 1 HP until the start of your next turn."

**STATUS: FIXED DIRECTLY**

---

## ISSUE 10 — Void Deepens (Apex) Uncapped Scaling (MODERATE)

**Card:** Void Deepens (Apex)
**File:** `classes/17_the_hollow.md`, Level 17
**Original text:** "Deal 22 + RESONANCE resonant damage. Apply Expose 5, Vulnerable 4, Stagger. For each 20 HP you are missing, deal an additional RESONANCE bonus damage. **No ceiling on this scaling.**"

**Problem:**
The card explicitly states "no ceiling on this scaling." At a Hollow with max HP of ~120 at Level 17 (FRAME 6, Balanced tier: 6×8+10 = 58 + 16 levels × 6 FRAME = 58+96 = 154 actual maximum), if the Hollow is at, say, 10 HP (missing 144 HP), the scaling adds RESONANCE × 7 = potentially 56 additional damage with RESONANCE 8. Total: 22 + 8 + 56 = 86 damage. This is at the very high end of acceptable (nova ceiling is 60-85 for a Tier 3 card).

However, the Hollow's damage scaling is tied to being near death — reaching 144 HP missing at Level 17 means they are one hit from dying at any point. The risk-reward is inherently self-limiting: to deal maximum damage, they must be nearly dead. The design intent (inverse HP scaling) is core to the class identity.

Additionally, the preconditions (being alive at ~10 HP) are mechanically dangerous and not a reliable nova turn. A Hollow that has dropped to 10 HP is likely losing the encounter.

**Finding:** The "no ceiling" language is extreme but the scaling is functionally self-limiting by the reality of being at 10 HP. The damage at realistic "low HP but not dying" ranges (missing 60-80 HP) is: RESONANCE × 3-4 = 24-32 extra at RESONANCE 8 — bringing total to 22+8+32 = 62, within threshold.

The "no ceiling" phrasing is flagged as a documentation risk — a future designer or player might combine this with HP restoration effects to game the calculation — but in standard play it is self-limiting.

**Fix Applied (conservative):** Add "maximum +RESONANCE × 5 additional damage from this scaling" to clarify the practical ceiling matches the most dangerous realistic scenario (missing 100 HP × RESONANCE). This prevents any creative edge cases while preserving the full range of normal play.

**STATUS: FIXED DIRECTLY**

---

## ISSUE 11 — The Hollow's Edge Uncapped Scaling (MODERATE)

**Card:** The Hollow's Edge
**File:** `classes/17_the_hollow.md`, Level 19
**Original text:** "Deal 24 + RESONANCE resonant damage. Apply Expose 6, Vulnerable 5, and Stagger. This card's total damage increases by RESONANCE + FRAME for every 20 HP you are missing."

**Problem:**
Same uncapped scaling issue as Void Deepens (Apex), but at Level 19 and with FRAME added to the per-20-HP bonus. At Level 19, a Hollow with RESONANCE 8 and FRAME 6 gains +14 damage per 20 HP missing. Missing 120 HP (realistic at this level) = +84 additional damage. Total: 24 + 8 + 84 = **116 damage** — far exceeding any threshold.

Unlike Void Deepens (Apex), this scaling is not self-limiting at the same degree. A Hollow at Level 19 with HP restoration items (Regen passives from Hollow Fortress = Regen 5) could maintain a "low HP but not dead" state more reliably. Total Liquefaction (another Level 19 card) cannot be combined in the same turn (both cost 3 AP), but the risk of engineering a dangerous HP state is real.

**Fix Applied:** Add "maximum +RESONANCE + FRAME × 4 additional damage from this scaling" — equivalent to being missing 80 HP (a reasonable "seriously hurt but functional" state). At RESONANCE 8 and FRAME 6: +56 maximum bonus. Total max: 24 + 8 + 56 = **88 damage** — at the nova ceiling but not over it. The class identity as "more dangerous when hurt" is preserved without enabling three-digit single-card damage.

**STATUS: FIXED DIRECTLY**

---

## ISSUE 12 — Voice of Debt Debt Stack Documentation in Capstone

**Card:** The Debt of All Things (Capstone)
**File:** `classes/19_voice_of_debt.md`, Level 20
**Original text:** "Apply Debt 5 to all enemies within 60 feet who do not already carry Debt stacks. Then: Debt Detonation against all enemies within 60 feet. Each enemy takes 14 + VEIL social damage plus 6 damage per Debt stack they carry."

**Problem:**
The capstone applies Debt 5 to enemies without stacks, then immediately detonates. Enemies who already carry Debt (at the new cap of 8 from Issue 7 fix) detonate at their full stack count. The math at cap:
- Enemies at Debt 8 cap + VEIL 8: 14 + 8 + 48 = **70 damage to every enemy within 60 feet**
- Plus Expose 6, Vulnerable 5, Stagger to each

This is strong AoE nova damage, but it requires 20 levels of setup, it's the capstone, and the 60-foot range requires enemies to cluster. The per-enemy damage (70) is within the acceptable range for a full-party boss encounter capstone when distributed across multiple targets. **No additional fix needed beyond the stack cap from Issue 7.**

**STATUS: NO ADDITIONAL FIX — Issue 7 cap resolves this.**

---

## SUMMARY TABLE

| # | Issue | File | Fix | Status |
|---|---|---|---|---|
| 1 | Fracture Knight capstone 84+IRON single-card nova | `classes/24_fracture_knight.md` | Reduce base from 28→18, self-Fracture multiplier 4→3 | **FIXED** |
| 2 | Iron Monk Between Anchor Guard 10 at Tier 2 | `classes/10_iron_monk.md` | Reduce Guard 10→7 | **FIXED** |
| 3 | Iron Monk Iron Body Guard 10 at Tier 2 | `classes/10_iron_monk.md` | Reduce Guard 10→7 | **FIXED** |
| 4 | Blood Smith HP-cost sustainability | `classes/16_blood_smith.md` | No fix — design intent confirmed | No fix |
| 5a | Sentry Platform HP 20 (formula gives 28) | `monsters/11_ironhold_war_constructs.md` | Correct HP 20→28 | **FIXED** |
| 5b | Override Prime HP 120 (formula gives 96) | `monsters/11_ironhold_war_constructs.md` | Correct HP 120→96 | **FIXED** |
| 5c | Siege-Walker HP 160 (formula gives 120) | `monsters/11_ironhold_war_constructs.md` | Correct HP 160→120 | **FIXED** |
| 5d | Cascade HP 120 (formula gives 104) | `monsters/01_shell_entities.md` | Correct HP 120→104 | **FIXED** |
| 5e | Null-Frame HP 200 (formula gives 120) | `monsters/11_ironhold_war_constructs.md` | Flagged — campaign-scale exception | No fix |
| 5f | Cathedral HP 152 (formula gives 120) | `monsters/01_shell_entities.md` | Flagged — notation explains +32 regen pool | No fix |
| 6 | Monster damage — Warden-Type low damage | `monsters/11_ironhold_war_constructs.md` | No fix — control role design intent | No fix |
| 7 | Voice of Debt no Debt stack cap | `classes/19_voice_of_debt.md` | Add cap of 8 Debt stacks max | **FIXED** |
| 8 | Bleed/Expose stacking at Tier 1 | multiple | No fix — within thresholds | No fix |
| 9 | Echo Speaker capstone no safety clause | `classes/11_echo_speaker.md` | Add "cannot be reduced below 1 HP until start of next turn" | **FIXED** |
| 10 | Void Deepens (Apex) uncapped scaling | `classes/17_the_hollow.md` | Add cap: maximum +RESONANCE × 5 from scaling | **FIXED** |
| 11 | The Hollow's Edge uncapped scaling | `classes/17_the_hollow.md` | Add cap: maximum +(RESONANCE + FRAME) × 4 from scaling | **FIXED** |
| 12 | Voice of Debt capstone with stack cap | `classes/19_voice_of_debt.md` | Resolved by Issue 7 fix | No additional fix |

**Total issues found: 12**
**Fixes applied directly: 9**
**Design intent confirmed (no fix): 3**
**Flagged for GM awareness (no fix): 2**

---

## NOTES FOR GM / DESIGNER

**On the Iron Monk:** The class has several Tier 2 cards at Guard 8 (Resonant Barrier, Iron Body post-fix, Perfect Balance). Guard 8 is at the high end of acceptable for Tier 2 but is appropriate for a class with the smallest hand size and Heavy HP tier. The between-Anchor at Guard 7 post-fix keeps the Iron Monk as the premier defensive martial class without making individual cards feel invulnerable.

**On the Fracture Knight:** Between: The Final Blow post-fix still deals 69+IRON at maximum setup, which at IRON 8 = 77 damage. This is the highest single-card damage in the game. It requires: (a) maximum Phantom Charges (6), (b) self-Fracture 5, (c) all AP, (d) ignoring Fracture stacks on the target (which could have contributed additional damage via other cards). The card is powerful and deserves its capstone status. The fix prevents it from being a structural problem against boss HP pools.

**On the Voice of Debt Debt cap:** The cap of 8 means The Living Ledger and The Living Record become "maintain at cap" mechanics rather than "compound to infinity" mechanics. This is more interesting design — these passives have value in keeping enemies at cap even if the VoD can't apply new cards, rather than being pure amplifiers.

**On the Hollow uncapped scaling:** Both flagged cards explicitly invoked "no ceiling" language that is unusual for this system. The conservative caps added (RESONANCE × 5 for Void Deepens Apex, (RESONANCE + FRAME) × 4 for The Hollow's Edge) still allow the Hollow to reach nova ceiling numbers when seriously injured, which is the class fantasy. The caps only prevent scenarios where creative HP manipulation pushes outputs into triple digits.
