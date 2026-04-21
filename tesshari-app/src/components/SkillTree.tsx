import { useMemo } from 'react';
import {
  ACTIONS,
  ACTIONS_BY_CLASS,
  ACTIONS_BY_SUBCLASS,
  SUBCLASS_BY_CLASS,
} from '@/data/generated';
import type { Action } from '@/data/generated';
import { cn } from '@/lib/utils';
import { categoryColor } from '@/lib/colors';

interface Props {
  className: string;
  subclassPath?: string;      // humanized path name, e.g. "Oath Iron Lord"
  currentLevel?: number;      // optional: dims tiers above this level
  compact?: boolean;          // dense layout
  /** IDs the character has already spent picks on. When provided, cards
   *  outside this set render as "available" outlines. */
  pickedIds?: Set<string>;
  /** When provided alongside pickedIds, renders a pick button per card. */
  onTogglePick?: (id: string) => void;
  /** Disables the pick button on unpicked cards when no picks remain. */
  picksLeft?: number;
}

const TIERS = [
  { level: 1, label: 'Core · Level 1', color: 'border-slate-500', accent: 'text-slate-200' },
  { level: 2, label: 'Level 2', color: 'border-green-500', accent: 'text-green-300' },
  { level: 3, label: 'Subclass · Level 3', color: 'border-cyan-500', accent: 'text-cyan-300' },
  { level: 5, label: 'Power · Level 5', color: 'border-pink-500', accent: 'text-pink-300' },
  { level: 9, label: 'Subclass Power · Level 9', color: 'border-purple-500', accent: 'text-purple-300' },
  { level: 20, label: 'Capstone · Level 20', color: 'border-orange-500', accent: 'text-orange-300' },
];

export function SkillTree({ className, subclassPath, currentLevel, compact, pickedIds, onTogglePick, picksLeft }: Props) {
  const actions = useMemo(() => {
    const classIds = ACTIONS_BY_CLASS[className] || [];
    const subIds = subclassPath ? ACTIONS_BY_SUBCLASS[`${className} — ${subclassPath}`] || [] : [];
    const merged = new Set<string>([...classIds, ...subIds]);
    const rows = ACTIONS.filter((a) => merged.has(a.id));
    rows.sort((a, b) => a.level - b.level || a.title.localeCompare(b.title));
    return rows;
  }, [className, subclassPath]);

  if (actions.length === 0) {
    return (
      <div className="border border-dashed border-ink-600 rounded p-8 text-center text-slate-500 text-sm">
        No tracked abilities for {className}{subclassPath && <> — {subclassPath}</>} yet.
      </div>
    );
  }

  const tierRows = TIERS.map((t) => ({ ...t, rows: actions.filter((a) => a.level === t.level) })).filter((t) => t.rows.length > 0);

  return (
    <div className="space-y-4">
      {tierRows.map((tier) => (
        <TierBlock
          key={tier.level}
          tier={tier}
          currentLevel={currentLevel}
          compact={compact}
          pickedIds={pickedIds}
          onTogglePick={onTogglePick}
          picksLeft={picksLeft}
        />
      ))}
    </div>
  );
}

function TierBlock({
  tier,
  currentLevel,
  compact,
  pickedIds,
  onTogglePick,
  picksLeft,
}: {
  tier: { level: number; label: string; color: string; accent: string; rows: Action[] };
  currentLevel?: number;
  compact?: boolean;
  pickedIds?: Set<string>;
  onTogglePick?: (id: string) => void;
  picksLeft?: number;
}) {
  const tierUnlocked = currentLevel === undefined ? true : currentLevel >= tier.level;
  const pickedInTier = pickedIds ? tier.rows.filter((a) => pickedIds.has(a.id)).length : undefined;
  return (
    <div className={cn('relative pl-4 border-l-2', tier.color, !tierUnlocked && 'opacity-50')}>
      <div className="flex items-baseline justify-between mb-2">
        <div className={cn('font-display font-bold uppercase tracking-wider text-sm', tier.accent)}>
          {tier.label}
        </div>
        <div className="text-xs text-slate-500">
          {pickedInTier !== undefined
            ? `${pickedInTier}/${tier.rows.length} picked`
            : `${tier.rows.length} ${tier.rows.length === 1 ? 'ability' : 'abilities'}`}
          {currentLevel !== undefined && (tierUnlocked ? ' · tier unlocked' : ' · tier locked')}
        </div>
      </div>
      <div className={cn('grid gap-2', compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1')}>
        {tier.rows.map((a) => (
          <TreeCard
            key={a.id}
            a={a}
            compact={compact}
            picked={pickedIds?.has(a.id) ?? false}
            tierUnlocked={tierUnlocked}
            onTogglePick={onTogglePick}
            picksLeft={picksLeft}
            pickable={!!onTogglePick && !!pickedIds}
          />
        ))}
      </div>
    </div>
  );
}

function TreeCard({ a, compact, picked, tierUnlocked, onTogglePick, picksLeft, pickable }: {
  a: Action;
  compact?: boolean;
  picked: boolean;
  tierUnlocked: boolean;
  onTogglePick?: (id: string) => void;
  picksLeft?: number;
  pickable: boolean;
}) {
  const cannotPickMore = !picked && typeof picksLeft === 'number' && picksLeft <= 0;
  const clickable = pickable && tierUnlocked && (picked || !cannotPickMore);
  return (
    <div
      className={cn(
        'flex items-start gap-2 bg-ink-900 border rounded p-2 transition',
        picked ? 'border-accent-gold/60 bg-ink-800' : 'border-ink-700 hover:border-ink-500',
        !tierUnlocked && 'opacity-60',
      )}
    >
      <div className={cn('w-1 self-stretch rounded-full', categoryColor(a.colorKey))} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <div className="font-display font-bold text-accent-gold text-sm flex-1 min-w-0 truncate">{a.title}</div>
          {a.tier !== null && (
            <span className="text-[10px] font-display font-bold bg-ink-700 text-purple-200 px-1.5 py-0.5 rounded shrink-0" title={`Tier ${a.tier}`}>
              T{a.tier}
            </span>
          )}
          {a.apCost > 0 && (
            <span className="text-[10px] font-display font-bold bg-ink-700 text-accent-steel px-1.5 py-0.5 rounded shrink-0">
              {a.apCost} AP
            </span>
          )}
          {a.baseDamage !== null && (
            <span className="text-[10px] font-display font-bold bg-red-900/40 border border-red-700/40 text-red-200 px-1.5 py-0.5 rounded shrink-0">
              {a.baseDamage}{a.damageStat && `+${a.damageStat}`}
            </span>
          )}
          {a.isBasicAttack && (
            <span className="text-[10px] font-display bg-ink-700 text-slate-300 px-1.5 py-0.5 rounded shrink-0">Basic</span>
          )}
        </div>
        {!compact && a.description && (
          <div className="text-xs text-slate-400 mt-1 leading-snug">{a.description}</div>
        )}
        {!compact && a.keywords.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {a.keywords.map((k, i) => (
              <span key={`${k.name}-${i}`} className="text-[9px] font-display bg-ink-800 border border-ink-700 text-accent-gold px-1 py-0.5 rounded">
                {k.name}{k.value !== null ? ` ${k.value}` : ''}
              </span>
            ))}
          </div>
        )}
      </div>
      {pickable && (
        <button
          type="button"
          onClick={() => onTogglePick?.(a.id)}
          disabled={!clickable}
          className={cn(
            'shrink-0 px-2 py-1 text-[10px] font-display uppercase tracking-wider rounded transition',
            picked
              ? 'bg-accent-gold text-ink-900 hover:bg-yellow-300'
              : clickable
                ? 'bg-ink-700 text-slate-200 hover:bg-ink-600 border border-ink-600'
                : 'bg-ink-800 text-slate-600 cursor-not-allowed border border-ink-700',
          )}
        >
          {picked ? '✓' : !tierUnlocked ? `L${a.level}` : cannotPickMore ? '—' : 'Pick'}
        </button>
      )}
    </div>
  );
}

/**
 * Small count summary: "L1·12 · L3·3 · L5·1 · L20·2"
 * Useful for at-a-glance class info in the wizard.
 */
export function TierSummary({ className, subclassPath }: { className: string; subclassPath?: string }) {
  const counts = useMemo(() => {
    const classIds = ACTIONS_BY_CLASS[className] || [];
    const subIds = subclassPath ? ACTIONS_BY_SUBCLASS[`${className} — ${subclassPath}`] || [] : [];
    const merged = new Set<string>([...classIds, ...subIds]);
    const rows = ACTIONS.filter((a) => merged.has(a.id));
    const out: Record<number, number> = {};
    for (const a of rows) out[a.level] = (out[a.level] || 0) + 1;
    return out;
  }, [className, subclassPath]);

  const tiers = [1, 2, 3, 5, 9, 20].filter((l) => counts[l]);
  if (tiers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tiers.map((l) => (
        <span key={l} className="text-[10px] font-mono bg-ink-800 border border-ink-700 rounded px-1.5 py-0.5 text-slate-300">
          L{l}<span className="text-accent-gold ml-0.5">·{counts[l]}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Count of all abilities for a class (ignoring subclass overlap).
 */
export function classAbilityCount(className: string): number {
  return (ACTIONS_BY_CLASS[className] || []).length;
}

/**
 * Class subclass count.
 */
export function classSubclassCount(className: string): number {
  return (SUBCLASS_BY_CLASS[className] || []).length;
}
