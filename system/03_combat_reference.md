# TESSHARI COMBAT REFERENCE
## DM-Facing Cheat Sheet — Everything Needed to Run an Encounter

---

> Print this. Fold it. Keep it at your left hand. When you need to know how something works mid-combat, look here first. Full rules are in `00_core_rules.md` and `02_keywords_and_status.md`.

---

## INITIATIVE

**Set at the start of every encounter. Does not change mid-encounter unless a card specifically changes it.**

1. Determine all combatants' EDGE values.
2. Order from highest EDGE to lowest. Highest EDGE acts first.
3. **Tiebreak:** IRON value. Higher IRON acts first in a tie.
4. **True ties (same EDGE and IRON):** Act simultaneously. Resolve both sets of actions at the same time. Apply all damage and effects together before checking for death or status triggers.

Monster EDGE is listed in their stat block. NPC EDGE defaults to their EDGE stat if they have one, or 2 if improvised.

---

## FULL TURN SEQUENCE

Every combatant follows this sequence on their turn:

| Step | What Happens |
|---|---|
| **1. Turn Start** | AP resets to AP Max. Regen triggers (target recovers X HP). Per-turn limits clear (Basic Attack slot, once-per-turn passives). Overheat 3+ reduces AP Max by 1 before reset. |
| **2. Declare (optional)** | Player or DM states what the combatant intends to do this turn. This is advisory, not binding. |
| **3. Basic Attack (optional)** | Free action, 0 AP. Once per turn. Always available. Cannot be locked out by Stagger or Silence (Basic Attacks have no card type). |
| **4. Card Phase** | Play cards from hand in any order, spending AP. Each card may only be played once per turn. Cards with keywords resolve in the order played. |
| **5. End of Turn** | Bleed ticks (X damage to HP, bypasses Guard). Then Burn ticks (X damage, strips Guard first). Status durations reduce by 1. Statuses at 0 duration are removed. Unused AP is lost — it does not carry over. |
| **6. Pass Initiative** | Active combatant's turn ends. Next combatant in initiative order begins their Turn Start. |

---

## AP RULES

**AP Max by default:**
- Player Characters: 3
- Minion monsters: 1
- Standard monsters: 2
- Elite monsters: 3
- Boss monsters: 4

**AP Spend options per turn (PC default AP Max 3):**

| Combination | Explanation |
|---|---|
| 3 × Tier 1 | Three 1-AP cards |
| 1 × Tier 2 + 1 × Tier 1 | One 2-AP card, one 1-AP card |
| 1 × Tier 3 | One 3-AP card, nothing else |
| 1 × Tier 2 | Spend only 2 of 3 AP |
| 1 × Tier 1 | Spend only 1 of 3 AP |
| Any of the above + Basic Attack | Basic Attack is free (0 AP) and can be added to any combination |

**AP Max modifiers:**
- Overheat 3+: −1 AP Max at turn start (−2 at Overheat 6+)
- Certain class features and items can raise AP Max. These are specified in the relevant class or item file.
- AP Max cannot be reduced below 0 by status effects alone. A combatant always has at least the ability to use their Basic Attack.

**Unused AP is lost at end of turn. There is no AP carry-over.**

---

## BASIC ATTACK

- Costs **0 AP**
- Available **once per turn** to every combatant (player, monster, NPC)
- Always available — cannot be removed by Stagger, Silence, or Root
- Each combatant's Basic Attack is listed in their stat block or class sheet
- Basic Attacks use the primary stat for their attack type (IRON for melee, EDGE for ranged, etc.)
- Basic Attacks do not carry keywords unless an item specifically adds them

---

## CARD PLAY RULES

**Hand Size** is the number of cards in your combat deck. All cards in your deck are available every turn — there is no draw, no random element, no discard. Hand size is the number of options you have, not the number of cards you can play.

- Each card may be played **once per turn**. At the start of your next turn, all cards are available again.
- Cards cost AP equal to their Tier (Tier 1 = 1 AP, Tier 2 = 2 AP, Tier 3 = 3 AP, Tier 0 = 0 AP).
- **Passive cards** (Tier 0, category: Passive) are always active. They are never "played" — they count toward hand size but their effect is continuous.
- **Reaction cards** are held for triggered use. They are not played during the Card Phase — see Reaction Rules below.
- If a card says "once per combat" in addition to the once-per-turn rule, that supersedes the turn reset. Track once-per-combat uses separately.
- **Locked cards:** A card that has been used this turn is "locked" and cannot be played again until next turn. There is no way to un-lock a card mid-turn unless a specific card effect states otherwise.

**Maximum Hand Size:** 12. No character can exceed 12 cards regardless of modifiers.

---

## REACTION RULES

- Each combatant has **one Reaction per round** (not per turn — once per full initiative loop).
- Reactions are triggered by specific conditions listed on the card ("Triggered when an enemy attacks an ally within reach," etc.).
- Playing a Reaction does **not cost AP** from your turn. Reactions have their own once-per-round limit.
- Reaction cards are played immediately when their trigger condition is met. The triggering action pauses, the Reaction resolves, then the triggering action continues (or is modified by the Reaction).
- Once a Reaction is used this round, it is spent until Round End.
- **Simultaneous Reactions:** If multiple combatants wish to spend their Reaction in the same window, resolve in EDGE order, highest first. IRON breaks EDGE ties. True ties resolve simultaneously.
- Some class features grant additional Reactions per round (specified in the class file). Track these separately.
- Monsters use the `attr_monster_reaction_card_used` tracker — each monster gets one Reaction per round.

---

## DAMAGE RESOLUTION PIPELINE (ABBREVIATED)

*For the full pipeline with examples, see `02_keywords_and_status.md`. This version is for quick in-play reference.*

| Step | Action |
|---|---|
| **1** | Card base damage value |
| **2** | + attacker's primary stat (IRON/EDGE/SIGNAL/RESONANCE/VEIL/FRAME) |
| **3** | + attacker-side modifiers (item bonuses, Overclock, class passives) |
| **4** | − Pierce X (reduce Guard/Shield by Pierce value first), then − Guard, − Shield |
| **5** | × Vulnerable multiplier, then + Expose value |
| **6** | Minimum 0 (clamp) |
| **7** | Apply HP loss, update trackers |

**Primary stat by card type:**

| Card Type | Primary Stat |
|---|---|
| Melee Attack | IRON |
| Precision / Ranged Attack | EDGE |
| Signal Attack | SIGNAL |
| Resonant Attack | RESONANCE |
| Social / Command | VEIL |
| Endurance / Anchor | FRAME |
| Mixed | Higher of two specified stats |

---

## STATUS EFFECT QUICK TABLE

*One line per status. For full rules, see `02_keywords_and_status.md`.*

| Status | Effect Summary | Duration | Removed By |
|---|---|---|---|
| **Guard X** | Absorbs X incoming damage (consumed as used) | Until consumed or turn end | Dispel (all stacks), Burn (strips), Pierce (reduces effective) |
| **Shield X** | Absorbs X incoming damage; persists across turns | Until depleted | Dispel (all stacks) |
| **Bleed X** | X damage at end of target's turn; ignores Guard | Persists | Cleanse |
| **Burn X** | X damage at end of turn; strips Guard before HP | Persists | Cleanse |
| **Expose X** | +X damage on every incoming hit (additive, post-mitigation) | Persists | Cleanse |
| **Vulnerable X** | Incoming damage ×(1+0.1×X) — multiplicative | Persists | Cleanse |
| **Overheat X** | 3+ stacks: −1 AP Max at turn start | Persists | Cleanse (removes all), rest |
| **Stagger** | Cannot play Tier 2–3 cards this turn | 1 turn | Cleanse, Fortify (prevents) |
| **Root** | Cannot play Mobility cards this turn | 1 turn | Cleanse, Fortify (prevents) |
| **Silence** | Cannot play Signal or Resonance cards this turn | 1 turn | Cleanse, Fortify (prevents) |
| **Taunt** | Must target Taunter if able | Until target's next turn | Cleanse, Fortify (prevents), Taunter dies |
| **Mark** | Enables Mark-synergy effects on this target | Until triggered or expired | Dispel |
| **Veil** | First hostile card targeting you loses all riders | Until consumed | Dispel |
| **Fortify** | Control effects fail or are halved when applied | 1 round | Dispel |
| **Regen X** | Recover X HP at start of turn | Specified turns | Dispel, Cleanse (one stack) |

---

## MONSTER AI PRIORITY TABLE

When running monsters, use their assigned role to determine decision priority. If in doubt, follow the role's first priority.

---

### SKIRMISHER
*High EDGE, moderate damage, prioritizes mobility and evasion.*

**Decision Priority:**
1. Attack the lowest-HP enemy in range
2. If multiple equal targets, attack the one least likely to react (lowest EDGE)
3. Use Mobility cards to avoid adjacency with tanks/high-IRON targets
4. Spend Reaction to evade if hit-triggering condition is met
5. Apply Bleed or Expose if available before landing heavy hits

---

### BRUTE
*High IRON and FRAME, high damage, low AP flexibility.*

**Decision Priority:**
1. Attack the highest-value target (the character who has dealt the most damage to the group, or the healer/support)
2. Use AP on the highest-AP-cost attack available
3. Use Basic Attack as a free additional hit every turn, always
4. Ignore Guard-heavy targets unless Expose tools are available
5. Do not Retreat — Brutes stand their ground

---

### CONTROLLER
*High SIGNAL or VEIL, low HP, high status output.*

**Decision Priority:**
1. Apply Silence or Stagger to the most dangerous card-user in the party
2. Apply Expose or Vulnerable to whoever the Brutes/Skirmishers are hitting
3. Stay away from melee — use Signal cards from range
4. Spend Reaction to apply a debuff rather than take a hit
5. If threatened, apply Root and reposition

---

### SUPPORT
*Moderate stats, focused on healing and buffing allies.*

**Decision Priority:**
1. Apply Guard or Regen to the most damaged allied combatant
2. Cleanse debuffs from highest-threat allied combatant
3. If no healing needed, apply Taunt or Expose to help allies
4. Avoid taking damage at all costs — use Reaction defensively
5. Only attacks if all allies are at full HP or buffed

---

### BOSS
*High everything. 4 AP. Unique behavior specified in stat block.*

**Decision Priority (default — override with stat block AI section):**
1. Use Signature (Tier 3–4) cards when AP allows
2. Alternate between single high-value targets and area effects
3. Use Reactions aggressively, especially after taking significant damage
4. Apply escalating status pressure (Expose → Vulnerable → Bleed stack)
5. When below 50% HP, shift to highest-damage mode — Boss AI typically specifies a "Phase 2" in the stat block

---

## ROUND END CHECKLIST

At the end of every round (once every combatant has taken their turn):

- [ ] All Reactions reset (each combatant's once-per-round Reaction is restored)
- [ ] Round-scoped effects expire (any card that says "until end of round" ends now)
- [ ] Check for Bleed/Burn — if these were missed during the turn, resolve them now (then adjust timing going forward)
- [ ] Advance any encounter-level timers (reinforcement arrivals, environmental events)
- [ ] Note if any combatant has reached a HP threshold that triggers a special encounter effect
- [ ] Confirm initiative order is still correct (if any cards modified EDGE during the round)

---

## COMMON EDGE CASES

---

**What happens when a character's AP is 0 at turn start?**
They can still use their Basic Attack (0 AP). That is always available. They cannot play any cards that cost AP. If Overheat has reduced AP Max to 0, the character still takes their turn — they just cannot spend AP. They may use their Reaction normally later in the round.

---

**What happens when a character's hand is empty?**
This should not happen under normal rules (the hand represents available options, all always available), but if a character has had all cards removed through special effects or edge cases: they may use their Basic Attack and nothing else. Their Reaction, if applicable, is still available.

---

**What happens when two Reactions trigger simultaneously?**
Resolve in EDGE order, highest first. IRON breaks EDGE ties. True ties resolve simultaneously — apply all effects and then resolve consequences together. If this creates a logical contradiction (both effects cannot be simultaneously true), the DM rules on outcome.

---

**What happens when a card effect references a stat that has been temporarily modified?**
Use the current value of the stat, not the base value. If IRON has been temporarily increased by an item or card effect, calculate damage using the current IRON. If SIGNAL has been reduced by Silence (preventing Signal cards, not reducing the stat), the stat itself is unchanged — only card access is restricted. Distinguish between stat modification (changes the number) and card access restriction (changes what you can play).

---

**What happens when a Fortified creature is targeted by a card that applies both damage and a control effect?**
The damage resolves normally. The control effect is blocked (single-stack) or halved (multi-stack). Fortify only blocks the control rider, not the damage.

---

**What happens when a Basic Attack is used against a Fortified target?**
Basic Attacks do not apply keywords unless specifically modified by items. A basic attack against a Fortified creature deals normal damage with no modification from Fortify.

---

**What happens when a once-per-combat card is played, then the combat ends and a new combat begins?**
Once-per-combat limits reset between combats (after a short rest or natural break in the encounter). If combat flows continuously without a break (e.g., new enemies arrive as reinforcements mid-fight), the DM determines whether it is the same combat instance. Default ruling: new enemies entering an ongoing fight do not reset once-per-combat limits.

---

**What happens when a target with Taunt dies?**
Taunt ends immediately. Affected creatures may target normally on their next action.

---

*For full keyword rules and the detailed damage pipeline, see `02_keywords_and_status.md`. For character options and class references, see `04_character_creation.md`.*
