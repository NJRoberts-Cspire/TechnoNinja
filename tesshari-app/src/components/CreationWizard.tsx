import { useEffect, useMemo, useState } from 'react';
import type { Character, StatKey } from '@/data/types';
import { defaultCharacter, STAT_KEYS, STAT_DESCRIPTIONS, STAT_TOTAL_BUDGET, STAT_MIN, STAT_CREATION_MAX } from '@/data/types';
import { SPECIES, CLASSES, SUBCLASS_BY_CLASS, SPECIES_FLAVOR, CLASS_FLAVOR, SUBCLASS_FLAVOR, CLASS_PRIMARY_STATS, RACE_STAT_BONUSES, RACE_HAND_MOD } from '@/data/generated';
import { ClassDetail } from '@/components/ClassDetail';
import { SkillTree } from '@/components/SkillTree';
import { pointsRemaining, pointsSpent, cn, maxHpFor, maxHpForUnnamed, effectiveStats, effectiveStat } from '@/lib/utils';

type Step = 'species' | 'class' | 'subclass' | 'stats' | 'background' | 'review';
const STEPS: { key: Step; label: string }[] = [
  { key: 'species', label: '1 · Species' },
  { key: 'class', label: '2 · Class' },
  { key: 'subclass', label: '3 · Subclass' },
  { key: 'stats', label: '4 · Stats' },
  { key: 'background', label: '5 · Background' },
  { key: 'review', label: '6 · Review' },
];

interface Props {
  onCancel: () => void;
  onCreate: (c: Character) => void;
}

export function CreationWizard({ onCancel, onCreate }: Props) {
  const [step, setStep] = useState<Step>('species');
  const [draft, setDraft] = useState<Character>(() => defaultCharacter());

  const stepIdx = STEPS.findIndex((s) => s.key === step);

  // Bonus-any is required for races that have a player-chosen stat bonus (Forged, Echoed).
  const speciesNeedsBonusPick = useMemo(() => {
    return (RACE_STAT_BONUSES[draft.species] || []).some((b) => b.stat === 'any');
  }, [draft.species]);
  const speciesBonusChosen = speciesNeedsBonusPick ? !!draft.speciesBonusStat : true;

  const canAdvance = useMemo(() => {
    switch (step) {
      case 'species': return !!draft.species && speciesBonusChosen;
      case 'class': return !!draft.className;
      case 'subclass': return true; // optional
      case 'stats': return pointsRemaining(draft.stats) === 0;
      case 'background': return !!draft.name.trim();
      case 'review': return true;
    }
  }, [step, draft, speciesBonusChosen]);

  const next = () => {
    if (stepIdx < STEPS.length - 1) setStep(STEPS[stepIdx + 1].key);
  };
  const prev = () => {
    if (stepIdx > 0) setStep(STEPS[stepIdx - 1].key);
  };

  const finish = () => {
    const effFrame = effectiveStat(draft, 'FRAME');
    const newMax = draft.className === 'The Unnamed'
      ? maxHpForUnnamed(draft.level, effectiveStats(draft))
      : maxHpFor(draft.className, draft.level, effFrame);
    onCreate({
      ...draft,
      hp: { current: newMax, max: newMax },
      ap: { current: 3, max: 3 },
      pointsSpent: pointsSpent(draft.stats),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  // Enter-to-advance (but not inside textareas).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === 'TEXTAREA') return;
      if (target && target.tagName === 'BUTTON') return;
      if (step === 'review') {
        e.preventDefault();
        finish();
      } else if (canAdvance) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const patch = (p: Partial<Character>) => setDraft((d) => ({ ...d, ...p }));
  const patchBg = (bg: Partial<Character['background']>) =>
    setDraft((d) => ({ ...d, background: { ...d.background, ...bg } }));
  const setStat = (k: StatKey, v: number) => setDraft((d) => ({ ...d, stats: { ...d.stats, [k]: v } }));

  return (
    <div>
      {/* Stepper */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STEPS.map((s, i) => (
          <button
            type="button"
            key={s.key}
            onClick={() => setStep(s.key)}
            className={cn(
              'px-3 py-2 text-xs rounded font-display transition',
              s.key === step ? 'bg-accent-gold text-ink-900' : i < stepIdx ? 'bg-ink-600 text-slate-200' : 'bg-ink-800 text-slate-400',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-ink-900 border border-ink-700 rounded-lg p-6 min-h-[520px]">
        {step === 'species' && (
          <SpeciesStep
            species={draft.species}
            bonusStat={draft.speciesBonusStat || ''}
            onSelect={(v) => patch({ species: v, speciesBonusStat: '' })}
            onBonusChange={(v) => patch({ speciesBonusStat: v })}
          />
        )}

        {step === 'class' && (
          <ClassStep
            selected={draft.className}
            onSelect={(v) => patch({ className: v, subclassPath: '' })}
          />
        )}

        {step === 'subclass' && (
          <SubclassStep
            className={draft.className}
            selected={draft.subclassPath}
            onSelect={(v) => patch({ subclassPath: v })}
          />
        )}

        {step === 'stats' && (
          <StatsStep
            draft={draft}
            setStat={setStat}
            setStats={(s) => setDraft((d) => ({ ...d, stats: s }))}
            className={draft.className}
          />
        )}

        {step === 'background' && (
          <BackgroundStep
            name={draft.name}
            background={draft.background}
            onNameChange={(name) => patch({ name })}
            onBgChange={patchBg}
          />
        )}

        {step === 'review' && (
          <Review draft={draft} onJumpTo={setStep} />
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded border border-ink-600 text-slate-400 hover:text-slate-200">
            Cancel
          </button>
          {stepIdx > 0 && (
            <button type="button" onClick={prev} className="px-4 py-2 text-sm rounded border border-ink-600 text-slate-300 hover:bg-ink-800">
              ← Back
            </button>
          )}
        </div>
        {step !== 'review' ? (
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance}
            className={cn(
              'px-5 py-2 rounded font-display font-bold transition',
              canAdvance ? 'bg-accent-gold text-ink-900 hover:bg-yellow-300' : 'bg-ink-800 text-slate-600 cursor-not-allowed',
            )}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            className="px-5 py-2 rounded font-display font-bold bg-accent-gold text-ink-900 hover:bg-yellow-300"
          >
            Create Character
          </button>
        )}
      </div>
    </div>
  );
}

function SpeciesStep({ species, bonusStat, onSelect, onBonusChange }: {
  species: string;
  bonusStat: string;
  onSelect: (v: string) => void;
  onBonusChange: (v: StatKey | '') => void;
}) {
  const bonuses = RACE_STAT_BONUSES[species] || [];
  const needsAnyPick = bonuses.some((b) => b.stat === 'any');
  const fixedBonuses = bonuses.filter((b) => b.stat !== 'any');
  const handMod = RACE_HAND_MOD[species] ?? 0;

  return (
    <div>
      <h2 className="font-display text-2xl text-accent-gold">Choose your Species</h2>
      <p className="text-sm text-slate-400 mt-1 mb-4">
        Eight strains of forged & remade. Species grants stat bonuses and a hand-size modifier — they apply on top of your creation stats.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {SPECIES.map((v) => {
          const bs = RACE_STAT_BONUSES[v] || [];
          const hm = RACE_HAND_MOD[v] ?? 0;
          return (
            <button
              type="button"
              key={v}
              onClick={() => onSelect(v)}
              className={cn(
                'text-left p-3 rounded border transition',
                species === v
                  ? 'bg-ink-600 border-accent-gold text-slate-50'
                  : 'bg-ink-800 border-ink-700 text-slate-300 hover:bg-ink-700 hover:border-ink-500',
              )}
            >
              <div className="font-display font-bold">{v}</div>
              <div className="flex gap-1 flex-wrap mt-1">
                {bs.map((b, i) => (
                  <span key={i} className="text-[10px] bg-accent-gold/15 text-accent-gold px-1.5 py-0.5 rounded">
                    +{b.value} {b.stat === 'any' ? 'any' : b.stat}
                  </span>
                ))}
                {hm !== 0 && (
                  <span className="text-[10px] bg-accent-steel/15 text-accent-steel px-1.5 py-0.5 rounded">
                    Hand {hm > 0 ? '+' : ''}{hm}
                  </span>
                )}
              </div>
              {SPECIES_FLAVOR[v] && <div className="text-xs text-slate-400 mt-1 leading-snug">{SPECIES_FLAVOR[v]}</div>}
            </button>
          );
        })}
      </div>

      {species && (
        <div className="mt-6 bg-ink-800 border border-ink-700 rounded p-4">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            {species} bonuses
          </div>
          <div className="flex flex-wrap gap-2 text-sm mb-3">
            {fixedBonuses.map((b, i) => (
              <span key={i} className="bg-accent-gold/15 text-accent-gold px-2 py-1 rounded font-display">
                +{b.value} {b.stat}
              </span>
            ))}
            {handMod !== 0 && (
              <span className="bg-accent-steel/15 text-accent-steel px-2 py-1 rounded font-display">
                Hand {handMod > 0 ? '+' : ''}{handMod}
              </span>
            )}
          </div>
          {needsAnyPick && (
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                Choose your +1 bonus stat
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STAT_KEYS.map((k) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => onBonusChange(k)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded border font-display',
                      bonusStat === k
                        ? 'bg-ink-600 border-accent-gold text-accent-gold'
                        : 'bg-ink-800 border-ink-700 text-slate-300 hover:bg-ink-700',
                    )}
                  >
                    {k}
                  </button>
                ))}
              </div>
              {!bonusStat && <div className="text-xs text-red-400 mt-2">Pick one before advancing.</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClassStep({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-accent-gold">Choose your Class</h2>
      <p className="text-sm text-slate-400 mt-1 mb-4">
        25 classes. Each brings its own card roster, class resources, and subclass paths. Click to preview.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4">
        {/* Left: class list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 content-start">
          {CLASSES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => onSelect(c)}
              className={cn(
                'text-left p-2.5 rounded border transition text-sm',
                selected === c
                  ? 'bg-ink-600 border-accent-gold text-slate-50'
                  : 'bg-ink-800 border-ink-700 text-slate-300 hover:bg-ink-700 hover:border-ink-500',
              )}
            >
              <div className="font-display font-bold">{c}</div>
              {CLASS_FLAVOR[c] && (
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                  {CLASS_FLAVOR[c].split('.')[0]}.
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Right: selected class detail + skill tree preview */}
        <div className="bg-ink-800 border border-ink-700 rounded-lg p-4 md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-10rem)] md:overflow-y-auto scrollbar-thin">
          {selected ? (
            <>
              <ClassDetail className={selected} compact />
              <div className="mt-6">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Progression
                </div>
                <SkillTree className={selected} compact />
              </div>
            </>
          ) : (
            <div className="text-slate-500 text-sm text-center py-12">
              Pick a class to see details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubclassStep({ className, selected, onSelect }: { className: string; selected: string; onSelect: (v: string) => void }) {
  const paths = SUBCLASS_BY_CLASS[className] || [];
  return (
    <div>
      <h2 className="font-display text-2xl text-accent-gold">Subclass Path</h2>
      <p className="text-sm text-slate-400 mt-1 mb-4">
        Paths for <span className="text-accent-gold">{className}</span>. You can leave this blank and pick later.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4">
        {/* Left: subclass options */}
        <div className="grid gap-1.5 content-start">
          <button
            type="button"
            onClick={() => onSelect('')}
            className={cn(
              'text-left p-3 rounded border transition',
              !selected ? 'bg-ink-600 border-accent-gold text-slate-50' : 'bg-ink-800 border-ink-700 text-slate-300 hover:bg-ink-700',
            )}
          >
            <div className="font-display font-bold">— none yet —</div>
            <div className="text-xs text-slate-400 mt-1">Decide later</div>
          </button>
          {paths.map((p) => {
            const key = `${className} — ${p}`;
            const flavor = SUBCLASS_FLAVOR[key];
            return (
              <button
                type="button"
                key={p}
                onClick={() => onSelect(p)}
                className={cn(
                  'text-left p-3 rounded border transition',
                  selected === p
                    ? 'bg-ink-600 border-accent-gold text-slate-50'
                    : 'bg-ink-800 border-ink-700 text-slate-300 hover:bg-ink-700 hover:border-ink-500',
                )}
              >
                <div className="font-display font-bold">{p}</div>
                {flavor && <div className="text-xs text-slate-400 mt-1 leading-snug">{flavor}</div>}
              </button>
            );
          })}
        </div>

        {/* Right: subclass-filtered skill tree */}
        <div className="bg-ink-800 border border-ink-700 rounded-lg p-4 md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-10rem)] md:overflow-y-auto scrollbar-thin">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
            {selected ? `${className} · ${selected}` : `${className} base roster`}
          </div>
          <div className="font-display text-sm text-slate-300 mb-3">
            {selected
              ? SUBCLASS_FLAVOR[`${className} — ${selected}`] || 'Subclass-specific abilities layer on top of the class roster.'
              : 'All class abilities shown. Subclass choices add path-specific cards at level 3+.'}
          </div>
          <SkillTree className={className} subclassPath={selected || undefined} compact />
        </div>
      </div>
    </div>
  );
}

function StatsStep({ draft, setStat, setStats, className }: {
  draft: Character;
  setStat: (k: StatKey, v: number) => void;
  setStats: (s: Record<StatKey, number>) => void;
  className: string;
}) {
  const stats = draft.stats;
  const remaining = pointsRemaining(stats);
  const primary = (CLASS_PRIMARY_STATS[className] || []) as StatKey[];

  const reset = (): Record<StatKey, number> =>
    STAT_KEYS.reduce((acc, k) => ({ ...acc, [k]: STAT_MIN }), {} as Record<StatKey, number>);

  const budgetToSpend = STAT_TOTAL_BUDGET - STAT_KEYS.length; // 14 points above base of 1 each

  const applyBalanced = () => {
    const base = reset();
    const order: StatKey[] = [...STAT_KEYS];
    for (let i = 0; i < budgetToSpend; i += 1) {
      const k = order[i % order.length];
      if (base[k] < STAT_CREATION_MAX) base[k] += 1;
    }
    setStats(base);
  };

  const applyRecommended = () => {
    const base = reset();
    const primaries = primary.length > 0 ? primary : (STAT_KEYS.slice(0, 2) as StatKey[]);
    const secondaries = STAT_KEYS.filter((k) => !primaries.includes(k));
    let left = budgetToSpend;
    for (const k of primaries) {
      const grow = Math.min(STAT_CREATION_MAX - 1, left);
      base[k] = STAT_MIN + grow;
      left -= grow;
    }
    let idx = 0;
    while (left > 0 && secondaries.length > 0) {
      const k = secondaries[idx % secondaries.length];
      if (base[k] < STAT_CREATION_MAX) {
        base[k] += 1;
        left -= 1;
      } else if (secondaries.every((s) => base[s] >= STAT_CREATION_MAX)) {
        break;
      }
      idx += 1;
    }
    setStats(base);
  };

  const resetAll = () => setStats(reset());

  return (
    <div>
      <div className="flex items-end justify-between mb-3 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl text-accent-gold">Allocate Stats</h2>
          <p className="text-sm text-slate-400 mt-1">
            Distribute {STAT_TOTAL_BUDGET} points total across six stats. Minimum 1, creation cap {STAT_CREATION_MAX}.
            Race bonuses apply after and can push past {STAT_CREATION_MAX}.
            {primary.length > 0 && (
              <> <span className="text-accent-gold">{className}</span> favors <span className="text-accent-gold">{primary.join(' + ')}</span>.</>
            )}
          </p>
        </div>
        <div className={cn(
          'text-right font-display',
          remaining === 0 ? 'text-accent-gold' : remaining < 0 ? 'text-red-400' : 'text-slate-300',
        )}>
          <div className="text-3xl font-bold">{remaining}</div>
          <div className="text-xs uppercase tracking-wider">points left</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          type="button"
          onClick={applyRecommended}
          className="px-3 py-1.5 text-xs rounded bg-ink-700 border border-ink-600 hover:bg-ink-600 font-display uppercase tracking-wider text-slate-200"
        >
          Recommended
        </button>
        <button
          type="button"
          onClick={applyBalanced}
          className="px-3 py-1.5 text-xs rounded bg-ink-700 border border-ink-600 hover:bg-ink-600 font-display uppercase tracking-wider text-slate-200"
        >
          Balanced
        </button>
        <button
          type="button"
          onClick={resetAll}
          className="px-3 py-1.5 text-xs rounded bg-ink-800 border border-ink-700 hover:bg-ink-700 font-display uppercase tracking-wider text-slate-400 hover:text-slate-200"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-3">
        {STAT_KEYS.map((k) => {
          const isPrimary = primary.includes(k);
          const base = stats[k];
          const eff = effectiveStat(draft, k);
          const bonus = eff - base;
          return (
            <div
              key={k}
              className={cn(
                'flex items-center gap-3 border rounded p-3',
                isPrimary ? 'bg-ink-800 border-accent-gold/40' : 'bg-ink-800 border-ink-700',
              )}
            >
              <div className="w-28">
                <div className="font-display font-bold flex items-center gap-1.5">
                  {k}
                  {isPrimary && (
                    <span
                      className="text-[9px] bg-accent-gold/20 text-accent-gold px-1.5 py-0.5 rounded font-normal tracking-wider"
                      title={`Primary stat for ${className}`}
                    >
                      PRIMARY
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{STAT_DESCRIPTIONS[k]}</div>
              </div>
              <button
                type="button"
                onClick={() => setStat(k, Math.max(STAT_MIN, base - 1))}
                disabled={base <= STAT_MIN}
                aria-label={`Decrease ${k}`}
                className="w-10 h-10 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30 text-xl font-bold"
              >
                −
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: STAT_CREATION_MAX }, (_, i) => i + 1).map((n) => (
                    <div
                      key={n}
                      className={cn(
                        'flex-1 h-6 rounded',
                        n <= base ? 'bg-accent-gold' : 'bg-ink-700',
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="w-16 text-right font-display text-2xl text-accent-gold font-bold">
                {eff}
                {bonus > 0 && (
                  <span className="text-[10px] text-accent-gold/70 ml-0.5" title={`${base} + ${bonus} race`}>
                    +{bonus}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setStat(k, Math.min(STAT_CREATION_MAX, base + 1))}
                disabled={base >= STAT_CREATION_MAX || remaining <= 0}
                aria-label={`Increase ${k}`}
                className="w-10 h-10 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30 text-xl font-bold"
              >
                +
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BackgroundStep({ name, background, onNameChange, onBgChange }: {
  name: string;
  background: Character['background'];
  onNameChange: (name: string) => void;
  onBgChange: (bg: Partial<Character['background']>) => void;
}) {
  const heritage = background.heritage;
  const Field = ({ label, value, onChange, placeholder, textarea }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean;
  }) => (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="mt-1 w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-3 py-2 text-slate-100"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-3 py-2 text-slate-100"
        />
      )}
    </label>
  );

  return (
    <div>
      <h2 className="font-display text-2xl text-accent-gold">Background</h2>
      <p className="text-sm text-slate-400 mt-1 mb-4">
        Give your character a name and a past. Blank fields can be filled in during play.
      </p>

      <div className="grid gap-4">
        <Field label="Name *" value={name} onChange={onNameChange} placeholder="Who are you?" />
        <Field label="Heritage" value={heritage} onChange={(v) => onBgChange({ heritage: v })} placeholder="Unaligned · Iron Temple · Wire Market · ..." />
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Reach" value={background.reach} onChange={(v) => onBgChange({ reach: v })} placeholder="Sunder Reach" />
          <Field label="Caste" value={background.caste} onChange={(v) => onBgChange({ caste: v })} placeholder="Craftbound" />
          <Field label="Faction" value={background.faction} onChange={(v) => onBgChange({ faction: v })} placeholder="None" />
        </div>
        <Field label="Who do you owe?" value={background.whoIOwe} onChange={(v) => onBgChange({ whoIOwe: v })} placeholder="A lord · a debt · a contract" textarea />
        <Field label="What do you need?" value={background.whatINeed} onChange={(v) => onBgChange({ whatINeed: v })} placeholder="What drives you into danger" textarea />
      </div>
    </div>
  );
}

function Review({ draft, onJumpTo }: { draft: Character; onJumpTo: (step: Step) => void }) {
  const Line = ({ label, value, step }: { label: string; value: string | number | undefined; step: Step }) => (
    <button
      type="button"
      onClick={() => onJumpTo(step)}
      className="w-full flex border-b border-ink-700 py-2 text-left hover:bg-ink-800 transition"
      title={`Jump back to ${step}`}
    >
      <div className="w-40 text-xs uppercase tracking-wider text-slate-400 shrink-0">{label}</div>
      <div className="text-slate-100 flex-1">
        {value || <span className="text-slate-500 italic">(blank)</span>}
      </div>
      <div className="text-xs text-slate-500">edit</div>
    </button>
  );
  const eff = effectiveStats(draft);
  const effFrame = eff.FRAME;
  const hpMax = draft.className === 'The Unnamed'
    ? maxHpForUnnamed(draft.level, eff)
    : maxHpFor(draft.className, draft.level, effFrame);
  return (
    <div>
      <h2 className="font-display text-2xl text-accent-gold">Review</h2>
      <p className="text-sm text-slate-400 mt-1 mb-4">Final look. Click any row to jump back and change it, or edit everything after creating.</p>

      <Line label="Name" value={draft.name} step="background" />
      <Line label="Species" value={`${draft.species}${draft.speciesBonusStat ? ` (+1 ${draft.speciesBonusStat})` : ''}`} step="species" />
      <Line label="Class" value={draft.className} step="class" />
      <Line label="Subclass Path" value={draft.subclassPath} step="subclass" />
      <Line label="Level" value={draft.level} step="stats" />
      <Line
        label="Stats (effective)"
        value={STAT_KEYS.map((k) => `${k} ${eff[k]}`).join(' · ')}
        step="stats"
      />
      <Line label="HP at L1" value={hpMax} step="stats" />
      <Line label="Heritage" value={draft.background.heritage} step="background" />
      <Line label="Reach" value={draft.background.reach} step="background" />
      <Line label="Caste" value={draft.background.caste} step="background" />
      <Line label="Faction" value={draft.background.faction} step="background" />
      <Line label="Who I Owe" value={draft.background.whoIOwe} step="background" />
      <Line label="What I Need" value={draft.background.whatINeed} step="background" />
    </div>
  );
}
