# TESSHARI KEYWORDS AND STATUS EFFECTS
## Comprehensive Reference — Standalone Document

---

> This document is the authoritative reference for every keyword and status effect in Tesshari. When a card says "apply Overheat 2" and someone at the table asks what that means, this is the document you open. Read the relevant entry. Apply it exactly as written. Close the document and continue.

---

## QUICK INDEX

| Keyword | Type | Page Section |
|---|---|---|
| Bleed | Debuff | Section 2 |
| Burn | Debuff | Section 2 |
| Cleanse | Action | Section 3 |
| Dispel | Action | Section 3 |
| Echo | Buff | Section 4 |
| Expose | Debuff | Section 2 |
| Fortify | Buff | Section 1 |
| Guard | Buff | Section 1 |
| Mark | Tag | Section 4 |
| Overclock | Action/Debuff | Section 4 |
| Overheat | Debuff | Section 2 |
| Pierce | Modifier | Section 4 |
| Regen | Buff | Section 1 |
| Root | Debuff | Section 2 |
| Shield | Buff | Section 1 |
| Silence | Debuff | Section 2 |
| Stagger | Debuff | Section 2 |
| Taunt | Debuff | Section 2 |
| Veil | Buff | Section 1 |
| Vulnerable | Debuff | Section 2 |

---

## SECTION 1 — DEFENSIVE BUFFS

---

### GUARD X

**Type:** Buff — Damage Prevention
**Duration:** Until consumed or start of next turn (see Stack Rule)
**Stack Rule:** Guard stacks accumulate additively. Guard 3 + Guard 2 = Guard 5. Each application adds to the pool.

**Exact Effect:** When the character bearing Guard would take damage, subtract X from the incoming damage. Guard is consumed as it is used — if you have Guard 5 and take 3 damage, Guard drops to 2 and you take 0 damage. If you take 8 damage, Guard drops to 0 and you take 3 damage.

**When It Triggers:** Applies before HP loss, during the damage resolution pipeline at Step 4 (defender-side prevention). See Damage Resolution Pipeline below.

**How It's Removed:**
- Consumed by absorbing damage (most common)
- Dispel removes all Guard stacks at once
- Burn deals damage that strips Guard before touching HP (see Burn entry)
- Some card effects specify that damage ignores or reduces Guard

**Interaction Notes:**
- Guard 0 is the same as having no Guard. There is no negative Guard.
- Pierce X reduces effective Guard by X against that specific card's damage. Guard 5 vs. Pierce 2 = effective Guard 3.
- Guard does not carry between turns unless a card explicitly states it persists.
- Multiple Guard applications in the same turn stack — Code Form granting Guard 5 and Oath Consecration granting Guard 8 on the same turn produces Guard 13.

---

### SHIELD X

**Type:** Buff — HP Buffer
**Duration:** Until depleted (unlike Guard, Shield persists across turns unless specified otherwise)
**Stack Rule:** Shield stacks accumulate additively. Shield 6 + Shield 4 = Shield 10.

**Exact Effect:** Shield is a separate HP buffer that absorbs damage before the character's HP is affected. Functions identically to Guard in terms of consumption, but persists across turns until depleted.

**When It Triggers:** Applies at Step 4 of damage resolution, alongside Guard. Shield is consumed before HP.

**How It's Removed:**
- Consumed by absorbing damage
- Dispel removes all Shield
- Certain card effects specify bypassing Shield (Pierce, some Tier 3 cards)

**Interaction Notes:**
- Shield and Guard both apply at Step 4. Resolve Guard first, then Shield, then HP. (DM's choice on order is acceptable; consistency matters more than specificity here.)
- Unlike Guard, a card that says "gain Shield 10 until depleted" maintains that Shield into subsequent turns. Read each card carefully — most defensive cards default to end-of-turn expiration unless they explicitly say "until depleted."
- The Ironclad Samurai's Vein of the Flesh card creates persistent Shield. Iron Vanguard creates persistent Shield. These are exceptions, not defaults.

---

### FORTIFY

**Type:** Buff — Control Resistance
**Duration:** 1 round (expires at the start of the affected character's next turn unless otherwise stated)
**Stack Rule:** Fortify does not stack. A second application of Fortify while the first is active simply refreshes the duration.

**Exact Effect:** While Fortified, all incoming control effects (Root, Silence, Stagger, Taunt, Overheat) are reduced in effectiveness. Specifically:
- Single-stack control effects (Root, Silence, Stagger, Taunt) applied while Fortified automatically fail.
- Multi-stack debuffs (Overheat X, Bleed X, Expose X, Vulnerable X) applied while Fortified have their stack value halved (rounded down, minimum 0).

**When It Triggers:** Checked when a control effect is applied to the Fortified character.

**How It's Removed:**
- Expires at start of next turn
- Dispel removes Fortify

**Interaction Notes:**
- Fortify does not retroactively remove existing debuffs. It only blocks or reduces new applications.
- If a card applies both damage and a control effect, Fortify blocks only the control effect — the damage resolves normally.
- Echomind Clarity from the Ironclad Samurai makes the character fully immune to control cards for one turn, which is stronger than Fortify.

---

### REGEN X

**Type:** Buff — Healing Over Time
**Duration:** Specified number of turns (each application states its own duration)
**Stack Rule:** Regen stacks add their values. Regen 2 + Regen 3 = Regen 5 at turn start.

**Exact Effect:** At the start of the affected character's turn, they recover X HP. Each Regen stack has its own duration tracker. When a stack's duration expires, it is removed.

**When It Triggers:** Turn Start. Resolves before the character takes any actions.

**How It's Removed:**
- Duration expires naturally
- Dispel removes all Regen stacks
- Cleanse removes one stack (chosen by the affected party)

**Interaction Notes:**
- Regen recovery cannot exceed maximum HP.
- Regen and Bleed can co-exist. Both resolve at turn start, in any order (DM's choice; recommend HP-gain first for narrative clarity, i.e., Regen then Bleed).
- Regen is not "healing" for card effect purposes unless a card specifically calls it healing. Regen is a keyword.

---

### VEIL

**Type:** Buff — Targeting Mitigation
**Duration:** Until consumed (lasts until the first hostile card that would target you this turn)
**Stack Rule:** Does not stack. Veil is a binary state — either active or consumed.

**Exact Effect:** The first hostile card that targets you this turn loses all rider effects (secondary effects, status applications, debuffs). The card still deals its base damage. Only the riders are stripped.

**When It Triggers:** At the moment a hostile card is played that targets you. The riders are stripped before they resolve.

**How It's Removed:**
- Consumed by the first applicable hostile card
- Dispel removes Veil

**Interaction Notes:**
- "Riders" means everything beyond the base damage: applied keywords, control effects, debuffs, secondary damage, forced movement.
- If a card deals no base damage (pure control), Veil causes the card to have no effect at all.
- Veil does not protect against area-effect cards that happen to include you — it only triggers against cards specifically targeting you.
- A player may choose not to trigger Veil (forgoing the protection) if they want the incoming status effect. Declare this before the card resolves.

---

## SECTION 2 — DEBUFFS

---

### BLEED X

**Type:** Debuff — Damage Over Time (Physical)
**Duration:** Persists until removed; damage ticks each turn
**Stack Rule:** Bleed stacks add together. Bleed 2 + Bleed 3 = Bleed 5.

**Exact Effect:** At the end of the affected target's turn, they take X damage. This damage is not modified by attack stats. It is flat damage equal to the current Bleed stack.

**When It Triggers:** End of the affected target's turn. Resolves after the character has finished all actions.

**How It's Removed:**
- Cleanse removes one Bleed stack (DM's discretion if partial or all — recommend full removal per Cleanse use)
- Dispel (though Bleed is a debuff, not a buff — some tables rule that Dispel removes only buffs. Default Tesshari ruling: Cleanse removes debuffs, Dispel removes buffs. Do not use Dispel to remove Bleed.)
- Specific card effects that explicitly remove Bleed
- Full rest

**Interaction Notes:**
- Bleed damage ignores Guard and Shield. It represents a wound that has already bypassed armor — the bleeding is happening beneath the defense.
- Bleed damage cannot be mitigated. It is flat and exact.
- Bleed is not Burn. Burn strips Guard. Bleed ignores Guard entirely after the initial application.
- Multiple sources of Bleed stack — Bleed 2 from one card + Bleed 3 from another = Bleed 5 ticking at end of turn.

---

### BURN X

**Type:** Debuff — Damage Over Time (Heat/System Damage)
**Duration:** Persists until removed; damage ticks each turn
**Stack Rule:** Burn stacks add together.

**Exact Effect:** At the end of the affected target's turn, Burn deals X damage. Unlike Bleed, Burn interacts with Guard: Burn damage strips Guard stacks first before affecting HP. If the target has Guard 3 and Burn 5, the Burn takes Guard to 0 and deals 2 damage to HP.

**When It Triggers:** End of the affected target's turn, after Bleed (if both are present).

**How It's Removed:**
- Cleanse removes one Burn stack
- Specific card effects
- Full rest

**Interaction Notes:**
- Burn strips Guard before dealing HP damage. This is Burn's defining mechanical property and is non-negotiable.
- Burn does NOT strip Shield. Only Guard is stripped.
- Burn and Overheat are thematically related (both represent system heat/overload) but mechanically separate. A creature can have both simultaneously.
- Against a creature with high Guard stacks, Burn is a Guard-destruction tool as much as a damage tool.

---

### EXPOSE X

**Type:** Debuff — Damage Amplification (Incoming)
**Duration:** Persists until removed
**Stack Rule:** Expose stacks add together. Expose 2 + Expose 3 = Expose 5.

**Exact Effect:** The Exposed target takes X additional damage from all incoming damage sources. Expose is applied at Step 5 of the damage resolution pipeline (defender-side amplification) — after Guard and Shield have already reduced the incoming hit.

**When It Triggers:** Automatically, on every hit against the Exposed target.

**How It's Removed:**
- Cleanse removes one Expose stack
- Dispel (Expose is a debuff — use Cleanse, not Dispel)
- Specific card effects
- Full rest

**Interaction Notes:**
- Expose is applied after mitigation. If a hit does 0 damage after Guard, Expose still adds its value — Expose 3 on a 0-damage hit = 3 damage.
- This means Expose can "break through" a perfectly defended hit. Plan accordingly.
- Expose does not multiply damage — it adds a flat value per hit.
- Vulnerable X multiplies; Expose X adds. Both can be active simultaneously and stack destructively.

---

### VULNERABLE X

**Type:** Debuff — Damage Multiplier (Incoming)
**Duration:** Persists until removed
**Stack Rule:** Each stack of Vulnerable adds 0.1 to the damage multiplier. Vulnerable 3 = incoming damage × 1.3.

**Exact Effect:** All incoming damage to the target is multiplied by (1 + 0.1 × X). Vulnerable 1 = ×1.1. Vulnerable 5 = ×1.5. Vulnerable 10 = ×2.0.

**When It Triggers:** Applied at Step 5 of the damage resolution pipeline, alongside Expose. Apply Vulnerable first (multiply), then Expose (add), then clamp to minimum 0.

**How It's Removed:**
- Cleanse removes one Vulnerable stack
- Full rest

**Interaction Notes:**
- Vulnerable is multiplicative, Expose is additive. Order matters. On a 10-damage hit with Vulnerable 3 and Expose 2: (10 × 1.3) + 2 = 15 damage.
- Vulnerable is the most dangerous long-term debuff in the game for bosses and elites. A stacked Vulnerable target can be deleted in a single turn.
- Vulnerable stacks from multiple sources accumulate. Oath-Shatter's Vulnerable 3 + another source's Vulnerable 2 = Vulnerable 5 on a single target.

---

### OVERHEAT X

**Type:** Debuff — System Overload
**Duration:** Persists until cleared; threshold triggers specific penalty
**Stack Rule:** Overheat stacks accumulate. The critical threshold is 3.

**Exact Effect:**
- **Overheat 1–2:** No immediate mechanical effect. Stacks are accumulating.
- **Overheat 3 or higher:** AP Max is reduced by 1 until Overheat stacks are fully cleared. This takes effect at the start of the next turn and persists until all stacks are removed.
- The Forged passive "Maintenance Dependent" can apply Overheat 1 at combat start in specific circumstances (missed rest without maintenance tools).

**When It Triggers:** The AP Max penalty applies at turn start whenever the character begins their turn with Overheat 3+.

**How It's Removed:**
- Cleanse removes stacks (one application of Cleanse removes all Overheat — Overheat is treated as a single status for Cleanse purposes)
- Specific card effects (the Forged's Override Protocol removes all Overheat from self)
- Full rest

**Interaction Notes:**
- Overclock deliberately inflicts Overheat 2 on the user. At Overheat 3+ threshold, using Overclock again can put you in AP deficit.
- Overheat does not reduce AP already spent. It reduces AP Max — if you have Overheat 3 on your turn and normally have 3 AP, you start with 2 AP.
- At Overheat 6+, AP Max is reduced by 2 (each 3 stacks over threshold reduces by 1 more). This is rare but mechanically consistent.
- The Arc-Split Blade weapon applies Overheat 1 on heavy hits. Multiple weapon hits in a turn can push a target toward threshold quickly.

---

### STAGGER

**Type:** Debuff — Action Limitation
**Duration:** Until end of the target's current turn (if applied during the target's turn) or until the end of their next turn (if applied outside their turn)
**Stack Rule:** Stagger does not stack. A second Stagger application refreshes the duration.

**Exact Effect:** The Staggered target cannot play Tier 2 or Tier 3 cards this turn. They can still use their Basic Attack (0 AP), Tier 1 cards, Tier 0 passives, and Reactions.

**When It Triggers:** Immediately on application.

**How It's Removed:**
- Expires at end of the relevant turn
- Cleanse removes Stagger
- Fortify prevents Stagger application

**Interaction Notes:**
- Stagger is devastating against classes that rely on Tier 3 Signature cards. Against a boss, Stagger removes their highest-impact options for a full turn.
- Stagger does not prevent the Basic Attack.
- Stagger does not prevent Reactions.
- A Staggered creature can still deal significant damage via Tier 1 cards and Basic Attack — Stagger limits, it doesn't eliminate.

---

### ROOT

**Type:** Debuff — Mobility Limitation
**Duration:** Until end of the target's current turn or next turn (same timing as Stagger)
**Stack Rule:** Root does not stack. A second Root refreshes duration.

**Exact Effect:** The Rooted target cannot play Mobility cards this turn. Cards explicitly tagged as Mobility in their category line are affected. The target can still move in abstract (Tesshari combat is not always on a strict grid), but card-based repositioning effects are disabled.

**When It Triggers:** Immediately on application.

**How It's Removed:**
- Expires at end of relevant turn
- Cleanse removes Root
- Fortify prevents Root application

**Interaction Notes:**
- Root is typically less critical in non-grid combat but becomes significant when Mobility cards grant positional advantages, bonus damage, or avoidance of specific threats.
- Root does not prevent the Basic Attack or any non-Mobility cards.
- In grid-based or zone combat, Root can be a full loss of turn positioning — coordinate with your DM on how grid movement interacts with Root.

---

### SILENCE

**Type:** Debuff — Card Type Restriction
**Duration:** Until end of target's current turn or next turn
**Stack Rule:** Silence does not stack.

**Exact Effect:** The Silenced target cannot play Signal cards or Resonance cards. Their category (listed in the card's header) determines which cards are affected.

**When It Triggers:** Immediately on application.

**How It's Removed:**
- Expires at end of relevant turn
- Cleanse removes Silence
- Fortify prevents Silence application
- Chassis Lock (Forged race card) can reduce Silence-via-Signal-disruption by 1 stack

**Interaction Notes:**
- Silence is the most class-dependent debuff. For a Wireweave or Pulse Caller, Silence effectively removes most of their hand. For an Ironclad Samurai, Silence removes Resonant attacks but leaves melee intact.
- Silence does not prevent Basic Attacks, Tier 0 passives, or cards of other categories.
- Echomind Clarity (Ironclad Samurai) makes the character immune to Silence for one turn.

---

### TAUNT

**Type:** Debuff — Target Restriction
**Duration:** Until start of the target's next turn
**Stack Rule:** Taunt does not stack. Re-application refreshes duration and updates the designated target.

**Exact Effect:** The Taunted creature must target the creature that applied Taunt (or that creature's position) with all hostile actions, if able. "If able" means if the Taunted creature can reach, target, or affect the Taunting creature with an attack or card, they must do so. If the Taunting creature is out of range for all available actions, the Taunted creature may act normally.

**When It Triggers:** On application. Persists until start of target's next turn.

**How It's Removed:**
- Expires at start of target's next turn
- Cleanse removes Taunt
- Fortify prevents Taunt application
- If the Taunting creature dies or becomes untargetable, Taunt ends immediately

**Interaction Notes:**
- Taunt is a strategic tool for tanks and control players. Iron Lord's Will applies Taunt to all enemies simultaneously — every enemy must attempt to target the Samurai.
- Taunt interacts with Reactions: a Taunted creature with a Reaction can still use it, but the Reaction's effect must be in the context of attacking the Taunter if applicable.
- If two Taunts are applied to the same creature (from different sources), the most recent application takes precedence.

---

### MARK

**Type:** Tag (not strictly a debuff or buff — it is a targeting designator)
**Duration:** Until specified by the applying card (usually until combat end or until triggered)
**Stack Rule:** Mark does not stack. A creature is either Marked or it is not.

**Exact Effect:** Mark by itself does nothing. Mark-synergy cards specify their effects when targeting a Marked creature. Common examples: bonus damage against Marked targets, additional status effects on Marked targets, guaranteed crits on Marked targets.

**When It Triggers:** When a card with a Mark-synergy effect is played against a Marked target.

**How It's Removed:**
- Some cards consume the Mark on trigger (one-time use)
- Dispel removes Mark (it functions as a debuff for Dispel purposes)
- Duration expires as specified by applying card

**Interaction Notes:**
- Always check the applying card's text to understand whether the Mark is consumed on trigger or persistent.
- Undying Debt (Ironclad Samurai) applies Mark to an oath-debt enemy. Cards that reference Mark-synergy deal bonus effects against this target for the duration.
- Multiple characters can set up Mark synergies across turns. One player Marks, another triggers. Coordinate during planning.

---

## SECTION 3 — REMOVAL EFFECTS

---

### CLEANSE

**Type:** Action/Effect
**Target:** Self or ally (as specified on the card)
**Effect:** Removes one debuff from the target. The applying player or the target chooses which debuff is removed (DM adjudicates disputes). For Overheat specifically, Cleanse removes all stacks.

**Interaction Notes:**
- Cleanse removes debuffs: Bleed, Burn, Expose, Stagger, Root, Silence, Overheat, Vulnerable, Taunt, Mark.
- Cleanse does not remove buffs. Use Dispel for that.
- If no debuffs are present, Cleanse is wasted (does nothing).
- Some cards (e.g., Seventh Resonance) Cleanse all debuffs simultaneously. These will say "Cleanse all debuffs" rather than just "Cleanse."

---

### DISPEL

**Type:** Action/Effect
**Target:** Enemy (as specified on the card)
**Effect:** Removes one buff from the target. The applying player chooses which buff is removed. The target cannot contest this choice.

**Interaction Notes:**
- Dispel removes buffs: Guard (all stacks), Shield (all stacks), Fortify, Regen (one stack or all — card specifies), Veil, Mark (for Dispel purposes, Mark is treated as a targeting buff on the enemy).
- Dispel does not remove debuffs. Use Cleanse for that.
- Iron Judgment (Ironclad Samurai) specifies "Dispel (Guard only)" — it can only strip Guard, not other buffs.
- Override Protocol (Forged race card) specifies "Dispel" in its keyword line. In self-use mode, this Cleanses the self. In offensive mode, it Dispels from a target.

---

## SECTION 4 — OFFENSIVE MODIFIERS

---

### PIERCE X

**Type:** Attack Modifier
**Applies To:** The specific card or attack it is listed on
**Stack Rule:** Pierce values add. Pierce 2 on a weapon + Pierce 1 from a card = Pierce 3 on that attack.

**Exact Effect:** Ignore X Guard and Shield when calculating damage. If a target has Guard 5 and you attack with Pierce 3, resolve the hit as if the target had Guard 2.

**When It Triggers:** Step 4 of the damage resolution pipeline (defender-side prevention). Reduce effective Guard/Shield by Pierce value before calculating damage absorbed.

**Interaction Notes:**
- Pierce cannot reduce Guard or Shield below 0. You cannot "negative-pierce" into bonus damage.
- Pierce does not ignore Fortify. Fortify is a control-resistance buff, not a damage reduction buff.
- Pierce does not interact with Expose or Vulnerable — those apply after mitigation regardless.
- Very high Pierce values (Perfect Kata's Pierce 20, Oath-Shatter's Pierce 10) effectively mean "this attack ignores all Guard/Shield for practical purposes" — most targets will not have Guard/Shield stacks that high.

---

### ECHO

**Type:** Attack Modifier
**Duration:** Single activation

**Exact Effect:** When a card with Echo is played, repeat its base damage once, targeting the same creature. The repeated hit does not apply rider effects (status effects, keyword applications, secondary effects). Only the raw base damage repeats.

**When It Triggers:** Immediately after the card's primary effect resolves.

**Interaction Notes:**
- The Echo hit is a separate hit. It can be blocked by remaining Guard/Shield (after the primary hit depleted some).
- The Echo hit does not trigger Mark-synergy effects, Bleed/Burn application, or any keyword beyond the bare damage.
- Expose and Vulnerable affect the Echo hit (they apply to all incoming damage to the defender).
- The Echo hit does add the attacker's primary stat (since base damage includes the stat modifier). Clarification: "base damage" in the context of Echo means the card's numerical value + primary stat — the full first-hit damage output, minus all rider effects.

---

### OVERCLOCK

**Type:** Attack/Effect Modifier — Self-Targeting
**Applies To:** The card it appears on; cannot be applied externally

**Exact Effect:** When you play a card with Overclock (or when a card says "you may Overclock this card"), amplify the card's effect — typically doubling its damage, maximizing its healing, or adding a bonus keyword. The exact amplification is specified on the card. After using Overclock, apply Overheat 2 to yourself.

**When It Triggers:** The player declares Overclock when playing the card, before the card resolves.

**Interaction Notes:**
- Overclock is voluntary. Players choose whether to Overclock each time they play an applicable card.
- The Overheat 2 from Overclock is immediate and applies even if the card's main effect fails or is Veil'd.
- If you already have Overheat 1 and use Overclock, you now have Overheat 3 — the AP penalty triggers immediately on your next turn.
- Strategic use: Overclock a Tier 3 card for devastating output, then plan around reduced AP the next turn.

---

## THE DAMAGE RESOLUTION PIPELINE

This is the definitive order of operations for every damage calculation in Tesshari. No dice are rolled. All values are deterministic.

---

### Full Pipeline (7 Steps)

| Step | What Happens | Notes |
|---|---|---|
| **1** | Read the card's base damage value | The number printed on the card |
| **2** | Add attacker's primary stat for that card type | IRON for Melee, EDGE for Precision/Ranged, SIGNAL for Signal, RESONANCE for Resonant, VEIL for Social/Command, FRAME for Endurance. Mixed cards use the higher of the two specified stats. |
| **3** | Apply attacker-side modifiers | Overclock amplification, Echo (processed after), item bonuses (+X damage from weapon), class passives that add damage, any "deal +X damage this turn" effects |
| **4** | Apply defender-side prevention | Subtract Pierce X from Guard/Shield first. Then subtract remaining Guard, then Shield. Clamp Guard and Shield to 0 (cannot go negative). |
| **5** | Apply defender-side amplification | Apply Vulnerable first: multiply running damage by (1 + 0.1 × Vulnerable stacks). Then apply Expose: add Expose stack value to running damage. |
| **6** | Clamp to minimum 0 | Damage cannot be negative. If Step 4 reduces it below 0, it is 0. |
| **7** | Commit results | Apply HP loss, update Guard/Shield pools, trigger any on-damage effects, update status trackers. Log the result. |

**Example:** Blade of Obligation (22 base damage, IRON 5, Expose 2 on target, target has Guard 3)
- Step 1: 22
- Step 2: 22 + 5 = 27
- Step 3: No modifiers (assuming no weapon/item bonus)
- Step 4: No Pierce; Guard 3 absorbs → 27 − 3 = 24. Guard drops to 0.
- Step 5: Expose 2 adds → 24 + 2 = 26. (No Vulnerable on target.)
- Step 6: 26 > 0. No clamp needed.
- Step 7: Target loses 26 HP.

---

## STATUS TIMING CHART

When do statuses trigger? Use this chart to resolve any timing dispute.

| Timing Window | Status Effects That Trigger |
|---|---|
| **Turn Start** | AP resets to AP Max (reduced if Overheat 3+). Regen heals X HP. Per-turn trackers clear (Basic Attack usage, once-per-turn passives). |
| **During Turn — Card Play** | Guard, Shield, Veil, Fortify all apply when cards targeting you are played. Stagger, Root, Silence, Taunt immediately take effect when applied. Pierce reduces Guard/Shield on the hit that carries it. |
| **On-Hit (Attacker resolves)** | Echo triggers immediately after primary hit. Mark-synergy effects resolve. Pierce, Expose, Vulnerable all apply in pipeline sequence. |
| **On-Damaged (Defender reacts)** | Burn strips Guard before HP loss occurs. Forged Resilience passive triggers (Guard 4 applied to this specific hit only). Shield and Guard consumed. |
| **Reaction Window** | Between any combatant's actions. Reactions are played in response to the triggering event. Reaction cards resolve before the triggering action's results are locked in (for defensive Reactions) or immediately after (for counterattack Reactions). |
| **Turn End** | Bleed X damage ticks (then Burn X damage ticks, in that order). Status durations reduce by 1. Statuses with 0 remaining turns are removed. Unused AP is lost. |
| **Round End** | Reaction allowances reset (all combatants regain their one Reaction). Round-scoped effects expire. |
| **On-Expire** | When a status expires by duration, no additional effect triggers unless the card that applied it specified an "on-expire" effect. |

---

## STACKING INTERACTIONS — COMMON COMPLEX CASES

---

### Burn + Guard
Burn damage at end of turn strips Guard stacks first. If a creature has Guard 6 and Burn 4, the Burn strips Guard to 2 and deals 0 HP damage. If the same creature has Burn 7 and Guard 3, Burn strips Guard to 0 and deals 4 HP damage.

---

### Bleed + Guard
Bleed ignores Guard entirely. Bleed X deals X damage to HP directly, regardless of Guard stacks. Guard does not protect against Bleed. This makes Bleed particularly effective against heavily armored targets.

---

### Overclock + Overheat
Using Overclock applies Overheat 2. If you were at Overheat 1, you are now at Overheat 3 — AP Max reduces by 1 on your next turn. If you were at Overheat 2, you hit 4, but the penalty threshold is 3+, so you are still at −1 AP Max (not −2, unless at 6+).

---

### Expose + Vulnerable + Bleed on the same target
All three can co-exist. Bleed ticks at end of turn and ignores Guard (but is not amplified by Expose or Vulnerable — Bleed is a flat tick). Expose and Vulnerable amplify active card hits. The combination is lethal — stack Expose and Vulnerable first, then hit hard with attacks that deal full card damage.

---

### Two Reactions triggered simultaneously
Each combatant has one Reaction per round. If two different combatants both wish to spend their Reaction in the same window (e.g., both want to react to the same enemy attack), resolve them in EDGE order, highest first. Simultaneous EDGE uses IRON as tiebreak. True ties resolve simultaneously.

---

### Veil + a card with no base damage
If a card has no base damage (pure control, pure status application, forced movement), Veil strips the only content of the card, making it have no effect. The player who spent AP to play that card loses the AP. Veil is consumed.

---

### Fortify + Overheat
Fortify halves multi-stack debuff applications (round down). Overheat 4 applied to a Fortified target becomes Overheat 2. If the target was already at Overheat 2, they are now at Overheat 4 — which exceeds the threshold even after halving.

---

### Guard stacking across multiple cards
Multiple Guard applications in the same turn stack freely. Guard 5 (Code Form) + Guard 8 (Oath Consecration) + Guard 3 (race card) = Guard 16 on a single turn. This is powerful but temporary — Burn will strip it, and it expires at start of next turn unless cards specify persistence.

---

### Taunt + the Taunting creature being at range 0
If the Taunted creature cannot reach the Taunter with any available card or attack (all options require adjacency and the Taunter is not adjacent), the Taunted creature acts normally for that turn. Taunt only forces target selection when the forced target is reachable. If it is not reachable, it does not force the creature to simply do nothing.

---

*For combat encounter structure and turn sequence, see `system/03_combat_reference.md`. For character creation using these mechanics, see `system/04_character_creation.md`.*
