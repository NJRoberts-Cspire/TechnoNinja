import { useMemo, useState } from 'react';
import type { Character, StatKey } from '@/data/types';
import { STAT_KEYS, STAT_DESCRIPTIONS, STAT_MIN, STAT_MAX, picksAtLevel } from '@/data/types';
import type { Action } from '@/data/generated';
import { ACTIONS, ACTIONS_BY_CLASS, ACTIONS_BY_SUBCLASS, SUBCLASS_BY_CLASS, SPECIES, CLASSES } from '@/data/generated';
import { SkillTree } from '@/components/SkillTree';
import { cn } from '@/lib/utils';

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
  onOpenReference: (className: string) => void;
}

type Tab = 'sheet' | 'cards' | 'inventory' | 'notes';

export function CharacterSheet({ character: c, onChange, onOpenReference }: Props) {
  const [tab, setTab] = useState<Tab>('sheet');

  return (
    <div>
      <Header c={c} onChange={onChange} onOpenReference={onOpenReference} />

      <div className="flex gap-2 mt-4 mb-4 border-b border-ink-700">
        {(['sheet', 'cards', 'inventory', 'notes'] as Tab[]).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm font-display transition -mb-px border-b-2',
              tab === t
                ? 'text-accent-gold border-accent-gold'
                : 'text-slate-400 border-transparent hover:text-slate-200',
            )}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'sheet' && <SheetTab c={c} onChange={onChange} />}
      {tab === 'cards' && <CardsTab c={c} onChange={onChange} />}
      {tab === 'inventory' && <InventoryTab />}
      {tab === 'notes' && <NotesTab c={c} onChange={onChange} />}
    </div>
  );
}

function Header({ c, onChange, onOpenReference }: {
  c: Character;
  onChange: (p: Partial<Character>) => void;
  onOpenReference: (className: string) => void;
}) {
  const picksLeft = picksAtLevel(c.level) - (c.unlockedCards?.length || 0);
  return (
    <div className="bg-ink-900 border border-ink-700 rounded-lg p-4">
      {picksLeft > 0 && (
        <div className="mb-3 -mt-1 flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/30 rounded px-3 py-2 text-sm">
          <span className="font-display font-bold text-accent-gold">{picksLeft}</span>
          <span className="text-slate-200">
            ability {picksLeft === 1 ? 'pick' : 'picks'} waiting — head to the CARDS tab to spend {picksLeft === 1 ? 'it' : 'them'}.
          </span>
        </div>
      )}
      <div className="grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-end">
        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400">Name</label>
          <input
            value={c.name}
            onChange={(e) => onChange({ name: e.target.value })}
            aria-label="Character name"
            placeholder="Character name"
            className="w-full bg-transparent border-b border-ink-600 focus:border-accent-gold outline-none font-display text-2xl text-accent-gold pt-1"
          />
        </div>
        <LabeledSelect
          label="Species"
          value={c.species}
          options={SPECIES as readonly string[]}
          onChange={(v) => onChange({ species: v })}
        />
        <LabeledSelect
          label="Class"
          value={c.className}
          options={CLASSES as readonly string[]}
          onChange={(v) => onChange({ className: v, subclassPath: '' })}
        />
        <LabeledSelect
          label="Subclass"
          value={c.subclassPath}
          options={['', ...(SUBCLASS_BY_CLASS[c.className] || [])]}
          onChange={(v) => onChange({ subclassPath: v })}
        />
        <LabeledNumber
          label="Level"
          value={c.level}
          min={1} max={20}
          onChange={(v) => onChange({ level: v })}
        />
      </div>
      <div className="mt-3 flex justify-between items-center text-xs text-slate-500">
        <div>
          Pick abilities on the CARDS tab. Each level grants another pick.
        </div>
        <button
          type="button"
          onClick={() => onOpenReference(c.className)}
          className="text-accent-gold hover:text-yellow-200"
        >
          Open {c.className} reference →
        </button>
      </div>
    </div>
  );
}

function SheetTab({ c, onChange }: { c: Character; onChange: (p: Partial<Character>) => void }) {
  const setStat = (k: StatKey, v: number) => onChange({ stats: { ...c.stats, [k]: Math.max(STAT_MIN, Math.min(STAT_MAX, v)) } });
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Stats */}
      <Panel title="Stats">
        <div className="space-y-2">
          {STAT_KEYS.map((k) => (
            <div key={k} className="flex items-center gap-2">
              <div className="w-24">
                <div className="font-display font-bold">{k}</div>
                <div className="text-xs text-slate-500">{STAT_DESCRIPTIONS[k]}</div>
              </div>
              <button
                type="button"
                aria-label={`Decrease ${k}`}
                onClick={() => setStat(k, c.stats[k] - 1)}
                className="w-8 h-8 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30"
                disabled={c.stats[k] <= STAT_MIN}
              >−</button>
              <div className="w-10 text-center font-display text-2xl text-accent-gold font-bold">{c.stats[k]}</div>
              <button
                type="button"
                aria-label={`Increase ${k}`}
                onClick={() => setStat(k, c.stats[k] + 1)}
                className="w-8 h-8 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30"
                disabled={c.stats[k] >= STAT_MAX}
              >+</button>
            </div>
          ))}
        </div>
      </Panel>

      {/* Vitals */}
      <Panel title="Vitals">
        <VitalsRow
          label="HP"
          cur={c.hp.current} max={c.hp.max}
          onCur={(v) => onChange({ hp: { ...c.hp, current: v } })}
          onMax={(v) => onChange({ hp: { ...c.hp, max: v } })}
          color="text-accent-gold"
        />
        <VitalsRow
          label="AP"
          cur={c.ap.current} max={c.ap.max}
          onCur={(v) => onChange({ ap: { ...c.ap, current: v } })}
          onMax={(v) => onChange({ ap: { ...c.ap, max: v } })}
          color="text-accent-steel"
        />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <NumberBox label="Guard" value={c.guard} onChange={(v) => onChange({ guard: v })} />
          <NumberBox label="Shield (TempHP)" value={c.shieldTempHp} onChange={(v) => onChange({ shieldTempHp: v })} />
        </div>
        <button
          type="button"
          onClick={() => onChange({ hp: { ...c.hp, current: c.hp.max }, ap: { ...c.ap, current: c.ap.max } })}
          className="mt-3 w-full px-3 py-2 text-sm rounded bg-ink-700 hover:bg-ink-600"
        >
          Long rest (restore HP + AP)
        </button>
      </Panel>

      {/* Background */}
      <Panel title="Background">
        <Field label="Heritage" value={c.background.heritage} onChange={(v) => onChange({ background: { ...c.background, heritage: v } })} />
        <Field label="Reach" value={c.background.reach} onChange={(v) => onChange({ background: { ...c.background, reach: v } })} />
        <Field label="Caste" value={c.background.caste} onChange={(v) => onChange({ background: { ...c.background, caste: v } })} />
        <Field label="Faction" value={c.background.faction} onChange={(v) => onChange({ background: { ...c.background, faction: v } })} />
        <Field label="Who I Owe" value={c.background.whoIOwe} onChange={(v) => onChange({ background: { ...c.background, whoIOwe: v } })} textarea />
        <Field label="What I Need" value={c.background.whatINeed} onChange={(v) => onChange({ background: { ...c.background, whatINeed: v } })} textarea />
      </Panel>
    </div>
  );
}

function CardsTab({ c, onChange }: { c: Character; onChange: (p: Partial<Character>) => void }) {
  const [filter, setFilter] = useState<'available' | 'unlocked' | 'all'>('available');

  const { poolRows, unlockedIds, unlockedRows, availableRows, lockedRows, totalPicks, picksUsed, picksLeft } = useMemo(() => {
    const ids = new Set<string>([
      ...(ACTIONS_BY_CLASS[c.className] || []),
      ...(c.subclassPath ? ACTIONS_BY_SUBCLASS[`${c.className} — ${c.subclassPath}`] || [] : []),
    ]);
    const poolRows = ACTIONS.filter((a) => ids.has(a.id));
    poolRows.sort((a, b) => a.level - b.level || a.title.localeCompare(b.title));

    const unlockedSet = new Set(c.unlockedCards || []);
    const unlockedRows = poolRows.filter((a) => unlockedSet.has(a.id));
    const availableRows = poolRows.filter((a) => !unlockedSet.has(a.id) && a.level <= c.level);
    const lockedRows = poolRows.filter((a) => !unlockedSet.has(a.id) && a.level > c.level);

    const totalPicks = picksAtLevel(c.level);
    const picksUsed = unlockedRows.length;
    const picksLeft = totalPicks - picksUsed;

    return { poolRows, unlockedIds: unlockedSet, unlockedRows, availableRows, lockedRows, totalPicks, picksUsed, picksLeft };
  }, [c.className, c.subclassPath, c.level, c.unlockedCards]);

  const togglePick = (id: string) => {
    const already = unlockedIds.has(id);
    if (already) {
      onChange({ unlockedCards: (c.unlockedCards || []).filter((x) => x !== id) });
    } else {
      if (picksLeft <= 0) return;
      onChange({ unlockedCards: [...(c.unlockedCards || []), id] });
    }
  };

  const resetPicks = () => {
    if (!confirm('Refund all picks? Your unlocked abilities will be cleared.')) return;
    onChange({ unlockedCards: [] });
  };

  const rowsToShow =
    filter === 'unlocked' ? unlockedRows
    : filter === 'all' ? poolRows
    : availableRows;

  return (
    <div>
      {/* Picks header */}
      <div className="bg-ink-900 border border-ink-700 rounded-lg p-4 mb-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-baseline gap-2">
            <div className="font-display text-3xl text-accent-gold font-bold">{picksLeft}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider">picks available</div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Level {c.level} → {totalPicks} total · {picksUsed} spent
          </div>
          <div className="w-full bg-ink-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-accent-gold h-full transition-all"
              style={{ width: `${Math.min(100, (picksUsed / Math.max(1, totalPicks)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 max-w-sm">
          Every level grants one pick. Spend them on any ability from your class or subclass pool — the mix is yours.
        </div>

        {picksUsed > 0 && (
          <button
            type="button"
            onClick={resetPicks}
            className="px-3 py-1.5 text-xs rounded border border-ink-600 text-slate-400 hover:text-slate-200 hover:border-red-700 hover:text-red-200"
          >
            Refund all
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="inline-flex bg-ink-800 border border-ink-700 rounded overflow-hidden">
          {(['available', 'unlocked', 'all'] as const).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-xs font-display uppercase tracking-wider transition',
                filter === f ? 'bg-ink-600 text-accent-gold' : 'text-slate-400 hover:text-slate-200',
              )}
            >
              {f === 'available' ? `Available · ${availableRows.length}`
               : f === 'unlocked' ? `Unlocked · ${unlockedRows.length}`
               : `Full Pool · ${poolRows.length}`}
            </button>
          ))}
        </div>
        {poolRows.length === 0 && (
          <div className="text-xs text-slate-500 italic">No abilities defined for this class/subclass yet.</div>
        )}
      </div>

      {/* Card list */}
      <div className="space-y-2">
        {rowsToShow.length === 0 && (
          <EmptyState filter={filter} available={availableRows.length} locked={lockedRows.length} />
        )}
        {rowsToShow.map((a) => (
          <PickCardRow
            key={a.id}
            a={a}
            picked={unlockedIds.has(a.id)}
            locked={a.level > c.level}
            disabledPick={!unlockedIds.has(a.id) && picksLeft <= 0}
            onToggle={() => togglePick(a.id)}
          />
        ))}
      </div>

      {/* Locked preview always visible at bottom */}
      {filter !== 'unlocked' && lockedRows.length > 0 && (
        <>
          <div className="font-display text-sm text-slate-400 uppercase tracking-wider mt-8 mb-2">
            Locked · {lockedRows.length} cards gated by level
          </div>
          <div className="space-y-1 opacity-60">
            {lockedRows.map((a) => (
              <div key={a.id} className="flex items-center gap-3 bg-ink-900 border border-ink-700 rounded px-3 py-2 text-sm">
                <span className="font-mono text-xs w-8 text-slate-500">L{a.level}</span>
                <span className="flex-1 text-slate-300">{a.title}</span>
                <span className="text-xs text-slate-500">{a.category.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ filter, available, locked }: { filter: 'available' | 'unlocked' | 'all'; available: number; locked: number }) {
  let msg = '';
  if (filter === 'available') msg = available === 0 && locked > 0
    ? 'Nothing available at your current level. Raise Level to unlock more picks.'
    : 'No more available picks. Level up or refund some to pick differently.';
  else if (filter === 'unlocked') msg = 'No abilities picked yet. Head to Available to spend your picks.';
  else msg = 'No abilities in this pool.';
  return (
    <div className="border border-dashed border-ink-600 rounded p-8 text-center text-slate-500 text-sm">
      {msg}
    </div>
  );
}

function PickCardRow({ a, picked, locked, disabledPick, onToggle }: {
  a: Action;
  picked: boolean;
  locked: boolean;
  disabledPick: boolean;
  onToggle: () => void;
}) {
  const colorMap: Record<string, string> = {
    capstone: 'bg-orange-500', combat: 'bg-red-500', defense: 'bg-blue-400',
    control: 'bg-purple-400', mobility: 'bg-green-400', utility: 'bg-yellow-500',
    passive: 'bg-slate-500', power: 'bg-pink-500', reaction: 'bg-cyan-400',
    subclass: 'bg-accent-gold', misc: 'bg-slate-600',
  };
  return (
    <div className={cn(
      'flex items-start gap-3 bg-ink-900 border rounded p-3 transition',
      picked ? 'border-accent-gold/60 bg-ink-800' : 'border-ink-700 hover:border-ink-500',
      locked && 'opacity-50',
    )}>
      <div className={cn('w-1 self-stretch rounded-full', colorMap[a.colorKey] || 'bg-slate-600')} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="font-display font-bold text-accent-gold flex-1">{a.title}</div>
          {a.apCost > 0 && (
            <span className="text-xs font-display font-bold bg-ink-700 text-accent-steel px-2 py-0.5 rounded">
              {a.apCost} AP
            </span>
          )}
          {a.isBasicAttack && (
            <span className="text-xs font-display bg-ink-700 text-slate-300 px-2 py-0.5 rounded">Basic</span>
          )}
          <span className="text-xs font-mono bg-ink-800 border border-ink-700 text-slate-400 px-1.5 py-0.5 rounded">L{a.level}</span>
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          {a.category.replace(/_/g, ' ')}
          {a.playLimitPerTurn && <> · {a.playLimitPerTurn}/turn</>}
        </div>
        {a.description && <div className="text-sm text-slate-300 mt-1.5 leading-snug">{a.description}</div>}
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={!picked && (locked || disabledPick)}
        className={cn(
          'shrink-0 px-3 py-1.5 text-xs font-display uppercase tracking-wider rounded transition',
          picked
            ? 'bg-accent-gold text-ink-900 hover:bg-yellow-300'
            : locked
              ? 'bg-ink-800 text-slate-600 cursor-not-allowed border border-ink-700'
              : disabledPick
                ? 'bg-ink-800 text-slate-600 cursor-not-allowed border border-ink-700'
                : 'bg-ink-700 text-slate-200 hover:bg-ink-600 border border-ink-600',
        )}
        title={
          picked ? 'Refund this pick'
          : locked ? `Locked — unlock at Level ${a.level}`
          : disabledPick ? 'No picks available — level up or refund another pick'
          : 'Spend a pick to unlock this ability'
        }
      >
        {picked ? '✓ Picked' : locked ? `L${a.level}` : 'Pick'}
      </button>
    </div>
  );
}

function CardRow({ a }: { a: typeof ACTIONS[number] }) {
  const colorMap: Record<string, string> = {
    capstone: 'bg-orange-500',
    combat: 'bg-red-500',
    defense: 'bg-blue-400',
    control: 'bg-purple-400',
    mobility: 'bg-green-400',
    utility: 'bg-yellow-500',
    passive: 'bg-slate-500',
    power: 'bg-pink-500',
    reaction: 'bg-cyan-400',
    subclass: 'bg-accent-gold',
    misc: 'bg-slate-600',
  };
  return (
    <div className="flex items-start gap-3 bg-ink-900 border border-ink-700 rounded p-3 hover:border-ink-500 transition">
      <div className={cn('w-1 self-stretch rounded-full', colorMap[a.colorKey] || 'bg-slate-600')} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="font-display font-bold text-accent-gold flex-1">{a.title}</div>
          {a.apCost > 0 && (
            <span className="text-xs font-display font-bold bg-ink-700 text-accent-steel px-2 py-0.5 rounded">
              {a.apCost} AP
            </span>
          )}
          {a.isBasicAttack && (
            <span className="text-xs font-display bg-ink-700 text-slate-300 px-2 py-0.5 rounded">Basic</span>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          L{a.level} · {a.category.replace(/_/g, ' ')}
          {a.playLimitPerTurn && <> · {a.playLimitPerTurn}/turn</>}
        </div>
        {a.description && <div className="text-sm text-slate-300 mt-1.5 leading-snug">{a.description}</div>}
      </div>
    </div>
  );
}

function InventoryTab() {
  return (
    <div className="border border-dashed border-ink-600 rounded p-12 text-center text-slate-500">
      <div className="font-display text-slate-300">Inventory coming soon</div>
      <p className="text-sm mt-2">Weapons, armor, consumables, and item slots will live here.</p>
    </div>
  );
}

function NotesTab({ c, onChange }: { c: Character; onChange: (p: Partial<Character>) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Notes</label>
      <textarea
        value={c.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
        rows={20}
        placeholder="Session logs, NPC names, plot threads, your drift from the Oath..."
        className="w-full bg-ink-900 border border-ink-700 focus:border-accent-gold outline-none rounded p-3 text-slate-100 font-mono text-sm"
      />
    </div>
  );
}

// ─── Small shared components ────────────────────────────────────────────

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-ink-900 border border-ink-700 rounded-lg overflow-hidden">
      <div className="bg-ink-600 px-4 py-2 font-display text-accent-gold text-sm uppercase tracking-wider">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function VitalsRow({ label, cur, max, onCur, onMax, color }: {
  label: string; cur: number; max: number;
  onCur: (v: number) => void; onMax: (v: number) => void;
  color: string;
}) {
  return (
    <div className="mb-3">
      <div className={cn('text-xs uppercase tracking-wider font-bold font-display', color)}>{label}</div>
      <div className="flex items-center gap-2 mt-1">
        <input
          type="number"
          value={cur}
          aria-label={`${label} current`}
          placeholder="current"
          onChange={(e) => onCur(Number(e.target.value) || 0)}
          className="w-20 bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-2 py-1 text-center font-display text-xl font-bold"
        />
        <span className="text-slate-500">/</span>
        <input
          type="number"
          value={max}
          aria-label={`${label} max`}
          placeholder="max"
          onChange={(e) => onMax(Number(e.target.value) || 0)}
          className="w-20 bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-2 py-1 text-center font-display text-xl font-bold"
        />
      </div>
    </div>
  );
}

function NumberBox({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-2 py-1 text-center font-display text-lg font-bold"
      />
    </label>
  );
}

function LabeledSelect({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[]; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-2 py-2 text-slate-100"
      >
        {options.map((o) => <option key={o} value={o}>{o || '— none —'}</option>)}
      </select>
    </label>
  );
}

function LabeledNumber({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
        className="mt-1 w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-2 py-2 text-center font-display text-xl font-bold text-accent-gold"
      />
    </label>
  );
}

function Field({ label, value, onChange, textarea }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean;
}) {
  return (
    <label className="block mb-2 last:mb-0">
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="mt-1 w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-2 py-1.5 text-slate-100 text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-2 py-1.5 text-slate-100 text-sm"
        />
      )}
    </label>
  );
}
