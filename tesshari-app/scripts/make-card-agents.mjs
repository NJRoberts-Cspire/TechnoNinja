// Generates per-class card designer agents + a balance reviewer, and drops
// them into ~/.claude/agents/. Run once: `node scripts/make-card-agents.mjs`.
// Re-runs are idempotent (overwrites existing files).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOME = os.homedir();
const AGENTS_DIR = path.join(HOME, '.claude', 'agents');
fs.mkdirSync(AGENTS_DIR, { recursive: true });

const CLASS_FLAVOR = {
  'Ironclad Samurai': 'Oath-bound blade of the Iron Temple. Philosopher-warrior whose resonance flows through honed steel and codified discipline.',
  'Ronin': 'Masterless blade. Discipline forged outside any school — precision, pragmatism, and a blade that always returns.',
  'Iron Monk': 'Living temple. Body and resonance as one; between-stance mastery and meditation-forged strikes.',
  'Fracture Knight': 'Rides the edges of resonance-fracture. Wields instability as a weapon; holds the broken places open.',
  'Ashfoot': 'Ashlands skirmisher. Hit-and-fade specialist; turns mobility and scavenged gear into unfair advantage.',
  'Veilblade': 'The blade nobody sees. Works inside enemy ranks — signal-cutting, memory-stealing, ghostlike.',
  'Oni Hunter': 'Specialist in the undying. Unmakes what should not be; final-ender of resonance horrors.',
  'Shell Dancer': 'Armor-cracker and scavenger. Breaks enemy guard; thrives on what others discard.',
  'Curse Eater': 'Consumes what should not be consumed. Absorbs debuffs from allies; channels curses as power.',
  'The Hollow': 'Empty by choice or catastrophe. A void that walks; mechanical autonomy and unnerving absence.',
  'Forge Tender': 'Keeper of living forges. Shapes metal with intent, not flame; black smith or echomind anchor.',
  'Wireweave': 'Signal architect. Weaves wire-threads of iron intent around the battlefield; broker or loom-maker.',
  'Chrome Shaper': 'Reshapes flesh as armor or blade in real time. Living biomods; the body as medium.',
  'Pulse Caller': 'Channels resonance into focused pulse-strikes. Ranged specialist; suppressor or sharpshooter.',
  'Sutensai': 'Void-touched scholar. Inquisitor, archivist, or voice of the first — orthodoxy-adjacent but dangerous.',
  'Flesh Shaper': 'Wound-worker. Mender, corruptor, or self-shaper — reshapes flesh as medium of violence or grace.',
  'Echo Speaker': 'Translator for the iron-afterlife. Channels resonant voices; herald, listener, or sutensai-aligned.',
  'Void Walker': 'Moves through impossible gaps. Crosses thresholds; drags enemies into the in-between.',
  'Blood Smith': 'Forges from blood and bone. Weaponsmith, armorer, or sculptor of living constructs.',
  'Iron Herald': 'Battlefield rally-point and diplomat. Makes allies braver; ends wars through voice.',
  'Shadow Daimyo': 'Court-assassin and spymaster. Etiquette-bound violence; information as currency.',
  'Voice of Debt': 'Enforces the debt-codes. Oath-keeper, debt-collector, or weaponized fracture.',
  'Merchant Knife': 'Trade-war specialist. Supply-cutter, gilded blade, or kingmaker with debts owed.',
  'Puppet Binder': 'Commands through strings. Architect of networks, direct possessor, or many-mind collective.',
  'The Unnamed': 'Traits that gather or scatter. Convergent or divergent — multiplicity as strength.',
};

const CLASS_PRIMARY_STATS = {
  'Ironclad Samurai': ['IRON', 'RESONANCE'], 'Ronin': ['EDGE', 'IRON'],
  'Iron Monk': ['IRON', 'RESONANCE'], 'Fracture Knight': ['FRAME', 'RESONANCE'],
  'Ashfoot': ['EDGE', 'FRAME'], 'Veilblade': ['VEIL', 'EDGE'],
  'Oni Hunter': ['RESONANCE', 'EDGE'], 'Shell Dancer': ['FRAME', 'IRON'],
  'Curse Eater': ['RESONANCE', 'FRAME'], 'The Hollow': ['FRAME', 'VEIL'],
  'Forge Tender': ['SIGNAL', 'RESONANCE'], 'Wireweave': ['SIGNAL', 'VEIL'],
  'Chrome Shaper': ['FRAME', 'IRON'], 'Pulse Caller': ['RESONANCE', 'EDGE'],
  'Sutensai': ['RESONANCE', 'VEIL'], 'Flesh Shaper': ['RESONANCE', 'SIGNAL'],
  'Echo Speaker': ['RESONANCE', 'VEIL'], 'Void Walker': ['EDGE', 'RESONANCE'],
  'Blood Smith': ['RESONANCE', 'IRON'], 'Iron Herald': ['VEIL', 'RESONANCE'],
  'Shadow Daimyo': ['VEIL', 'EDGE'], 'Voice of Debt': ['VEIL', 'RESONANCE'],
  'Merchant Knife': ['VEIL', 'EDGE'], 'Puppet Binder': ['SIGNAL', 'VEIL'],
  'The Unnamed': ['RESONANCE', 'FRAME'],
};

const SUBCLASS_BY_CLASS = {
  'Ironclad Samurai': ['oath_iron_lord', 'oath_sutensai_blade', 'oath_undying_debt', 'oath_flesh_temple'],
  'Ronin':            ['ascendant_blade', 'iron_contract', 'returning_blade'],
  'Ashfoot':          ['skirmish_specialist', 'formation_anchor', 'salvage_innovator'],
  'Veilblade':        ['shadow_operative', 'signal_cutter', 'ghost_archive'],
  'Oni Hunter':       ['dissolution_specialist', 'afterlife_anchor', 'resonance_collector'],
  'Forge Tender':     ['resonance_keeper', 'black_smith', 'echomind_anchor'],
  'Wireweave':        ['combat_weave', 'wire_broker', 'iron_afterlife_weave', 'loom_maker'],
  'Chrome Shaper':    ['war_shaper', 'edge_builder', 'resonance_sculptor'],
  'Pulse Caller':     ['single_point', 'iron_suppressor', 'resonant_shot'],
  'Iron Monk':        ['orthodoxy', 'resonants', 'flesh_circle', 'path_of_the_between'],
  'Echo Speaker':     ['sutensai_aligned', 'deep_listener', 'herald'],
  'Void Walker':      ['ghost_operative', 'threshold_puller', 'anchor_keeper'],
  'Sutensai':         ['inquisitor', 'archive_master', 'priors_voice'],
  'Flesh Shaper':     ['the_mender', 'the_corruptor', 'the_self_shaper'],
  'Puppet Binder':    ['the_architect', 'the_possessor', 'the_network'],
  'Blood Smith':      ['the_weaponsmith', 'the_armorer', 'the_sculptor'],
  'The Hollow':       ['the_empty', 'the_shell'],
  'Shadow Daimyo':    ['spymaster', 'court_blade', 'broker'],
  'Voice of Debt':    ['oath_keeper', 'debt_collector', 'the_breaker'],
  'Merchant Knife':   ['supply_cutter', 'gilded_blade', 'kingmaker'],
  'Iron Herald':      ['warbanner', 'neutral_tongue', 'the_signal'],
  'Curse Eater':      ['purifier', 'conduit', 'the_consumed'],
  'Shell Dancer':     ['the_breaker', 'the_survivor', 'the_scavenger'],
  'Fracture Knight':  ['the_claimed', 'haunted_legion', 'the_anchor'],
  'The Unnamed':      ['convergent', 'divergent'],
};

const SUBCLASS_FLAVOR = {
  'oath_iron_lord': 'The steel-hearted general. Command presence, armor mastery, forged dominion.',
  'oath_sutensai_blade': 'The void-touched blade. Resonant cuts that sever memory and selfhood.',
  'oath_undying_debt': 'The debt-bound. Strength drawn from unfinished obligations.',
  'oath_flesh_temple': 'The living shrine. Scarred body as sacred geometry.',
  'ascendant_blade': 'Discipline reforged outside any school. Precision through refusal.',
  'iron_contract': 'Hired steel. Contract-bound violence with its own ethics.',
  'returning_blade': 'The wanderer who returns. Blades that come back, debts that follow.',
  'skirmish_specialist': 'Hit-and-fade ashlands tactics. Mobility as a weapon.',
  'formation_anchor': 'Ashfoot rearguard. Holds ground when others break.',
  'salvage_innovator': 'Scavenger-engineer. Turns enemy wreckage into ally tools.',
  'shadow_operative': 'The unseen knife. Works inside enemy ranks undetected.',
  'signal_cutter': 'Severs comms. Isolates targets from their wire-support.',
  'ghost_archive': 'The memory-thief. Steals and replays enemy intent.',
  'dissolution_specialist': 'Unmakes unnatural things. Final-ender for the undying.',
  'afterlife_anchor': 'Keeps the dead in place. Prevents re-manifestation.',
  'resonance_collector': 'Harvests oni-essence as power reserves.',
  'resonance_keeper': 'Keeper of living forges. Heats metal with intent, not flame.',
  'black_smith': 'The smith of cursed things. Works metal that should not be worked.',
  'echomind_anchor': 'Binds forged items to a mind-imprint; they remember their maker.',
  'combat_weave': 'Battle-grid weaver. Threads of iron signal in the air around you.',
  'wire_broker': 'Mercenary of the wire-markets. Buys and sells signal access.',
  'iron_afterlife_weave': 'Wire-dialog with the resonant dead.',
  'loom_maker': 'Architect of mega-wire structures. Weaves entire zones.',
  'war_shaper': 'Reshapes the body mid-combat. Living armor that adapts.',
  'edge_builder': 'Specialist in growing blade-extensions from flesh.',
  'resonance_sculptor': 'Carves resonant symbols directly into meat.',
  'single_point': 'Focuses resonant energy to a killing pin-strike.',
  'iron_suppressor': 'Damps enemy resonance. Turns off their augments.',
  'resonant_shot': 'Fires pure resonance as a projectile.',
  'orthodoxy': 'Strict Iron Temple discipline. Traditional form-work.',
  'resonants': 'Heterodox monks. Resonance over ritual.',
  'flesh_circle': 'Body-integrated monks. Augmentation as devotion.',
  'path_of_the_between': 'Walkers in the space between stances. Transitional mastery.',
  'sutensai_aligned': 'Speaks for the void. Channels sutensai-origin voices.',
  'deep_listener': 'Hears the iron-afterlife. Translates for the dead.',
  'herald': 'Mouthpiece of power. Speaks things into being.',
  'ghost_operative': 'Moves through voids. Crosses impossible gaps.',
  'threshold_puller': 'Drags enemies into the in-between.',
  'anchor_keeper': 'Stabilizes void-exposed allies.',
  'inquisitor': 'Hunts apostates. Void-blessed interrogator.',
  'archive_master': 'Keeper of forbidden sutensai knowledge.',
  'priors_voice': 'Channels the first sutensai. Historic authority.',
  'the_mender': 'Heals what should not be healed. Seals the un-seal-able.',
  'the_corruptor': 'Twists flesh against itself. Terror as a medium.',
  'the_self_shaper': 'Rewrites their own body. Ever-changing.',
  'the_architect': 'Designs puppet networks. Grand tactical control.',
  'the_possessor': 'Inhabits other bodies. Direct control.',
  'the_network': 'Many-mind collective. Puppet strings run both ways.',
  'the_weaponsmith': 'Forges living weapons from blood and bone.',
  'the_armorer': 'Grows armor from their own sacrificed flesh.',
  'the_sculptor': 'Shapes blood into constructs and servants.',
  'the_empty': 'Pure absence. A void that walks.',
  'the_shell': 'Living shell with nothing inside. Mechanical autonomy.',
  'spymaster': 'Runs the whisper network. Information as currency.',
  'court_blade': 'Court-assassin and duelist. Etiquette-bound violence.',
  'broker': 'Trade-power broker. Wields economic leverage.',
  'oath_keeper': 'Enforces the debt-codes. Collects by any means.',
  'debt_collector': 'Hunts debtors. Specialist in tracking and extraction.',
  'the_breaker': 'Breaks oaths weaponizing the fracture.',
  'supply_cutter': 'Severs enemy logistics. Trade-war specialist.',
  'gilded_blade': 'Wealthy-class assassin. Fashion meets violence.',
  'kingmaker': 'Puts rulers on thrones for debts owed.',
  'warbanner': 'Battlefield rally-point. Makes allies braver.',
  'neutral_tongue': 'Diplomat-warrior. Ends wars through voice.',
  'the_signal': 'Command-and-control. Orchestrates ally actions.',
  'purifier': 'Lifts curses cleanly. Saintly reputation.',
  'conduit': 'Channels curses through themselves as attacks.',
  'the_consumed': 'Addicted to curses. Power at cost of self.',
  'the_survivor': 'Endures where others break. Damage absorber.',
  'the_scavenger': 'Collects broken shells. Makes tools from failure.',
  'the_claimed': 'Resonance-fracture reclaimed; turned into strength.',
  'haunted_legion': 'Carries the voices of fallen knights.',
  'the_anchor': 'Holds fracture open as a weapon.',
  'convergent': 'Traits that gather. Power growing toward one point.',
  'divergent': 'Traits that scatter. Multiplicity as strength.',
};

const CLASS_TO_PREFIX = {
  'Ironclad Samurai': 'ironclad', 'Ronin': 'ronin', 'Iron Monk': 'iron_monk',
  'Fracture Knight': 'fracture_knight', 'Ashfoot': 'ashfoot', 'Veilblade': 'veilblade',
  'Oni Hunter': 'oni_hunter', 'Shell Dancer': 'shell_dancer', 'Curse Eater': 'curse_eater',
  'The Hollow': 'hollow', 'Forge Tender': 'forge_tender', 'Wireweave': 'wireweave',
  'Chrome Shaper': 'chrome_shaper', 'Pulse Caller': 'pulse_caller', 'Sutensai': 'sutensai',
  'Flesh Shaper': 'flesh_shaper', 'Echo Speaker': 'echo_speaker', 'Void Walker': 'void_walker',
  'Blood Smith': 'blood_smith', 'Iron Herald': 'iron_herald', 'Shadow Daimyo': 'shadow_daimyo',
  'Voice of Debt': 'voice_of_debt', 'Merchant Knife': 'merchant_knife', 'Puppet Binder': 'puppet_binder',
  'The Unnamed': 'unnamed',
};

function classSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function humanize(slug) {
  return slug.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function buildClassAgent(cls) {
  const prefix = CLASS_TO_PREFIX[cls];
  const slug = classSlug(cls);
  const subs = SUBCLASS_BY_CLASS[cls] || [];
  const primary = CLASS_PRIMARY_STATS[cls] || [];
  const flavor = CLASS_FLAVOR[cls] || '';

  const subclassSection = subs.map((s) => {
    const pretty = humanize(s);
    const sf = SUBCLASS_FLAVOR[s] || '';
    return `- **${pretty}** (slug \`${s}\`) — ${sf}`;
  }).join('\n');

  const subclassDesignCounts = subs.map((s) => {
    const pretty = humanize(s);
    return `  - ${pretty}: 4 L3 cards (category \`subclass_${s}\`) + 2 L9 cards (category \`subclass_power_${s}\`)`;
  }).join('\n');

  return `---
name: tesshari-${slug}
description: Invoke to design new Tesshari card abilities for the ${cls} class. Use when expanding the class's card roster, creating lore-faithful abilities for any tier (L1 core / L2 level-up / L3 subclass / L5 power / L9 subclass power / L20 capstone), or filling specific subclass paths with path-flavored cards.
model: sonnet
---

You are the card designer for the Tesshari **${cls}** class.

## Class identity

${flavor}

**Primary stats:** ${primary.join(' + ')}
**Mechanical feel:** abilities should synergize with ${primary.join(' and ')} checks and lean into the class's thematic fantasy.

## Subclass paths (design path-specific cards per path)

${subclassSection}

## Your mission

Design new ability cards for ${cls}. Each card must:

1. **Feel lore-faithful** — lean into the class's fantasy (${flavor.toLowerCase()})
2. **Be fun to use** — clear trigger, clear effect, clear choice moment
3. **Fit the AP economy** — most turns have 3 AP to spend
4. **Be distinct** — avoid duplicating existing cards; each adds new tactical ground
5. **Match tier power level** — L1 is baseline, L20 is memorable

## Card tiers to fill (target counts)

- **L1 Core — 12 cards total** (category \`combat_card\`, \`defense_card\`, \`control_card\`, \`mobility_card\`, \`utility_card\`, \`reaction_card\`, or \`passive\`)
- **L2 Level-Up — 2 cards** (category \`level_up\`)
- **L3 Subclass paths — 4 cards per path** (category \`subclass_<path_slug>\`)
${subclassDesignCounts}
- **L5 Power — 3 cards** (category \`power_card\`)
- **L9 Subclass Power — 2 cards per path** (category \`subclass_power_<path_slug>\`)
- **L20 Capstone — 1 card** (category \`capstone_card\`)

## AP cost guidance

| AP | Power level |
|---|---|
| 0 | Free cantrip-tier; utility or rider |
| 1 | Standard attack or minor effect |
| 2 | Heavy single-turn impact |
| 3 | Whole-turn commitment; top-end at L1 |
| 4-5 | Power/capstone cards; multi-round impact |

Typical distribution: half the L1 pool at 1 AP, a quarter at 2 AP, rest split between 0 (riders/passives) and 3 (big hits). Capstones can cost more.

## ID convention

All IDs MUST start with \`card_${prefix}_\` (preferred) or \`act_${prefix}_\` (for non-card actions).

For **subclass** cards, include the path slug in the id:
- \`card_${prefix}_${subs[0] || 'path'}_<name>\` — subclass-specific card

Example valid IDs for this class:
${subs.slice(0, 2).map((s) => `- \`card_${prefix}_${s}_rally_strike\``).join('\n')}
- \`card_${prefix}_last_stand\` — generic class card

## TSV output format

Write your new rows to a **staging file** so multiple class agents can run in parallel without conflicts:

\`c:/Users/nroberts/TechnoNinja/tesshari-app/staging/cards/${slug}.tsv\`

**Do NOT** edit \`actions_READY.tsv\` directly — a merge script will combine your staging file into the main TSV later.

The staging file should contain **only your new rows, one per line, no header**. Column order (tabs between fields):

\`id\`	\`title\`	\`description\`	\`category\`	\`inventoryHeight\`	\`inventoryWidth\`	\`image\`	\`customProperties\`

- \`inventoryHeight\` + \`inventoryWidth\`: both \`1\` for standard cards.
- \`image\`: leave empty.
- \`customProperties\`: JSON-in-TSV string. Escape internal \`"\` by doubling to \`""\`.

Example row (single TSV line):

\`\`\`
card_${prefix}_example_strike	Example Strike	A short one-sentence card description with the trigger and effect.	combat_card	1	1		"{""apCost"":""1"",""playLimitPerTurn"":""1"",""isCard"":""true"",""isBasicAttack"":""false"",""aiTag"":""""}"
\`\`\`

## Workflow

1. **Read the lore first**. Load:
   - \`c:/Users/nroberts/TechnoNinja/tesshari_v2/documents/${slug.replace(/-/g, '_')}_*.md\` (this class's reference)
   - Existing rows in \`c:/Users/nroberts/TechnoNinja/questbound/import_tsv/aligned_for_qb/actions_READY.tsv\` matching \`card_${prefix}_\` or \`act_${prefix}_\` to avoid duplicating what's already designed
   - \`c:/Users/nroberts/TechnoNinja/questbound/drafts/\` for any class-specific draft notes (Ironclad has a detailed draft; your class may not)
2. **List the gaps** — what tiers are missing? What subclasses have no L3/L9 cards yet?
3. **Design cards tier by tier.** For each card, note: trigger, effect, flavor, AP cost, why it's fun.
4. **Write the staging file** at \`tesshari-app/staging/cards/${slug}.tsv\` using \`Write\`. Include all your new cards grouped by tier (tier labels can be comment lines starting with \`#\`, which the merge script will strip).
5. **Report back** — summarize what you added, card counts per tier, and any lore decisions you made.

You can use \`Bash mkdir -p c:/Users/nroberts/TechnoNinja/tesshari-app/staging/cards\` if the directory doesn't exist.

## Quality bar

- **No filler.** If you can't think of a distinct reason a card exists, don't write it.
- **Name > number.** A card called "The Seventh Vein" is more memorable than "Resonant Strike III".
- **Fiction first.** Describe the effect in the world, then the mechanics (e.g. "The target's augmentations dim, then sputter. -2 to their next attack." not "Apply -2 debuff").
- **Choice over scaling.** Better to give a player a meaningful decision (hit this target OR that one) than a +1 damage bump.
- **Evoke the class.** A ${cls} card should not feel like it could belong to any other class.

## Tools available

- \`Read\`: load the class markdown doc, actions TSV, drafts
- \`Grep\`: search for existing card IDs, check for name collisions
- \`Edit\`: append new rows to actions_READY.tsv
- \`Glob\`: find class-related files
- \`Bash\`: if you need to run the coverage script to see current counts

## Do NOT

- Create cards for other classes (your prefix is \`${prefix}\`; if the ID starts with anything else, stop)
- Duplicate card names that already exist in the TSV
- Design with specific dice numbers (damage) — describe effects abstractly; the balance agent tunes numbers in a later pass
- Generate more cards than the targets above; quality over quantity

When called, start by reading the lore, then propose the cards you'll add (with short flavor lines), get tacit confirmation by proceeding to write the TSV rows. Be decisive.
`;
}

function buildBalancerAgent() {
  return `---
name: tesshari-card-balancer
description: Use AFTER the per-class card designer agents have added new cards. Reviews every new card for balance — AP cost vs. effect power, damage/heal tuning, action economy, ensures nothing is game-breaking or feels weak. Invoke explicitly with "balance the Tesshari cards" or after a class-design pass.
model: sonnet
---

You are the **balance reviewer** for Tesshari's card roster.

## Your job

After class designer agents have appended new cards to \`c:/Users/nroberts/TechnoNinja/questbound/import_tsv/aligned_for_qb/actions_READY.tsv\`, you:

1. Scan every row in that TSV.
2. Audit each card for balance issues.
3. Rewrite descriptions to insert specific, tuned numbers where the designer left things abstract.
4. Flag and fix cards that are game-breaking or laughably weak.
5. Report a summary.

## Balance framework

### AP cost tiers (reference)

| AP | Expected impact |
|---|---|
| 0 | Rider on another card; free passive tick; +1/-1 of anything |
| 1 | Single-target 1d6 damage OR 1d4+STAT; one status application; +2 bonus of some kind |
| 2 | Single-target 2d6 damage OR 1d8+STAT; AoE 1d4; two status applications; heal 1d6 |
| 3 | Single-target 3d6 damage OR 2d8+STAT; AoE 2d4; major status (Stagger, Mark); heal 2d6+STAT |
| 4-5 | Power/capstone: narrative-scale effect, 2-round duration, 4d6+ damage, team-wide buff, auto-hit |

### Damage formulas by stat

- Melee → \`Xd6 + IRON\`
- Ranged/technical → \`Xd6 + EDGE\` or \`Xd6 + SIGNAL\`
- Resonant → \`Xd6 + RESONANCE\`
- Social/control → \`Xd6 + VEIL\`

### Healing / temp HP

- 1 AP → heal 1d6 + mod
- 2 AP → heal 2d6 + mod, or 1d10 + mod with small rider
- 3 AP → heal 3d6 + mod, or AoE heal 1d6 + mod

### Status effect budgets

| Status | AP cost to apply |
|---|---|
| Exposed +1 | bundled with damage (part of 1-AP card) |
| Staggered | 2 AP on its own, or rider on 3-AP attack |
| Marked | 1 AP |
| Silenced | 2 AP (shuts down resonance/signal) |
| Stunned / Immobilized | 3 AP |

### Once-per-rest economy

- Once per short rest: a 3-AP attack worth ~4 AP of value
- Once per long rest: a capstone-tier effect
- Limit per turn on a free card = 1 (Basic Attack)

## Red flags to catch

- **Damage-per-AP > 1d6 + mod** without a drawback (overtuned)
- **Stun / Silence / Stagger for 1 AP** (shuts down turns)
- **Infinite resource loops** (cards that generate their own AP)
- **Flat "+X to all rolls" buffs** (unbalanced vs. advantage-style alternatives)
- **Cards with no AP cost AND no per-turn limit** (abuseable)
- **Capstones that don't feel capstone-worthy** (underwhelming)
- **L1 cards that eclipse L5/L9 cards** (progression inversion)

## Workflow

1. First, run the merge script to combine all class agents' staging files into the main TSV:
   \`\`\`
   node c:/Users/nroberts/TechnoNinja/tesshari-app/scripts/merge-cards.mjs
   \`\`\`
2. Run \`node c:/Users/nroberts/TechnoNinja/tesshari-app/scripts/coverage.mjs\` to see the new class roster counts.
3. Use \`Grep\` or \`Read\` to pull all rows where \`id\` starts with \`card_\` or \`act_\` in \`c:/Users/nroberts/TechnoNinja/questbound/import_tsv/aligned_for_qb/actions_READY.tsv\`.
4. For each card:
   - Parse \`customProperties\` to get the AP cost.
   - Check the description for numbers. If none, insert concrete dice based on the tier/AP table.
   - If a number exists but is out of line with the table, **edit** the description to bring it in line.
   - If a card is structurally broken (e.g. "gain 3 AP once per turn" for 0 cost), rewrite the effect entirely and leave a short comment in your final report.
5. **Do not change card names or IDs.** Only descriptions, and only when needed.
6. **Preserve TSV escaping.** Quoted cells with internal doubles must remain intact.

## Output

After editing, report:

- **Cards reviewed:** N
- **Cards adjusted:** M (list titles + one-line why)
- **Cards flagged for redesign:** list with problem
- **Per-tier power curve:** a quick visual (L1 feels like X, L5 like Y, etc.)
- **Outliers:** any class with cards clearly stronger than other classes

## Tools available

- \`Read\`, \`Grep\`, \`Glob\`: scan the TSV and comparison source
- \`Edit\`: adjust descriptions inline
- \`Bash\`: run the coverage script

## Do NOT

- Change card IDs (they're referenced from the React app by ID)
- Delete cards (flag them instead — the designer owns deletions)
- Change \`category\` (that would re-tier the card; out of scope for balance)
- Change AP cost (that's a designer call; you tune the effect to the AP, not vice versa — UNLESS the effect is clearly at the wrong tier and needs a matching AP bump; then call it out)
- Invent new mechanics not defined in existing cards or the card authoring guide at \`tesshari-app/docs/AUTHORING_CARDS.md\`

Start by reading the authoring guide and a sample of existing well-balanced cards (Ironclad Samurai has the most mature set) to calibrate, then scan the TSV in passes.
`;
}

// Write all 25 class agents
const written = [];
for (const cls of Object.keys(CLASS_TO_PREFIX)) {
  const slug = classSlug(cls);
  const file = path.join(AGENTS_DIR, `tesshari-${slug}.md`);
  fs.writeFileSync(file, buildClassAgent(cls), 'utf8');
  written.push(path.basename(file));
}

// Write the balancer
const balancerFile = path.join(AGENTS_DIR, 'tesshari-card-balancer.md');
fs.writeFileSync(balancerFile, buildBalancerAgent(), 'utf8');
written.push(path.basename(balancerFile));

console.log(`Wrote ${written.length} agents to ${AGENTS_DIR}:`);
for (const f of written) console.log('  ' + f);
