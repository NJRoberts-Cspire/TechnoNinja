import type { Character, StatKey } from '@/data/types';
import { STAT_KEYS, STAT_TOTAL_BUDGET, STAT_MIN, STAT_PLAY_MAX, defaultTurnState } from '@/data/types';
import {
  ACTIONS_BY_CLASS,
  ACTIONS_BY_SUBCLASS,
  CLASS_HP_TIER,
  HP_TIER_BASE,
  CLASS_HAND_BASE,
  RACE_HAND_MOD,
  RACE_STAT_BONUSES,
  MAX_HAND_SIZE,
} from '@/data/generated';

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Sum of all stat values (each stat starts at 1). 20 = legal distribution. */
export function statTotal(stats: Record<StatKey, number>): number {
  return STAT_KEYS.reduce((sum, k) => sum + stats[k], 0);
}

export function pointsSpent(stats: Record<StatKey, number>): number {
  return statTotal(stats);
}

/** Points still available to spend at creation. Negative = over budget. */
export function pointsRemaining(stats: Record<StatKey, number>): number {
  return STAT_TOTAL_BUDGET - statTotal(stats);
}

export function creationComplete(c: Character): boolean {
  return !!c.name && !!c.species && !!c.className && pointsRemaining(c.stats) === 0;
}

export function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

/** Stat value including race bonuses (for in-play display and HP math). */
export function effectiveStat(c: Character, k: StatKey): number {
  const base = c.stats[k] ?? STAT_MIN;
  const bonuses = RACE_STAT_BONUSES[c.species] || [];
  let total = base;
  for (const b of bonuses) {
    if (b.stat === k || (b.stat === 'any' && c.speciesBonusStat === k)) {
      total += b.value;
    }
  }
  return Math.min(STAT_PLAY_MAX, total);
}

export function effectiveStats(c: Character): Record<StatKey, number> {
  return STAT_KEYS.reduce((acc, k) => {
    acc[k] = effectiveStat(c, k);
    return acc;
  }, {} as Record<StatKey, number>);
}

/**
 * Rules-accurate HP max: (FRAME × 8) + class tier base + FRAME × (level − 1).
 * Equivalent to (FRAME × 8 + class_base) at L1, +FRAME per level up.
 * The Unnamed has a unique formula — approximated as Balanced tier here.
 */
export function maxHpFor(className: string, level: number, frame: number): number {
  const tier = CLASS_HP_TIER[className] || 'Balanced';
  const base = HP_TIER_BASE[tier] ?? 10;
  if (tier === 'Unique') {
    // The Unnamed: (FRAME × 8) + (avg two highest stats × 4). Without stats passed,
    // fall back to a conservative Balanced equivalent. The sheet recomputes with
    // effective stats when available.
    return frame * 8 + 10 + Math.max(0, level - 1) * frame;
  }
  return frame * 8 + base + Math.max(0, level - 1) * frame;
}

/** Special Unnamed HP: needs full stat map. Used by the sheet when className is Unnamed. */
export function maxHpForUnnamed(level: number, stats: Record<StatKey, number>): number {
  const frame = stats.FRAME;
  const sorted = [...STAT_KEYS].map((k) => stats[k]).sort((a, b) => b - a);
  const avgTopTwo = Math.floor(((sorted[0] || 0) + (sorted[1] || 0)) / 2);
  return frame * 8 + avgTopTwo * 4 + Math.max(0, level - 1) * frame;
}

/** Hand size = class base + race modifier, capped at MAX_HAND_SIZE (12). */
export function handSizeFor(className: string, species: string): number {
  const base = CLASS_HAND_BASE[className] ?? 6;
  const mod = RACE_HAND_MOD[species] ?? 0;
  return Math.min(MAX_HAND_SIZE, base + mod);
}

/** IDs in the class + subclass combined pool. */
export function poolIdsFor(className: string, subclassPath: string): Set<string> {
  return new Set<string>([
    ...(ACTIONS_BY_CLASS[className] || []),
    ...(subclassPath ? ACTIONS_BY_SUBCLASS[`${className} — ${subclassPath}`] || [] : []),
  ]);
}

/**
 * Normalize structural changes: when class/subclass/level/FRAME changes,
 * rescale HP and drop stale picks. Always returns only the fields that changed.
 */
export function syncCharacter(prev: Character, patch: Partial<Character>): Partial<Character> {
  const next: Partial<Character> = { ...patch };
  const merged: Character = { ...prev, ...patch };

  const levelChanged = patch.level !== undefined && patch.level !== prev.level;
  const statsChanged = patch.stats !== undefined;
  const classChanged = patch.className !== undefined && patch.className !== prev.className;
  const speciesChanged = patch.species !== undefined && patch.species !== prev.species;
  const bonusChanged = patch.speciesBonusStat !== undefined && patch.speciesBonusStat !== prev.speciesBonusStat;
  const subclassChanged = patch.subclassPath !== undefined && patch.subclassPath !== prev.subclassPath;

  // Recompute HP when level, FRAME, class, species, or bonus-any stat changes.
  const frameChanged = statsChanged && (merged.stats.FRAME !== prev.stats.FRAME);
  if (levelChanged || frameChanged || classChanged || speciesChanged || bonusChanged) {
    const effFrame = effectiveStat(merged, 'FRAME');
    const newMax = merged.className === 'The Unnamed'
      ? maxHpForUnnamed(merged.level, effectiveStats(merged))
      : maxHpFor(merged.className, merged.level, effFrame);
    const delta = newMax - prev.hp.max;
    const nextCurrent = Math.max(
      0,
      Math.min(newMax, prev.hp.current + Math.max(0, delta)),
    );
    next.hp = { current: nextCurrent, max: newMax };
  }

  // Drop stale picks on class/subclass change.
  if (classChanged || subclassChanged) {
    const pool = poolIdsFor(merged.className, merged.subclassPath);
    next.unlockedCards = (prev.unlockedCards || []).filter((id) => pool.has(id));
  }

  // Enforce hand-size cap when class or species changes (new cap may be lower).
  if (classChanged || speciesChanged) {
    const cap = handSizeFor(merged.className, merged.species);
    const current = next.unlockedCards ?? prev.unlockedCards ?? [];
    if (current.length > cap) {
      next.unlockedCards = current.slice(0, cap);
    }
  }

  return next;
}

/**
 * Legacy-schema upgrader. Characters created with the old (1-6, 12-budget) model
 * are rebuilt into the new shape on load.
 */
export function migrateCharacter(raw: any): Character {
  if (raw?.schema === 2) return raw as Character;

  // Bring over what we can; re-derive anything structural.
  const now = new Date().toISOString();
  const species = raw?.species ?? 'Forged';
  const className = raw?.className ?? 'Ironclad Samurai';
  const oldStats = raw?.stats || { IRON: 1, EDGE: 1, FRAME: 1, SIGNAL: 1, RESONANCE: 1, VEIL: 1 };
  // Old 1-6 stats map directly into 1-5 creation range (clamp 5).
  const stats: Record<StatKey, number> = {
    IRON: Math.min(5, Math.max(1, oldStats.IRON ?? 1)),
    EDGE: Math.min(5, Math.max(1, oldStats.EDGE ?? 1)),
    FRAME: Math.min(5, Math.max(1, oldStats.FRAME ?? 1)),
    SIGNAL: Math.min(5, Math.max(1, oldStats.SIGNAL ?? 1)),
    RESONANCE: Math.min(5, Math.max(1, oldStats.RESONANCE ?? 1)),
    VEIL: Math.min(5, Math.max(1, oldStats.VEIL ?? 1)),
  };

  const tempChar: Character = {
    id: raw?.id ?? (crypto.randomUUID?.() ?? String(Date.now())),
    schema: 2,
    name: raw?.name ?? 'Migrated',
    species,
    speciesBonusStat: raw?.speciesBonusStat ?? '',
    className,
    subclassPath: raw?.subclassPath ?? '',
    level: Math.max(1, Math.min(20, raw?.level ?? 1)),
    stats,
    pointsSpent: 0,
    unlockedCards: Array.isArray(raw?.unlockedCards) ? raw.unlockedCards : [],
    statusEffects: Array.isArray(raw?.statusEffects) ? raw.statusEffects : [],
    turn: { ...defaultTurnState(), ...(raw?.turn ?? {}) },
    combatLog: Array.isArray(raw?.combatLog) ? raw.combatLog : [],
    inventory: Array.isArray(raw?.inventory) ? raw.inventory : [],
    hp: raw?.hp ?? { current: 0, max: 0 },
    ap: raw?.ap ?? { current: 3, max: 3 },
    guard: raw?.guard ?? 0,
    shieldTempHp: raw?.shieldTempHp ?? 0,
    background: raw?.background ?? {
      reach: '', caste: '', faction: '', whoIOwe: '', whatINeed: '', heritage: '',
    },
    notes: raw?.notes ?? '',
    createdAt: raw?.createdAt ?? now,
    updatedAt: now,
  };

  // Recompute HP max from new formula.
  const effFrame = effectiveStat(tempChar, 'FRAME');
  const newMax = className === 'The Unnamed'
    ? maxHpForUnnamed(tempChar.level, effectiveStats(tempChar))
    : maxHpFor(className, tempChar.level, effFrame);
  tempChar.hp = { max: newMax, current: Math.min(newMax, tempChar.hp.current || newMax) };

  // Enforce hand-size cap.
  const cap = handSizeFor(className, species);
  if (tempChar.unlockedCards.length > cap) {
    tempChar.unlockedCards = tempChar.unlockedCards.slice(0, cap);
  }

  tempChar.pointsSpent = statTotal(stats);
  return tempChar;
}

// ─── Combat helpers ────────────────────────────────────────────────────

import type { StatusKey, StatusEffect, LogEntry, LogKind } from '@/data/types';

const MAX_LOG = 200;

export function logEntry(c: Character, kind: LogKind, text: string): LogEntry {
  return {
    id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())),
    at: new Date().toISOString(),
    turn: c.turn.turnNumber,
    round: c.turn.roundNumber,
    kind,
    text,
  };
}

export function appendLog(c: Character, kind: LogKind, text: string): LogEntry[] {
  const next = [...c.combatLog, logEntry(c, kind, text)];
  return next.length > MAX_LOG ? next.slice(next.length - MAX_LOG) : next;
}

export function statusTotal(effects: StatusEffect[], name: StatusKey): number {
  return effects.filter((s) => s.name === name).reduce((n, s) => n + s.stacks, 0);
}

export function hasStatus(effects: StatusEffect[], name: StatusKey): boolean {
  return effects.some((s) => s.name === name && s.stacks > 0);
}

/** Add or merge a status. Stacking statuses accumulate; non-stacking refresh stacks+duration. */
export function addStatus(
  effects: StatusEffect[],
  name: StatusKey,
  stacks: number,
  remainingTurns: number | null = null,
  stacking = true,
): StatusEffect[] {
  if (!stacking) {
    const others = effects.filter((s) => s.name !== name);
    return [
      ...others,
      {
        id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())),
        name,
        stacks: Math.max(1, stacks),
        remainingTurns,
      },
    ];
  }
  const existing = effects.find((s) => s.name === name);
  if (existing) {
    return effects.map((s) =>
      s.name === name
        ? { ...s, stacks: s.stacks + stacks, remainingTurns: remainingTurns ?? s.remainingTurns }
        : s,
    );
  }
  return [
    ...effects,
    {
      id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())),
      name,
      stacks,
      remainingTurns,
    },
  ];
}

export function removeStatus(effects: StatusEffect[], id: string): StatusEffect[] {
  return effects.filter((s) => s.id !== id);
}

export function modifyStatusStacks(effects: StatusEffect[], id: string, delta: number): StatusEffect[] {
  return effects
    .map((s) => (s.id === id ? { ...s, stacks: s.stacks + delta } : s))
    .filter((s) => s.stacks > 0);
}

/** AP Max after Overheat: Overheat 3+ → −1 AP Max; 6+ → −2. */
export function apMaxFor(c: Character): number {
  const overheat = statusTotal(c.statusEffects, 'Overheat');
  const penalty = overheat >= 6 ? 2 : overheat >= 3 ? 1 : 0;
  return Math.max(0, c.ap.max - penalty);
}

/** Pure damage pipeline. Returns {final, remainingGuard, remainingShield, steps}. */
export function resolveDamage(
  c: Character,
  raw: number,
  pierce: number = 0,
): {
  final: number;
  guardAfter: number;
  shieldAfter: number;
  steps: string[];
} {
  const steps: string[] = [];
  let dmg = Math.max(0, raw);
  steps.push(`Incoming ${dmg}`);

  let guard = statusTotal(c.statusEffects, 'Guard');
  let shield = statusTotal(c.statusEffects, 'Shield');

  // Step 4: Pierce reduces effective Guard/Shield first.
  let piercePool = Math.max(0, pierce);
  if (piercePool > 0) {
    const guardPierced = Math.min(guard, piercePool);
    guard -= guardPierced;
    piercePool -= guardPierced;
    if (guardPierced) steps.push(`Pierce ${guardPierced} → Guard`);
  }
  if (piercePool > 0) {
    const shieldPierced = Math.min(shield, piercePool);
    shield -= shieldPierced;
    piercePool -= shieldPierced;
    if (shieldPierced) steps.push(`Pierce ${shieldPierced} → Shield`);
  }

  // Apply Guard then Shield.
  const absorbedByGuard = Math.min(guard, dmg);
  guard -= absorbedByGuard;
  dmg -= absorbedByGuard;
  if (absorbedByGuard) steps.push(`Guard absorbs ${absorbedByGuard} (${guard} left)`);

  const absorbedByShield = Math.min(shield, dmg);
  shield -= absorbedByShield;
  dmg -= absorbedByShield;
  if (absorbedByShield) steps.push(`Shield absorbs ${absorbedByShield} (${shield} left)`);

  // Step 5: Vulnerable multiplier, then Expose additive.
  const vulnerable = statusTotal(c.statusEffects, 'Vulnerable');
  if (vulnerable > 0) {
    const mult = 1 + 0.1 * vulnerable;
    const before = dmg;
    dmg = Math.round(dmg * mult);
    if (dmg !== before) steps.push(`Vulnerable ${vulnerable} → ${before}→${dmg}`);
  }
  const expose = statusTotal(c.statusEffects, 'Expose');
  if (expose > 0) {
    dmg += expose;
    steps.push(`Expose +${expose}`);
  }

  // Step 6: clamp.
  dmg = Math.max(0, dmg);
  steps.push(`Final: ${dmg}`);

  return { final: dmg, guardAfter: guard, shieldAfter: shield, steps };
}

/** Rebuild Guard/Shield status effects from new pool totals after resolve. */
export function applyGuardShieldTotals(
  effects: StatusEffect[],
  newGuard: number,
  newShield: number,
): StatusEffect[] {
  const nonGS = effects.filter((s) => s.name !== 'Guard' && s.name !== 'Shield');
  const out = [...nonGS];
  if (newGuard > 0) {
    out.push({
      id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())),
      name: 'Guard',
      stacks: newGuard,
      remainingTurns: 1,
    });
  }
  if (newShield > 0) {
    out.push({
      id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())),
      name: 'Shield',
      stacks: newShield,
      remainingTurns: null,
    });
  }
  return out;
}

/** End-of-turn processing: Bleed, Burn (strip Guard first), decrement durations. */
export function endOfTurnTicks(c: Character): {
  hpDelta: number;
  effects: StatusEffect[];
  lines: string[];
} {
  const lines: string[] = [];
  let effects = [...c.statusEffects];
  let hpDelta = 0;

  // Bleed ticks first — ignores Guard.
  const bleed = statusTotal(effects, 'Bleed');
  if (bleed > 0) {
    hpDelta -= bleed;
    lines.push(`Bleed ticks: −${bleed} HP`);
  }

  // Burn ticks — strips Guard before HP.
  const burn = statusTotal(effects, 'Burn');
  if (burn > 0) {
    let burnLeft = burn;
    let guard = statusTotal(effects, 'Guard');
    const stripped = Math.min(guard, burnLeft);
    guard -= stripped;
    burnLeft -= stripped;
    if (stripped > 0) {
      effects = applyGuardShieldTotals(effects, guard, statusTotal(effects, 'Shield'));
      lines.push(`Burn strips Guard ×${stripped}`);
    }
    if (burnLeft > 0) {
      hpDelta -= burnLeft;
      lines.push(`Burn ticks: −${burnLeft} HP`);
    }
  }

  // Decrement durations, drop expired.
  effects = effects
    .map((s) => {
      if (s.remainingTurns === null) return s;
      return { ...s, remainingTurns: s.remainingTurns - 1 };
    })
    .filter((s) => s.remainingTurns === null || s.remainingTurns > 0);

  // Guard specifically expires at turn end unless remainingTurns is null (persistent).
  // Our Guard statuses have remainingTurns=1 by default, so they'd tick to 0 above.

  return { hpDelta, effects, lines };
}

/** Turn-start processing: Regen, Overheat penalty already captured in apMaxFor. */
export function startOfTurnTicks(c: Character): { hpDelta: number; lines: string[] } {
  const lines: string[] = [];
  const regen = statusTotal(c.statusEffects, 'Regen');
  if (regen > 0) {
    lines.push(`Regen: +${regen} HP`);
    return { hpDelta: regen, lines };
  }
  return { hpDelta: 0, lines };
}
