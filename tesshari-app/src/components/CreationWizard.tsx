import { useMemo, useState } from 'react';
import type { Character, StatKey } from '@/data/types';
import { defaultCharacter, STAT_KEYS, STAT_DESCRIPTIONS, STAT_BUDGET, STAT_MIN, STAT_MAX } from '@/data/types';
import { SPECIES, CLASSES, SUBCLASS_BY_CLASS, SPECIES_FLAVOR, CLASS_FLAVOR, SUBCLASS_FLAVOR } from '@/data/generated';
import { ClassDetail } from '@/components/ClassDetail';
import { SkillTree } from '@/components/SkillTree';
import { pointsRemaining, pointsSpent, cn } from '@/lib/utils';

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
  const canAdvance = useMemo(() => {
    switch (step) {
      case 'species': return !!draft.species;
      case 'class': return !!draft.className;
      case 'subclass': return true; // optional
      case 'stats': return pointsRemaining(draft.stats) === 0;
      case 'background': return !!draft.name.trim();
      case 'review': return true;
    }
  }, [step, draft]);

  const next = () => {
    if (stepIdx < STEPS.length - 1) setStep(STEPS[stepIdx + 1].key);
  };
  const prev = () => {
    if (stepIdx > 0) setStep(STEPS[stepIdx - 1].key);
  };

  const finish = () => {
    // Set HP/AP based on FRAME stat
    const maxHP = 20 + (draft.stats.FRAME - 1) * 5;
    onCreate({
      ...draft,
      hp: { current: maxHP, max: maxHP },
      ap: { current: 3, max: 3 },
      pointsSpent: pointsSpent(draft.stats),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const patch = (p: Partial<Character>) => setDraft((d) => ({ ...d, ...p }));
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
          <Picker
            title="Choose your Species"
            hint="Eight strains of forged & remade. Species shapes flavor and identity more than numbers."
            options={SPECIES as readonly string[]}
            selected={draft.species}
            onSelect={(v) => patch({ species: v })}
            describe={(v) => SPECIES_FLAVOR[v]}
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
          <StatsStep stats={draft.stats} setStat={setStat} />
        )}

        {step === 'background' && (
          <BackgroundStep
            name={draft.name}
            heritage={draft.background.heritage}
            background={draft.background}
            onNameChange={(name) => patch({ name })}
            onBgChange={(bg) => patch({ background: { ...draft.background, ...bg } })}
          />
        )}

        {step === 'review' && (
          <Review draft={draft} />
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

function Picker({ title, hint, options, selected, onSelect, describe }: {
  title: string;
  hint: string;
  options: readonly string[];
  selected: string;
  onSelect: (v: string) => void;
  describe?: (v: string) => string | undefined;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-accent-gold">{title}</h2>
      <p className="text-sm text-slate-400 mt-1 mb-4">{hint}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((v) => (
          <button
            type="button"
            key={v}
            onClick={() => onSelect(v)}
            className={cn(
              'text-left p-3 rounded border transition',
              selected === v
                ? 'bg-ink-600 border-accent-gold text-slate-50'
                : 'bg-ink-800 border-ink-700 text-slate-300 hover:bg-ink-700 hover:border-ink-500',
            )}
          >
            <div className="font-display font-bold">{v}</div>
            {describe?.(v) && <div className="text-xs text-slate-400 mt-1 leading-snug">{describe(v)}</div>}
          </button>
        ))}
      </div>
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

function StatsStep({ stats, setStat }: { stats: Record<StatKey, number>; setStat: (k: StatKey, v: number) => void }) {
  const remaining = pointsRemaining(stats);
  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl text-accent-gold">Allocate Stats</h2>
          <p className="text-sm text-slate-400 mt-1">
            Every stat starts at 1. Distribute {STAT_BUDGET} points; each stat caps at {STAT_MAX}.
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

      <div className="grid gap-3">
        {STAT_KEYS.map((k) => (
          <div key={k} className="flex items-center gap-3 bg-ink-800 border border-ink-700 rounded p-3">
            <div className="w-28">
              <div className="font-display font-bold">{k}</div>
              <div className="text-xs text-slate-400">{STAT_DESCRIPTIONS[k]}</div>
            </div>
            <button
              type="button"
              onClick={() => setStat(k, Math.max(STAT_MIN, stats[k] - 1))}
              disabled={stats[k] <= STAT_MIN}
              className="w-10 h-10 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30 text-xl font-bold"
            >
              −
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {Array.from({ length: STAT_MAX }, (_, i) => i + 1).map((n) => (
                  <div
                    key={n}
                    className={cn(
                      'flex-1 h-6 rounded',
                      n <= stats[k] ? 'bg-accent-gold' : 'bg-ink-700',
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="w-10 text-center font-display text-2xl text-accent-gold font-bold">{stats[k]}</div>
            <button
              type="button"
              onClick={() => setStat(k, Math.min(STAT_MAX, stats[k] + 1))}
              disabled={stats[k] >= STAT_MAX || remaining <= 0}
              className="w-10 h-10 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30 text-xl font-bold"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackgroundStep({ name, heritage, background, onNameChange, onBgChange }: {
  name: string;
  heritage: string;
  background: Character['background'];
  onNameChange: (name: string) => void;
  onBgChange: (bg: Partial<Character['background']>) => void;
}) {
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

function Review({ draft }: { draft: Character }) {
  const Line = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex border-b border-ink-700 py-2">
      <div className="w-40 text-xs uppercase tracking-wider text-slate-400 shrink-0">{label}</div>
      <div className="text-slate-100">{value || <span className="text-slate-500 italic">(blank)</span>}</div>
    </div>
  );
  return (
    <div>
      <h2 className="font-display text-2xl text-accent-gold">Review</h2>
      <p className="text-sm text-slate-400 mt-1 mb-4">Final look. You can edit everything after creating.</p>

      <Line label="Name" value={draft.name} />
      <Line label="Species" value={draft.species} />
      <Line label="Class" value={draft.className} />
      <Line label="Subclass Path" value={draft.subclassPath} />
      <Line label="Level" value={draft.level} />
      <Line label="Stats" value={STAT_KEYS.map((k) => `${k} ${draft.stats[k]}`).join(' · ')} />
      <Line label="Heritage" value={draft.background.heritage} />
      <Line label="Reach" value={draft.background.reach} />
      <Line label="Caste" value={draft.background.caste} />
      <Line label="Faction" value={draft.background.faction} />
      <Line label="Who I Owe" value={draft.background.whoIOwe} />
      <Line label="What I Need" value={draft.background.whatINeed} />
    </div>
  );
}
