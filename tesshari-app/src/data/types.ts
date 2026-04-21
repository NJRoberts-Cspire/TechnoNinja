export type StatKey = 'IRON' | 'EDGE' | 'FRAME' | 'SIGNAL' | 'RESONANCE' | 'VEIL';

/** Canonical Tesshari keywords. All names match system/02_keywords_and_status.md. */
export type StatusKey =
  | 'Guard' | 'Shield' | 'Fortify' | 'Regen' | 'Veil'
  | 'Bleed' | 'Burn' | 'Expose' | 'Vulnerable' | 'Overheat'
  | 'Stagger' | 'Root' | 'Silence' | 'Taunt' | 'Mark'
  | 'Down' | 'Dying';

export interface StatusEffect {
  /** Stable random id so React keys stay sane when stacks mutate. */
  id: string;
  name: StatusKey;
  /** Current stack count. For binary statuses, 1 means active. */
  stacks: number;
  /** Remaining turns. null = indefinite / until consumed. */
  remainingTurns: number | null;
}

export type LogKind =
  | 'play' | 'basic' | 'react'
  | 'turn-start' | 'turn-end' | 'round-end'
  | 'damage' | 'heal' | 'rest'
  | 'status-add' | 'status-remove' | 'note';

export interface LogEntry {
  id: string;
  at: string; // ISO timestamp
  turn: number;
  round: number;
  kind: LogKind;
  text: string;
}

export interface TurnState {
  turnNumber: number;
  roundNumber: number;
  /** Card IDs played this turn (each card is once-per-turn). */
  playedThisTurn: string[];
  /** Card IDs used during the current combat (once-per-combat gate). */
  usedThisCombat: string[];
  /** Basic Attack used this turn. */
  basicAttackUsed: boolean;
  /** Reaction used this round. */
  reactionUsed: boolean;
  /** Dying bookkeeping — mirrors the classic three-success / three-fail model. */
  deathSaves: { successes: number; failures: number };
}

export interface InventoryItem {
  id: string;
  name: string;
  kind: 'weapon' | 'armor' | 'consumable' | 'enhancement' | 'gear' | 'other';
  /** Freeform notes on what the item does to cards / the character. */
  effect: string;
  /** Quantity for stacking consumables. */
  qty: number;
  equipped: boolean;
}

export interface Character {
  id: string;
  /** Schema version — bumped when we change shape in breaking ways. */
  schema: 2;
  name: string;
  species: string;
  /** Bonus-any stat allocation for races (Forged, Echoed). Blank if n/a. */
  speciesBonusStat?: StatKey | '';
  className: string;
  subclassPath: string;
  level: number;
  /** Base stats 1..5 at creation (before race bonuses). In play scale 1..10. */
  stats: Record<StatKey, number>;
  pointsSpent: number;
  hp: { current: number; max: number };
  ap: { current: number; max: number };
  /** Legacy — now also represented as a Guard status effect. Kept for compatibility. */
  guard: number;
  /** Legacy — now also represented as a Shield status effect. Kept for compatibility. */
  shieldTempHp: number;
  /** Card IDs the player has chosen as their active hand. Capped at handSize. */
  unlockedCards: string[];
  /** Active status effects (buffs + debuffs). */
  statusEffects: StatusEffect[];
  /** Per-turn / per-round trackers. */
  turn: TurnState;
  /** Combat log (capped at ~200 entries). */
  combatLog: LogEntry[];
  /** Carried inventory — weapons, armor, consumables, enhancements, gear. */
  inventory: InventoryItem[];
  background: {
    reach: string;
    caste: string;
    faction: string;
    whoIOwe: string;
    whatINeed: string;
    heritage: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_META: Record<StatusKey, { type: 'buff' | 'debuff' | 'state'; stacking: boolean; summary: string }> = {
  Guard:      { type: 'buff',   stacking: true,  summary: 'Absorbs N damage; expires at next turn start unless persistent' },
  Shield:     { type: 'buff',   stacking: true,  summary: 'Absorbs N damage; persists until depleted' },
  Fortify:    { type: 'buff',   stacking: false, summary: '1 round — single-stack control fails, multi-stack halved' },
  Regen:      { type: 'buff',   stacking: true,  summary: 'Recover N HP at turn start' },
  Veil:       { type: 'buff',   stacking: false, summary: 'First hostile card targeting you loses riders (consumed)' },
  Bleed:      { type: 'debuff', stacking: true,  summary: 'N damage at your turn end; ignores Guard' },
  Burn:       { type: 'debuff', stacking: true,  summary: 'N damage at your turn end; strips Guard first' },
  Expose:     { type: 'debuff', stacking: true,  summary: '+N to incoming damage (additive, post-mitigation)' },
  Vulnerable: { type: 'debuff', stacking: true,  summary: 'Incoming damage ×(1 + 0.1·N)' },
  Overheat:   { type: 'debuff', stacking: true,  summary: '3+ stacks: −1 AP Max at turn start' },
  Stagger:    { type: 'debuff', stacking: false, summary: 'Cannot play Tier 2–3 cards this turn' },
  Root:       { type: 'debuff', stacking: false, summary: 'Cannot play Mobility cards this turn' },
  Silence:    { type: 'debuff', stacking: false, summary: 'Cannot play Signal or Resonance cards this turn' },
  Taunt:      { type: 'debuff', stacking: false, summary: 'Must target the taunter if able' },
  Mark:       { type: 'debuff', stacking: false, summary: 'Tagged for Mark-synergy effects' },
  Down:       { type: 'state',  stacking: false, summary: 'At 0 HP — unconscious' },
  Dying:      { type: 'state',  stacking: false, summary: 'Making death saves' },
};

export const STATUS_KEYS: StatusKey[] = [
  'Guard', 'Shield', 'Fortify', 'Regen', 'Veil',
  'Bleed', 'Burn', 'Expose', 'Vulnerable', 'Overheat',
  'Stagger', 'Root', 'Silence', 'Taunt', 'Mark',
];

/** Total ability picks a character has at a given level. */
export function picksAtLevel(level: number): number {
  // 3 starting picks at L1 + 1 per level gained.
  return Math.max(0, 3 + (level - 1));
}

export const STAT_KEYS: StatKey[] = ['IRON', 'EDGE', 'FRAME', 'SIGNAL', 'RESONANCE', 'VEIL'];
export const STAT_DESCRIPTIONS: Record<StatKey, string> = {
  IRON: 'Melee · force',
  EDGE: 'Initiative · precision',
  FRAME: 'HP · endurance',
  SIGNAL: 'Wire craft · hacking',
  RESONANCE: 'Spiritual · healing',
  VEIL: 'Social · concealment',
};

/** Rules-accurate budget. 20 points distributed, min 1, max 5 at creation. */
export const STAT_TOTAL_BUDGET = 20;
export const STAT_MIN = 1;
export const STAT_CREATION_MAX = 5;
/** In-play maximum (can be reached via race bonuses, enhancements). */
export const STAT_PLAY_MAX = 10;

/** Default stat (pre-race-bonus). */
export function defaultStats(): Record<StatKey, number> {
  // Baseline: every stat at 1 (6 total), 14 remaining to distribute to reach 20.
  return { IRON: 1, EDGE: 1, FRAME: 1, SIGNAL: 1, RESONANCE: 1, VEIL: 1 };
}

export function defaultTurnState(): TurnState {
  return {
    turnNumber: 1,
    roundNumber: 1,
    playedThisTurn: [],
    usedThisCombat: [],
    basicAttackUsed: false,
    reactionUsed: false,
    deathSaves: { successes: 0, failures: 0 },
  };
}

export function defaultCharacter(): Character {
  const now = new Date().toISOString();
  return {
    id: (crypto.randomUUID?.() ?? String(Date.now())),
    schema: 2,
    name: 'New Character',
    species: 'Forged',
    speciesBonusStat: '',
    className: 'Ironclad Samurai',
    subclassPath: '',
    level: 1,
    stats: defaultStats(),
    pointsSpent: 0,
    unlockedCards: [],
    statusEffects: [],
    turn: defaultTurnState(),
    combatLog: [],
    inventory: [],
    hp: { current: 22, max: 22 }, // placeholder; recomputed at creation
    ap: { current: 3, max: 3 },
    guard: 0,
    shieldTempHp: 0,
    background: { reach: '', caste: '', faction: '', whoIOwe: '', whatINeed: '', heritage: '' },
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
}

// ─── Deprecated aliases kept for any stale references ────────────────────
export const STAT_MAX = STAT_CREATION_MAX;
export const STAT_BUDGET = STAT_TOTAL_BUDGET - STAT_KEYS.length; // 14 points to distribute above base
