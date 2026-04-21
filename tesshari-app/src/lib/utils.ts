import type { Character, StatKey } from '@/data/types';
import { STAT_KEYS, STAT_BUDGET } from '@/data/types';

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function pointsSpent(stats: Record<StatKey, number>): number {
  return STAT_KEYS.reduce((sum, k) => sum + (stats[k] - 1), 0);
}

export function pointsRemaining(stats: Record<StatKey, number>): number {
  return STAT_BUDGET - pointsSpent(stats);
}

export function creationComplete(c: Character): boolean {
  return !!c.name && !!c.species && !!c.className && pointsRemaining(c.stats) === 0;
}

export function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
