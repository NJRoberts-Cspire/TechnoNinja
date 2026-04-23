# Tesshari — Class Playstyle Audit

Question: does every one of the 25 classes actually feel *different to play*, beyond just stat pairs?

Answer: **yes**. Every class has a named core mechanic that defines its moment-to-moment loop, and keyword signatures confirm distinct play patterns across stat-pair overlaps.

Source: direct reads of all 25 class markdown files' `## CARD SYSTEM` sections plus keyword frequency analysis across each class's full card reference.

---

## 1. Per-class playstyle fingerprint

| # | Class | Stats | HP · Hand | Core mechanic | Keyword signature |
| --- | --- | --- | --- | --- | --- |
| 01 | **Ironclad Samurai** | IRON · RESONANCE | Martial · 6 | **Vein Oath** — ethical alignment; Resonance Fracture if broken (−3 to attacks until atonement) | Guard / Expose / Bleed / Shield |
| 02 | **Ronin** | IRON · EDGE | Martial · 6 | **Broken Resonance** — corrupted oath signature; immunity to control effects, false readings | Bleed / Expose (dirty-angle spec) |
| 03 | **Ashfoot** | EDGE · IRON | Balanced · 7 | **Anchor Point + Formation Instinct** — improvisation-driven positional defense | Guard / Expose / Bleed |
| 04 | **Veilblade** | EDGE · SIGNAL | Balanced · 7 | **Marked Target** — hunter-style focus, stealth + Wire-blind strikes | **Silence-heaviest** (28) |
| 05 | **Oni Hunter** | RESONANCE · IRON | Balanced · 6 | **Mark stacks + Shell Sight** — tracks and dissolves Shell-state entities | **Mark-heaviest** (31) |
| 06 | **Forge Tender** | SIGNAL · RESONANCE | Balanced · 7 | **Forge Mending + Echomind Reading** — enhancement healer/support | Regen / Shield / Cleanse (support) |
| 07 | **Wireweave** | SIGNAL · EDGE | Technical · 7 | **Wire Weave** — network infiltration, signal disruption | Stagger / Silence |
| 08 | **Chrome Shaper** | IRON · SIGNAL | Technical · 7 | **Phase Config** — mid-combat chassis reconfiguration | Guard / Overheat / Regen |
| 09 | **Pulse Caller** | SIGNAL · RESONANCE | Technical · 7 | **Resonant Pulse** — ranged precision + area disruption | Expose / **Pierce-heavy** |
| 10 | **Iron Monk** | IRON · RESONANCE | Heavy · 5 | **Between Points** — semi-etheric state; flesh/steel unity | **Guard-heaviest** (49) |
| 11 | **Echo Speaker** | RESONANCE · VEIL | Technical · 7 | **Echoes of the dead** — channels Iron Afterlife voices | **Echo-heaviest** (41) + Veil |
| 12 | **Void Walker** | RESONANCE · EDGE | Technical · 7 | **Phase Steps + Void Charges** — physically phases between planes | Veil / Guard |
| 13 | **Sutensai** | RESONANCE · VEIL | Technical · 7 | **Rites + Seals + Echomind Reading** — priestly authority, sutra enforcement | Expose / Stagger / Silence / Root |
| 14 | **Flesh Shaper** | IRON · SIGNAL | Technical · 7 | **Shaping Points** — biological manipulation; heals AND corrupts | **Bleed (46)** + Regen (unusual combo) |
| 15 | **Puppet Binder** | VEIL · SIGNAL | Social · 8 | **Vessels + Binding Thread** — remote-operated constructed bodies | Expose / Vulnerable / **Root** |
| 16 | **Blood Smith** | IRON · RESONANCE | Martial · 6 | **Forge Charges + Blood Weapons** — self-damage → weapon manifestation | **Bleed-heaviest (53)** + Pierce |
| 17 | **The Hollow** | FRAME · RESONANCE | Balanced · 6 | **Empty/Shell paths** — HP-missing scaling; extreme commitment | Expose / Guard / Stagger |
| 18 | **Shadow Daimyo** | VEIL · IRON | Social · 8 | **Command Pressure + Dossier** — info-setup then conditional strike | **Expose-heaviest (60)** |
| 19 | **Voice of Debt** | VEIL · SIGNAL | Social · 8 | **Debt stacks** — slow-burn accumulate-and-detonate | Expose / Stagger (slow drain) |
| 20 | **Merchant Knife** | SIGNAL · EDGE | (Social) · 8 | **SIGNAL status + Debt status** — dual-mark conditional combos | Expose / Vulnerable / Bleed |
| 21 | **Iron Herald** | IRON · VEIL | (Martial) · 6 | **Command Zone + Priority Target** — area + single-target force multiplier | Silence / **Taunt** (unique niche) |
| 22 | **Curse Eater** | FRAME · RESONANCE | (Balanced) · 7 | **Corruption Points + Corruption Pulse** — absorb enemy debuffs, channel back | Shield / **Regen** / Bleed |
| 23 | **Shell Dancer** | EDGE · FRAME | (Balanced) · 7 | **Shell Step + Cascade** — non-presence toggle + damage-taken resource | Evasion / reaction-heavy |
| 24 | **Fracture Knight** | IRON · RESONANCE | (Heavy) · 5 | **Fracture stacks + Phantom Charges** — strikes from Iron Afterlife angles | **Veil** / Expose / Vulnerable |
| 25 | **The Unnamed** | Variable | Unique · 5 | **Fluid Stat + Conditions + Naming** — Active Stat swaps per combat; player-defined conditions | Variable (by card design) |

---

## 2. Stat-pair clusters — how overlapping pairs stay distinct

Nine classes share their stat pair with at least one other. Each pair is still mechanically differentiated by resource and keyword signature:

### IRON + RESONANCE (Ironclad Samurai, Iron Monk, Blood Smith, Fracture Knight)
Four heavy-flavored melee classes, all mechanically divergent:
- **Ironclad Samurai** — Vein Oath alignment resource; balanced Guard + Expose + Bleed keyword mix; martial with philosophical discipline
- **Iron Monk** — Between Points etheric state; hand 5 / Heavy tier; pure Guard tank (**49 Guard** references — the heaviest in the game)
- **Blood Smith** — Forge Charges from self-damage; **Bleed-heaviest class (53)**; volatile self-harm spec
- **Fracture Knight** — Fracture + Phantom Charges from Iron Afterlife angles; **Veil-heavy** (13) — unusual for a martial — indicating phase-trick attacks

### RESONANCE + VEIL (Echo Speaker, Sutensai)
- **Echo Speaker** — channels voices of the dead; **Echo-heaviest (41)**; passive Afterlife contact
- **Sutensai** — church authority; Rites + Seals; Root + Silence spec; inquisitorial

### VEIL + SIGNAL (Puppet Binder, Voice of Debt)
- **Puppet Binder** — Vessels (remote bodies); Root + Vulnerable; *concrete*-mechanical puppetry
- **Voice of Debt** — Debt stacks detonate; slow-burn accumulator; Expose / Stagger drain pattern

### SIGNAL + EDGE (Wireweave, Merchant Knife)
- **Wireweave** — digital infiltration; Stagger + Silence combo; breaks enhancement-dependent enemies
- **Merchant Knife** — SIGNAL + Debt dual-mark system; Expose / Vulnerable conditional scaling; info-asymmetry combat

### IRON + SIGNAL (Chrome Shaper, Flesh Shaper)
- **Chrome Shaper** — Phase Config chassis reconfig; Guard / Overheat / Regen defense-spec
- **Flesh Shaper** — Shaping Points biology manipulation; **Bleed 46 + Regen 16** (unique in combining DoT with healing)

### FRAME + RESONANCE (The Hollow, Curse Eater)
- **The Hollow** — Empty/Shell path commitment; HP-missing damage scaling; extreme-focus scaling
- **Curse Eater** — Corruption absorption; Shield + Regen + Bleed; tanky channeler

### IRON + EDGE (Ronin, Ashfoot) — the tightest pair
Both are "resilient working martial" but play differently:
- **Ronin** — reactive, immunity-focused (Broken Resonance passively bypasses control effects); signature Bleed via dirty-angle attacks; Counter Kata
- **Ashfoot** — positional-defense focused (Anchor Point + Formation Instinct); **+1 hand size** over Ronin; salvage-weapon improvisation

The differentiation is real: Ronin wants targets to try to lock them down (immune), Ashfoot wants to hold ground and wear enemies down.

### IRON + VEIL (Shadow Daimyo, Iron Herald)
- **Shadow Daimyo** — info-broker; **Expose-heaviest (60)**; Dossier Strike conditional damage on pre-applied utility
- **Iron Herald** — battlefield commander; Command Zone + Priority Target buff/debuff; only class with meaningful Taunt usage

---

## 3. Keyword specialization map

Each keyword has a clear "lead class" that spams it:

| Keyword | Lead class(es) | Count | Runner-up |
| --- | --- | --- | --- |
| **Guard** | Iron Monk | 49 | Blood Smith (25), Shadow Daimyo (24), Ashfoot (26) |
| **Bleed** | Blood Smith | 53 | Flesh Shaper (46), Ronin (23) |
| **Expose** | Shadow Daimyo | 60 | Puppet Binder (47), Voice of Debt (45) |
| **Silence** | Veilblade | 28 | Wireweave (17), Sutensai (17) |
| **Mark** | Oni Hunter | 31 | — |
| **Echo** | Echo Speaker | 41 | — |
| **Regen** | Forge Tender | 16 | Flesh Shaper (16), Curse Eater (10) |
| **Pierce** | Pulse Caller | 15 | Blood Smith (12) |
| **Veil** | Echo Speaker | 41 | Void Walker (19), Fracture Knight (13) |
| **Taunt** | Iron Herald | 7 | (only class with meaningful Taunt usage) |
| **Root** | Sutensai | 13 | Puppet Binder (15) |
| **Vulnerable** | Puppet Binder | 20 | Voice of Debt (18) |
| **Overheat** | Chrome Shaper | 19 | Forge Tender (12) |
| **Stagger** | Echo Speaker | 35 | Voice of Debt (30), Shadow Daimyo (26) |
| **Shield** | Curse Eater | 15 | Ashfoot (16), Forge Tender (15) |
| **Cleanse** | Forge Tender | 12 | — |

Many classes have a unique or near-unique niche (Taunt → Iron Herald; Mark → Oni Hunter; Echo → Echo Speaker; Cleanse → Forge Tender; Pierce → Pulse Caller; highest Bleed → Blood Smith).

---

## 4. Overall verdict

**All 25 classes are mechanically differentiated.** Three axes combined produce distinct identities:

1. **Stat pair** — 14 unique pairings; where pairs overlap, the other axes differentiate
2. **Named resource** — every class has one or more (Oath / Between Points / Forge Charges / Phase Steps / Fracture / Corruption Points / Debt stacks / Shell Step / Cascade / Shaping Points / Vessels / Command Zone / SIGNAL & Debt status / Fluid Stat / Empty-vs-Shell / Mark stacks / Echo stacks / etc.)
3. **Keyword signature** — consistent spam patterns diverge (Blood Smith's 53 Bleed vs Iron Monk's 49 Guard vs Shadow Daimyo's 60 Expose vs Echo Speaker's 41 Echo, etc.)

**No rework needed.** The class roster has genuine mechanical variety.

---

## 5. Secondary observations (for future polish, not bugs)

- **The Unnamed** is the most mechanically radical (player-defined conditions) and may need extra DM guidance for balanced Condition definitions. Current markdown does provide this.
- **Shell Dancer's** Cascade resource encourages "wants to be hit" playstyle — combos well with The Hollow's "below half HP" scaling if paired in a party.
- **Forge Tender** is the only dedicated support class. Multi-class parties may want to designate one member to cover this role.
- **Iron Herald** and **Shadow Daimyo** are the two VEIL-primary melee classes and fill different battlefield leadership niches (open-field commander vs. shadow-manipulator).
- **Three classes have Iron Afterlife mechanics** (Echo Speaker, Void Walker, Fracture Knight) but each relates to the Afterlife differently: Echo = voices only, Void = physical phasing, Fracture = dead-adjusted strikes.

---

## 6. Data provenance

Generated via:
- `tesshari-foundry/tools/class-audit.mjs` — scans markdown for stats, hand, starting cards, resource mentions, keyword frequency
- `tesshari-foundry/tools/class-identity-extract.mjs` — pulls each class's `## CARD SYSTEM` intro block

Original sources: `classes/01_ironclad_samurai.md` through `classes/25_the_unnamed.md`.
