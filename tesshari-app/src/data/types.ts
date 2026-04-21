export type StatKey = 'IRON' | 'EDGE' | 'FRAME' | 'SIGNAL' | 'RESONANCE' | 'VEIL';

export interface Character {
  id: string;
  name: string;
  species: string;
  className: string;
  subclassPath: string;          // e.g. "Oath Iron Lord" (humanized)
  level: number;
  stats: Record<StatKey, number>; // 1..6
  pointsSpent: number;
  hp: { current: number; max: number };
  ap: { current: number; max: number };
  guard: number;
  shieldTempHp: number;
  /** Action IDs the player has chosen to unlock with their ability picks. */
  unlockedCards: string[];
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

/** Total ability picks a character has access to at a given level. */
export function picksAtLevel(level: number): number {
  // 3 starting picks + 1 per level gained (4 at L2, 5 at L3, ... 22 at L20).
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
export const STAT_BUDGET = 12; // points above the base 1+1+1+1+1+1 = 6. Max one stat to 6 + a few bumps.
export const STAT_MIN = 1;
export const STAT_MAX = 6;

export function defaultCharacter(): Character {
  const now = new Date().toISOString();
  return {
    id: (crypto.randomUUID?.() ?? String(Date.now())),
    name: 'New Character',
    species: 'Forged',
    className: 'Ironclad Samurai',
    subclassPath: '',
    level: 1,
    stats: { IRON: 1, EDGE: 1, FRAME: 1, SIGNAL: 1, RESONANCE: 1, VEIL: 1 },
    pointsSpent: 0,
    unlockedCards: [],
    hp: { current: 20, max: 20 },
    ap: { current: 3, max: 3 },
    guard: 0,
    shieldTempHp: 0,
    background: { reach: '', caste: '', faction: '', whoIOwe: '', whatINeed: '', heritage: '' },
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
}
