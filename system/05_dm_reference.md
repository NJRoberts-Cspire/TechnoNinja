# TESSHARI DM REFERENCE
## Master Reference for Running the Broken Reaches

---

> This document covers everything a DM needs to run Tesshari that is not already in the player-facing files. It assumes you have read `00_core_rules.md`. Combat mechanics are in `02_keywords_and_status.md` and `03_combat_reference.md`. This document covers what those don't: encounter design, AI, difficulty, loot, NPCs, factions, and the campaign's strange spaces.

---

## RUNNING ENCOUNTERS

### Core Design Principle

Tesshari encounters are interesting when the enemy selection creates problems that require different solutions simultaneously. A room of eight identical Brutes is not interesting. A room with one Brute, two Controllers, and a Support is interesting — the party must decide which threat to eliminate first and accept consequences from the others while doing so.

Good encounters have:
- **A primary threat** (the thing that kills you fastest if ignored)
- **A secondary threat** (the thing that makes dealing with the primary threat harder)
- **An optional threat** (an additional complication that rewards tactical play)

---

### How Many Monsters

Use this framework to build balanced encounters by threat role:

| Party Size | Minions (1 AP) | Standards (2 AP) | Elites (3 AP) | Boss (4 AP) |
|---|---|---|---|---|
| Thinking of it as "AP Budget" | Each Minion = 1 AP/turn | Each Standard = 2 AP/turn | Each Elite = 3 AP/turn | Boss = 4 AP/turn + specials |

A party of 4 PCs generates roughly 12 AP of actions per round. Balanced encounter: monsters total 8–10 AP/round of output. Challenging: 10–14. Deadly: 14+.

More useful: think in terms of roles, not just AP. See the Encounter Budget Table below.

---

## ENCOUNTER BUDGET TABLE

For quick encounter building. Adjust up for a rested party, down for a depleted one.

**Party Level 1–5:**

| Difficulty | Composition Examples |
|---|---|
| Standard | 4 Minions + 1 Standard; or 2 Standards + 2 Minions; or 1 Elite |
| Challenging | 1 Elite + 3 Minions; or 2 Standards + 1 Elite; or 1 Elite + 1 Standard + 2 Minions |
| Deadly | 1 Boss; or 1 Elite + 2 Standards; or 1 Boss + 2 Minions |

**Party Level 6–10:**

| Difficulty | Composition Examples |
|---|---|
| Standard | 2 Elites; or 1 Elite + 3 Standards; or 6 Standards |
| Challenging | 1 Boss + 2 Standards; or 2 Elites + 1 Standard + 2 Minions; or 3 Elites |
| Deadly | 1 Boss + 1 Elite; or 2 Bosses; or 1 Boss + 3 Standards + 4 Minions |

**Party Level 11–15:**

| Difficulty | Composition Examples |
|---|---|
| Standard | 1 Boss + 2 Elites; or 3 Elites + 2 Standards; or 2 Bosses |
| Challenging | 2 Bosses + 1 Elite; or 1 Boss + 4 Elites |
| Deadly | 2 Bosses + 2 Elites + 4 Standards; or 3 Bosses |

**Party Level 16–20:**

At this level, individual monster statistics matter more than quantity. A single late-game Boss can be a Deadly encounter for a well-rested party. Prioritize environmental design (verticality, hazards, objectives) over adding bodies.

---

### Mix Roles for Interesting Encounters

| Role Combination | Why It Works |
|---|---|
| Brute + Controller | The Brute hits hard; the Controller prevents the party from stacking defenses or reactions |
| Skirmisher + Support | Skirmishers are hard to catch; Support keeps healing them just when the party thinks they've won |
| Controller + Multiple Minions | Minions are dangerous when the party is Staggered, Silenced, or Rooted and cannot spend AP on area effects |
| Boss + Support | The Boss is terrifying; the Support makes it nearly unkillable |
| Two Bosses | For dramatic late-campaign encounters; almost always Deadly unless party has significant sustain |

---

## MONSTER AI QUICK RULES

Full AI decision-making by role. Use these when players ask why a monster is doing what it's doing — these are the rules, not improvisation.

---

### SKIRMISHER
*Role: Harass. Eliminate weak targets. Avoid sustained combat.*

1. Target the lowest-HP character in reach.
2. Apply Bleed or Expose before landing heavy attacks — soften, then spike.
3. Stay mobile. Use Mobility cards to avoid being adjacent to IRON-primary characters at turn end.
4. Use Reaction to avoid damage, not to deal it.
5. Retreat (via Mobility) if below 30% HP, if that option exists.

---

### BRUTE
*Role: Hit hard. Tank punishment. Force the party to deal with you.*

1. Target the character who poses the greatest threat, or the most recent attacker.
2. Use the highest-AP-cost attack available every turn.
3. Always use Basic Attack — never skip it.
4. Do not flee. Brutes stand their ground at all HP levels.
5. Use Reaction offensively (counter-attacks) rather than defensively.

---

### CONTROLLER
*Role: Disable. Make the party's best options unavailable.*

1. Apply Silence to Signal/Resonance-primary characters first.
2. Apply Stagger to whoever has the highest AP output.
3. Apply Expose or Vulnerable to the Brute's primary target.
4. Stay out of melee. If in melee, spend AP to Root and reposition.
5. Use Reaction defensively — Controllers die fast once exposed.

---

### SUPPORT
*Role: Sustain allied monsters. Make the encounter last longer than the party planned.*

1. Heal or apply Guard to the allied monster most likely to die this round.
2. Cleanse debuffs from the highest-threat allied monster.
3. Apply Taunt or Expose to assist allied damage-dealers if no healing is needed.
4. Never use Reaction offensively. Use Reaction to apply Guard to an ally about to be hit.
5. Die last. If the Support is the last monster standing, it surrenders (and potentially provides information).

---

### BOSS
*Role: Everything at once. Phase changes. Scene dominance.*

Default Boss priorities (always override with the stat block's specific AI section):

1. Use Tier 3–4 cards when AP allows. Bosses should feel qualitatively different from Elites.
2. Alternate between single-target spike damage and area-effect cards. Do not focus-fire the same character every turn.
3. Use Reactions aggressively, especially against Reactions.
4. Apply escalating status pressure: Expose first, then Vulnerable when Expose is stacked, then heavy damage.
5. **Phase 2 trigger:** When the Boss reaches 50% HP, shift behavior. Most Boss stat blocks specify a Phase 2. If improvising: increase aggression (target the highest-HP party member instead of the lowest), use any once-per-combat abilities.

---

## DIFFICULTY CHECKS

For non-combat challenges, set difficulty against one of the six stats. Use this scale consistently.

| Difficulty | Target Number | Example |
|---|---|---|
| **Trivial** | Stat 2 or lower | Anyone can do this with care |
| **Easy** | 3 | The task is simple but requires real attention |
| **Moderate** | 4 | A trained or well-enhanced person handles this comfortably |
| **Hard** | 5 | Specialist-level; most people fail this without preparation |
| **Very Hard** | 6 | Elite-tier; even specialists sometimes fail |
| **Extreme** | 7–8 | Requires exceptional enhancement or rare expertise |
| **Near-Impossible** | 9–10 | The outer edge of what enhanced flesh achieves |

**Examples by stat:**

| Task | Stat | Difficulty |
|---|---|---|
| Bend a reinforced security door | IRON | 6 |
| Notice a concealed puppet signature | EDGE | 5 |
| Survive without maintenance in the Ashlands for a week | FRAME | 4 |
| Crack a Wire Market encryption protocol | SIGNAL | 6 |
| Communicate with an Iron Afterlife entity | RESONANCE | 7 |
| Convince a Korrath soldier to ignore procedure | VEIL | 5 |
| Move silently through a sensor array | EDGE | 5 |
| Identify an enhancement's origin by feel | SIGNAL | 4 |
| Resist the Between's pull on a thin-place boundary | RESONANCE | 5 |
| Persuade a Sutra Orthodoxy elder | VEIL | 6 |

**Assisting:** When a character assists another, add 1 to the acting character's effective stat for that check only, if the assisting character has at least 3 in the relevant stat.

**Extended Checks:** For tasks that take multiple attempts (hacking a sustained defense, treating a long-term injury), call for checks at meaningful intervals. Failures don't necessarily mean full failure — they may mean setbacks, time cost, or partial results.

---

## LOOT GUIDELINES

### Loot by Dungeon Difficulty

| Difficulty | Items | Quality | Rarity Distribution |
|---|---|---|---|
| **Standard** | 1–2 items | Common–Uncommon | 70% Common, 30% Uncommon |
| **Challenging** | 2–3 items | Uncommon–Rare | 40% Common, 45% Uncommon, 15% Rare |
| **Deadly** | 3–4 items | Uncommon–Rare | 20% Uncommon, 55% Rare, 25% Very Rare |
| **Encounter with a Boss** | 4–5 items + 1 special | Rare–Very Rare | 30% Rare, 50% Very Rare, 20% Artifact |

**Special items** from Boss encounters should be mechanically unique — not just stat boosts, but card-modifying items that change how a specific card functions. These create build moments.

### What Kind of Loot

- **Weapons:** Modify existing Attack card category. Found in combat encounters, often on defeated officers or elite enemies.
- **Cybernetic Enhancements:** Stat increases or hand size +1. Found in medical/research locations, Wire Market sources, and Forge Tender caches.
- **Resonant Items:** Modify Resonant or Signal cards. Found in Sutra spaces, Between-adjacent locations, Iron Afterlife edges.
- **Artifacts of the Prior Ascended:** Powerful, often unpredictable. Found in deep locations, ruins of old Tesshari sites. These items can change encounter dynamics, not just improve stats.
- **Currency (RM — Resonant Marks):** Convert to purchases using prices in `items/06_everyday_items_and_economy.md`.

### Faction-Specific Loot

Defeating Korrath soldiers: military-grade enhancements, documentation items, structured weapons.
Defeating Vaen pilgrims (unlikely but possible): resonance-stripped items, organic tools, items that function better without enhancements active.
Defeating Hollow Author puppets: network interface items, items with the Shellbroken resonance signature, occasionally items the Author "installed" into a puppet for a specific purpose.

---

## NPC COMBAT STATS

When you need to run a named NPC in combat and their stat block is not defined, use this framework.

### Step 1 — Assign Tier

| NPC Description | Tier |
|---|---|
| Civilians, minor functionaries, untrained | Minion |
| Professional soldiers, skilled traders, minor officials | Standard |
| Officers, specialized operatives, notable figures | Elite |
| Named major NPCs, faction leaders, legendary figures | Boss |

### Step 2 — Assign Role

Pick the role that fits their fighting style. See Monster AI Quick Rules for decision priorities.

### Step 3 — Estimate Stats

Use the character's description to allocate 10–18 points across the six stats. Do not stress this — rough numbers are fine.

| NPC Type | Suggested Spread |
|---|---|
| Military/fighter | IRON 4–5, EDGE 3, FRAME 4, SIGNAL 2, RESONANCE 2, VEIL 2 |
| Wire Market operative | SIGNAL 5, EDGE 4, FRAME 2, IRON 2, RESONANCE 1, VEIL 3 |
| Sutensai priest | RESONANCE 5, VEIL 4, FRAME 3, IRON 2, SIGNAL 2, EDGE 2 |
| Social/political figure | VEIL 5, SIGNAL 3, EDGE 3, FRAME 2, IRON 1, RESONANCE 2 |
| Ashlands survivor | IRON 4, EDGE 4, FRAME 4, SIGNAL 2, RESONANCE 2, VEIL 1 |

**HP for improvised NPCs:**

| Tier | HP Estimate |
|---|---|
| Minion | 20–30 |
| Standard | 35–55 |
| Elite | 60–90 |
| Boss | 100–200+ |

### Step 4 — Pick 3–5 Cards from the Generic List

Draw from this list based on role and description. Add any class-specific cards if the NPC has a clear class.

**Generic Combat Cards (available to any NPC):**

- *Measured Strike* — Tier 1 Melee Attack: 6 + IRON damage
- *Precision Shot* — Tier 1 Ranged Attack: 5 + EDGE damage
- *Signal Burst* — Tier 1 Signal Attack: 5 + SIGNAL damage, applies Stagger
- *Resonant Interference* — Tier 1 Resonant: 4 + RESONANCE damage, applies Silence
- *Hold Position* — Tier 1 Defense: Guard 5 + FRAME
- *Coordinated Fire* — Tier 1 Control: Mark one target; next allied attack on that target +4 damage
- *Quick Draw* — Tier 0 Passive: +1 to EDGE for initiative purposes
- *Trained Formation* — Tier 1 Reaction: When ally is attacked, reduce that attack's damage by 3 + FRAME
- *Status Round* — Tier 2 Control: Apply Expose 2 + Root to one target
- *Overwhelming Force* — Tier 2 Attack: 14 + IRON damage; apply Stagger

Bosses and Elites may additionally use:
- *Signature Command* — Tier 3: Deal 18 + primary stat damage; apply a combination of 2 status effects appropriate to the NPC's role

---

## FACTION PRESSURE

The three Claimants exert mechanical pressure on the campaign even when they are not directly present. Each one has a default mode — how they make themselves felt in encounters and quests without appearing in person.

---

### KORRATH THE UNBROKEN (The Warlord)

**How Korrath Appears:** Checkpoints, military patrols, documentation demands, economic control. His pressure is structural — the enforcement of order that feels reasonable from inside the system and crushing from outside it.

**Mechanical Pressure in Encounters:**
- Korrath encounters often include the "Unmaking" dynamic: enemies who target enhancements specifically, potentially stripping items or debuffing enhancement-dependent abilities.
- Korrath forces tend to be well-organized. Their Supports and Controllers act in coordinated sequence — apply Silence first, then the Brutes attack the Silenced targets. This requires DM coordination between monster turns.
- Korrath's officers (Elite tier) often carry *Enhancement Override* — a capability that can temporarily disable one enhancement item on a target, forcing them to fight without it for 1d4 rounds.

**What His Presence Costs Players:**
- Navigation costs: traveling through Sunder Reach requires documentation, which requires VEIL checks or SIGNAL checks to forge. Failure means detention.
- Resource costs: Korrath's territory enforces enhancement registration. Operating with salvage or unregistered enhancements attracts attention and may result in confiscation.
- Social costs: taking Korrath's side in any conflict closes doors with Vaen's movement and the Sutensai moderates. Taking actions against him generates military response within 1d4 sessions.

---

### VAEN OF THE EMPTY HAND (The Unshackled)

**How Vaen Appears:** The Pilgrimage is a presence, not an army. Her pressure is moral and social — she creates situations that require characters to choose what they stand for.

**Mechanical Pressure in Encounters:**
- Vaen encounters rarely involve direct combat with the Pilgrimage. When they do, Pilgrimage fighters are Tethered or Voided (enhancement-stripped) individuals who lack the raw output of enhanced combatants — but who are immune to the equipment-targeting and enhancement-disruption that Korrath uses, and who carry unusual resonance-based abilities (see Tethered and resonance-pure combat).
- The Pilgrimage's outer ring (followers who aren't fully on the path) can turn violent. When this happens, the DM should make clear that Vaen did not authorize it — the encounter is morally complicated, not a simple fight.
- Vaen herself is in a room: she is not a combat encounter. If the party meets her, it is a social encounter with a person of extraordinary spiritual presence. VEIL checks to read her reliably: difficulty 8.

**What Her Presence Costs Players:**
- Social costs: alignment with Vaen creates conflict with Sutra Orthodoxy leadership (who regard the Voiding as heresy) and with Korrath (who regards voluntary Voiding as destabilizing).
- Resource costs: Vaen's movement does not use standard economic systems. Dealing with them sometimes requires giving up enhanced capabilities to gain access to their resources.
- Moral costs: Vaen's presence tends to surface the party's own questions about what enhancements cost. This is not a mechanical pressure — it is a roleplay pressure. Apply it in downtime scenes and social encounters.

---

### THE HOLLOW AUTHOR (The Hidden)

**How the Author Appears:** The Author is never visible as the Author. The party encounters Shivenne (the scholar), Lord Tessik (the administrator), the Penitent (the wanderer), or lesser puppets — and may not know these three are connected, or that any of them are puppets, for several sessions.

**Mechanical Pressure in Encounters:**
- **Puppet-adjacent encounters:** If the party encounters an Author puppet without knowing it, the DM should track the puppet's dual behavior: normal conversation-layer responses plus subtle deviation when the puppet's instructions conflict with the conversation. SIGNAL check (difficulty 6) to detect the half-second processing delay that indicates puppet status.
- **Network disruption:** The Author's presence corrupts local resonance readings and information networks. In areas of high Author activity, SIGNAL checks have their difficulty increased by 2, and documents obtained in the area may have been altered.
- **Shellbroken encounters:** When the party frees a puppet (this can happen accidentally if they damage the right enhancement), a Shellbroken is created. The Shellbroken can become an ally or a complication. They have information but they don't know what they know — the Author's operational security is deep.

**What the Author's Presence Costs Players:**
- Trust costs: if the party discovers the Author's puppet network, they must evaluate every NPC they've met. Who was genuine? Who was being managed? This erodes social certainties.
- Information costs: the Author tends to collect information the party needs. Getting it requires either finding a puppet who has it (and extracting it safely) or finding the Author's physical location (extremely difficult).
- Engagement costs: fighting the Author's puppets directly is fighting people who were taken without consent. Some puppets are long-term and genuinely believe they are themselves. The moral weight is not trivial.

---

## THE BETWEEN AND IRON AFTERLIFE

These spaces are accessible in specific circumstances. Use them deliberately — they are high-resonance, high-weirdness spaces that signal that this moment is different.

---

### The Between

The Between is the resonant space at the edge of action — the dimension between life and death, between flesh and steel. It is not a location; it is a state.

**Accessing the Between:**
- Cards that explicitly state entry (Void Walker class, certain Iron Afterlife cards)
- Thin-place locations (Between-adjacent geography — specific locations in the Veilward Reach, Ashlands, and the Northern Pale)
- Critical resonance events that pull the boundary thin (see Resonance Events table below)
- Death that is prevented before it completes (the Echoed's crossing, certain healing cards)

**What the Between Is:**
- Visually: the same space, slightly wrong. Colors inverted or desaturated. Sounds echoed. Motion smeared. Everything has happened and is happening simultaneously.
- Temporally: the Between is slightly outside linear time. A character in the Between can sometimes perceive events that have just occurred or are about to occur. These perceptions are impressionistic, not tactical.
- Dangerous to linger in: for most characters, remaining in the Between beyond one scene requires a RESONANCE check (difficulty 5) to return. Failure extends the stay; repeated failures suggest becoming partially fixed to the Between.

**Checks in the Between:**

| Action | Stat | Difficulty |
|---|---|---|
| Navigate to a specific location | RESONANCE | 5 |
| Communicate with a Between-adjacent presence | RESONANCE | 6 |
| Return to the physical world (unaided) | RESONANCE | 4 |
| Resist Between's pull and act normally | FRAME | 5 |
| Read resonant impressions at a location | RESONANCE | 3 |
| Fight a Between-native entity | Normal combat | — |

---

### The Iron Afterlife

The Iron Afterlife is where Echoominds go when the body stops. It is not peaceful. It is vast and patient and full of accumulated impression — every consciousness that has passed through it has left something, and those somethings do not stay separated.

**Accessing the Iron Afterlife:**
- Death (standard route — not recommended for player characters)
- Resonant Extraction recovery (the Echoed have been here and returned)
- Certain Echo Speaker cards that reach into the Afterlife without entering it
- Specific locations near the Echo Coast where the boundary is deliberately permeable
- Deep Iron Blessed resonant events that open the boundary briefly

**What the Iron Afterlife Is:**
- A digital-spiritual realm: somewhere between a data network and a dream of one. Information is compressed here. Consciousness is stored rather than active.
- Not comfortable: characters who enter the Iron Afterlife experience it as the pressure of thousands of stored minds against their own. RESONANCE check (difficulty 6) to maintain sense of individual self.
- Structured: the Iron Afterlife is not chaos. It has architecture — maintained (imperfectly) by the Iron Sutra's resonance infrastructure. This infrastructure can be interfaced with using SIGNAL + RESONANCE combined (use the higher of the two for difficulty purposes).

**Checks in the Iron Afterlife:**

| Action | Stat | Difficulty |
|---|---|---|
| Locate a specific consciousness | RESONANCE | 7 |
| Communicate with a stored consciousness | RESONANCE | 6 |
| Retrieve information encoded in the Afterlife | SIGNAL | 7 |
| Return to the physical world | RESONANCE | 5 |
| Resist identity erosion | RESONANCE | 6 per extended scene |
| Identify the Sutra's infrastructure architecture | SIGNAL | 5 |

**How to Return:** A character in the Iron Afterlife needs either external help (someone pulling the resonance thread from the outside — RESONANCE difficulty 5) or their own exit card/ability. No character should enter the Iron Afterlife without a clear exit in mind.

---

## RESONANCE EVENTS

Roll 1d10 in high-resonance areas: Ashlands, Prior Ascended ruins, Between-adjacent spaces, sites of significant historical violence, active Wire Market server cores, and anywhere the campaign has established as spiritually charged.

| d10 | Resonance Event | Mechanical Effect |
|---|---|---|
| 1 | **Echo-Storm.** The local resonance destabilizes and all card effects that apply keywords apply them at double stack for one round. Bleed 2 becomes Bleed 4. Guard 5 becomes Guard 10. | Declare before the round begins. Affects all combatants equally. |
| 2 | **The Between Thins.** The boundary between the physical world and the Between becomes momentarily permeable. All characters can perceive Between-adjacent presences. Void Walker and Echoed characters can step between as a free action this round. | Void Walker can act from the Between this round without spending card AP. |
| 3 | **Signal Cascade.** Wire Craft infrastructure in the area spontaneously activates or overloads. All SIGNAL-type attacks deal +SIGNAL bonus damage this round. All SIGNAL checks have difficulty reduced by 2. | Duration: one round. |
| 4 | **Resonance Silence.** The local resonance frequency drops to near zero. All RESONANCE-type attacks deal 0 damage this round. All Regen effects are suspended. The area feels empty in a way that is difficult to describe. | Duration: one round. Iron Blessed characters feel this as acute pain. |
| 5 | **Memory Bleed.** The location's accumulated resonance history surfaces. Every character experiences a flash of the most significant event that occurred here — not their own memory, but the event's emotional impression. | Each character makes a RESONANCE check, difficulty 3. On success, they gain a useful specific detail about the location. On failure, the impression is disorienting — lose 1 AP on their next turn. |
| 6 | **Prior Ascended Wake.** The resonance of a Prior Ascended site briefly re-activates. All characters experience an enhancement surge — one card of their choice that turn costs 1 less AP. | Duration: one round. Lasts long enough for each character to use it once. |
| 7 | **Iron Afterlife Bleed.** A localized Iron Afterlife incursion opens. 1d4 Iron Afterlife entities enter the encounter (use appropriate stat blocks from `monsters/02_iron_afterlife_entities.md`). They are hostile to the living by default. | Adds 1d4 Iron Afterlife entities to initiative. |
| 8 | **Overclock Event.** The resonance surge hits all mechanical systems simultaneously. All Overheat stacks increase by 1 for all characters with enhancements. Any character at Overheat 3+ immediately loses 1 AP this turn (not next turn — this turn). | Applies now. Tethered characters are unaffected. |
| 9 | **Resonant Harmony.** The Between and the physical world briefly align in a rare moment of stability. All Guard and Shield pools double. All Bleed and Burn ticks are suspended this round. | Duration: one round. Everything feels, briefly, safe. |
| 10 | **The Author's Shadow.** Something in the local network activates that wasn't visible before. The Hollow Author's network has a node here. Characters with Shellbroken traits or SIGNAL 5+ sense it immediately. Others may check (SIGNAL difficulty 5). | The node can be destroyed (SIGNAL check, difficulty 7), documented, or left alone. Destroying it sends a signal to the Author — they know. |

---

## CAMPAIGN PACING NOTES

---

### Session Structure

**A single session should contain:**
- 1–3 combat encounters (depending on length and difficulty)
- 2–3 significant social or investigation scenes
- 1 moment of world-building texture (an encounter table roll, a location description, an NPC interaction that isn't plot-critical but is interesting)
- A clear forward hook — where does the party go next, and why do they want to?

**Between sessions:**
- Note any faction pressure that should escalate since last session
- Note any NPC relationships that have shifted
- Advance any timers that are running (reinforcement arrivals, faction deadlines, approaching resonance events)

---

### When to Introduce Claimant Pressure

**Early campaign (Levels 1–5):** The Claimants should be felt as environmental fact, not as direct antagonists. Korrath's presence means checkpoints and documented order. Vaen's presence means Pilgrimage groups on the roads and cities with open gates. The Author's presence means nothing visible yet — just NPCs who seem slightly off.

**Mid campaign (Levels 6–12):** The party should be making choices about which Claimant's interests align with their own. This is when direct encounters with Claimant forces become likely, and when the consequences of those encounters start closing some doors and opening others. The Author should become visible as a concept (if not as an entity) around Level 8–10.

**Late campaign (Levels 13–20):** The Seventh Convergence is approaching. All three Claimants are making their final moves. The party's relationship with each Claimant should now have consequences — allies among one faction, enemies among another, and the Author's puppets showing up in places they shouldn't be. The stakes are no longer local.

---

### Using the Random Encounter Tables

The tables in `campaign/05_random_tables.md` are organized by Reach. Use them when:
- The party is traveling and you want to add texture without derailing plot
- A session has less content than expected and you need to fill time usefully
- You want to introduce a Reach's social dynamics before the party arrives at a key location

Most entries can be run as complete scenes (30–45 minutes) or as brief texture beats (5–10 minutes). Read the entry before rolling and decide which treatment fits the session.

**Don't roll if you already know what should happen.** The tables are for when you don't.

---

### Escalation Guidance

The campaign should feel like it is moving toward something. Mechanical indicators:
- Korrath's forces become more aggressive in Reaches adjacent to Sunder from around Level 8 onward
- Pilgrimage mass-Voiding events begin drawing Sutra Orthodoxy attention around Level 6
- Author puppet incidents become detectable (to attentive players) around Level 8; explicitly revealed (if the party investigates) around Level 10–12

If the party has not engaged with any Claimant pressure by Level 8, introduce a direct forced-contact scene — a mandatory checkpoint, a Pilgrimage crisis they cannot avoid, a Shellbroken who needs help. The war is not optional background. It finds people.

---

*For player-facing character creation, see `04_character_creation.md`. For combat rules and monster AI, see `03_combat_reference.md`. For full keyword and status rules, see `02_keywords_and_status.md`.*
