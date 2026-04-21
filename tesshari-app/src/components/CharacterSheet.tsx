import { useEffect, useMemo, useState } from 'react';
import type { Character, StatKey, StatusEffect, StatusKey, InventoryItem } from '@/data/types';
import { STAT_KEYS, STAT_DESCRIPTIONS, STAT_MIN, STAT_PLAY_MAX, STATUS_KEYS, STATUS_META } from '@/data/types';
import type { Action } from '@/data/generated';
import { ACTIONS, ACTIONS_BY_CLASS, ACTIONS_BY_SUBCLASS, SUBCLASS_BY_CLASS, SPECIES, CLASSES, CLASS_PRIMARY_STATS, CLASS_HP_TIER, CLASS_HAND_BASE, RACE_HAND_MOD } from '@/data/generated';
import {
  cn, syncCharacter, effectiveStat, handSizeFor,
  appendLog, statusTotal, addStatus, removeStatus, modifyStatusStacks,
  apMaxFor, resolveDamage, endOfTurnTicks, startOfTurnTicks,
} from '@/lib/utils';
import { categoryColor } from '@/lib/colors';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import passivesData from '@/data/passives.generated.json';

interface PassiveEntry { name: string; description: string; }
const RACE_PASSIVES = (passivesData as { race: Record<string, PassiveEntry[]> }).race;
const CLASS_PASSIVES = (passivesData as { class: Record<string, PassiveEntry[]> }).class;

interface Props {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
  onOpenReference: (className: string) => void;
}

type Tab = 'sheet' | 'cards' | 'combat' | 'inventory' | 'notes';

const TAB_KEY = 'tesshari:sheetTabs:v1';

function loadTabMap(): Record<string, Tab> {
  try {
    const raw = localStorage.getItem(TAB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTab(id: string, tab: Tab) {
  try {
    const map = loadTabMap();
    map[id] = tab;
    localStorage.setItem(TAB_KEY, JSON.stringify(map));
  } catch {
    /* ignore storage errors */
  }
}

export function CharacterSheet({ character: c, onChange: rawOnChange, onOpenReference }: Props) {
  const [tab, setTabRaw] = useState<Tab>(() => loadTabMap()[c.id] || 'sheet');
  const setTab = (t: Tab) => {
    setTabRaw(t);
    saveTab(c.id, t);
  };
  // Reload tab when switching characters.
  useEffect(() => {
    setTabRaw(loadTabMap()[c.id] || 'sheet');
  }, [c.id]);

  // Wrap onChange with sync logic so structural edits auto-rescale HP
  // and drop stale picks when class/subclass changes.
  const onChange = (patch: Partial<Character>) => rawOnChange(syncCharacter(c, patch));

  return (
    <div>
      <Header c={c} onChange={onChange} onOpenReference={onOpenReference} />

      <div
        role="tablist"
        aria-label="Character sheet sections"
        className="flex gap-2 mt-4 mb-4 border-b border-ink-700"
      >
        {(['sheet', 'cards', 'combat', 'inventory', 'notes'] as Tab[]).map((t) => (
          <button
            type="button"
            key={t}
            role="tab"
            aria-selected={tab === t ? 'true' : 'false'}
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
      {tab === 'combat' && <CombatTab c={c} onChange={onChange} />}
      {tab === 'inventory' && <InventoryTab c={c} onChange={onChange} />}
      {tab === 'notes' && <NotesTab c={c} onChange={onChange} />}
    </div>
  );
}

function Header({ c, onChange, onOpenReference }: {
  c: Character;
  onChange: (p: Partial<Character>) => void;
  onOpenReference: (className: string) => void;
}) {
  const handCap = handSizeFor(c.className, c.species);
  const slotsOpen = handCap - (c.unlockedCards?.length || 0);
  return (
    <div className="bg-ink-900 border border-ink-700 rounded-lg p-4">
      {slotsOpen > 0 && (
        <div className="mb-3 -mt-1 flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/30 rounded px-3 py-2 text-sm">
          <span className="font-display font-bold text-accent-gold">{slotsOpen}</span>
          <span className="text-slate-200">
            hand {slotsOpen === 1 ? 'slot' : 'slots'} open — head to the CARDS tab to fill {slotsOpen === 1 ? 'it' : 'them'}.
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
  const setStat = (k: StatKey, v: number) => onChange({ stats: { ...c.stats, [k]: Math.max(STAT_MIN, Math.min(STAT_PLAY_MAX, v)) } });
  const primary = (CLASS_PRIMARY_STATS[c.className] || []) as StatKey[];
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Stats */}
      <Panel title="Stats">
        <div className="space-y-2">
          {STAT_KEYS.map((k) => {
            const isPrimary = primary.includes(k);
            const base = c.stats[k];
            const eff = effectiveStat(c, k);
            const bonus = eff - base;
            return (
            <div key={k} className="flex items-center gap-2">
              <div className="w-24">
                <div className={cn('font-display font-bold flex items-center gap-1', isPrimary && 'text-accent-gold')}>
                  {k}
                  {isPrimary && <span className="text-[8px] text-accent-gold/70" title={`Primary stat for ${c.className}`}>★</span>}
                </div>
                <div className="text-xs text-slate-500">{STAT_DESCRIPTIONS[k]}</div>
              </div>
              <button
                type="button"
                aria-label={`Decrease ${k}`}
                onClick={() => setStat(k, base - 1)}
                className="w-8 h-8 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30"
                disabled={base <= STAT_MIN}
              >−</button>
              <div className="w-14 text-center font-display text-2xl text-accent-gold font-bold" title={bonus ? `${base} base + ${bonus} race = ${eff}` : `${eff}`}>
                {eff}
                {bonus > 0 && <span className="text-[9px] text-accent-gold/70 ml-0.5">+{bonus}</span>}
              </div>
              <button
                type="button"
                aria-label={`Increase ${k}`}
                onClick={() => setStat(k, base + 1)}
                className="w-8 h-8 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30"
                disabled={base >= STAT_PLAY_MAX}
              >+</button>
            </div>
            );
          })}
        </div>
        <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-ink-700">
          HP tier: <span className="text-slate-300">{CLASS_HP_TIER[c.className] || '—'}</span> · Hand {handSizeFor(c.className, c.species)}
        </div>
      </Panel>

      {/* Vitals */}
      <VitalsPanel c={c} onChange={onChange} />

      {/* Status Effects */}
      <StatusPanel c={c} onChange={onChange} />

      {/* Passive Traits — full-width row */}
      <div className="lg:col-span-3">
        <PassivesPanel c={c} />
      </div>

      {/* Background — full-width row below the 3-column grid */}
      <div className="lg:col-span-3">
        <Panel title="Background">
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Heritage" value={c.background.heritage} onChange={(v) => onChange({ background: { ...c.background, heritage: v } })} />
            <Field label="Reach" value={c.background.reach} onChange={(v) => onChange({ background: { ...c.background, reach: v } })} />
            <Field label="Caste" value={c.background.caste} onChange={(v) => onChange({ background: { ...c.background, caste: v } })} />
            <Field label="Faction" value={c.background.faction} onChange={(v) => onChange({ background: { ...c.background, faction: v } })} />
            <Field label="Who I Owe" value={c.background.whoIOwe} onChange={(v) => onChange({ background: { ...c.background, whoIOwe: v } })} textarea />
            <Field label="What I Need" value={c.background.whatINeed} onChange={(v) => onChange({ background: { ...c.background, whatINeed: v } })} textarea />
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─── Combat-aware Vitals panel ─────────────────────────────────────────

function VitalsPanel({ c, onChange }: { c: Character; onChange: (p: Partial<Character>) => void }) {
  const [dmgInput, setDmgInput] = useState('');
  const [pierceInput, setPierceInput] = useState('');
  const [healInput, setHealInput] = useState('');

  const effAp = apMaxFor(c);
  const overheat = statusTotal(c.statusEffects, 'Overheat');
  const guardTotal = statusTotal(c.statusEffects, 'Guard');
  const shieldTotal = statusTotal(c.statusEffects, 'Shield');

  const takeDamage = () => {
    const raw = Math.max(0, parseInt(dmgInput, 10) || 0);
    if (raw === 0) return;
    const pierce = Math.max(0, parseInt(pierceInput, 10) || 0);
    const { final, guardAfter, shieldAfter, steps } = resolveDamage(c, raw, pierce);
    const newHp = Math.max(0, c.hp.current - final);
    let effects = rebuildGuardShield(c.statusEffects, guardAfter, shieldAfter);
    // Auto-apply Down when HP hits 0.
    if (newHp === 0 && !effects.some((e) => e.name === 'Down')) {
      effects = addStatus(effects, 'Down', 1, null, false);
    }
    const combatLog = appendLog(c, 'damage', `Take ${raw}${pierce ? ` (Pierce ${pierce})` : ''} → ${steps.join(' · ')}${newHp === 0 ? ' · DOWN' : ''}`);
    onChange({
      hp: { ...c.hp, current: newHp },
      statusEffects: effects,
      combatLog,
    });
    setDmgInput('');
    setPierceInput('');
  };

  const heal = () => {
    const n = Math.max(0, parseInt(healInput, 10) || 0);
    if (n === 0) return;
    const newHp = Math.min(c.hp.max, c.hp.current + n);
    // If we were at 0 HP, healing above 0 clears the Down state + resets death saves.
    const wasDown = c.hp.current === 0;
    const effects = wasDown && newHp > 0
      ? c.statusEffects.filter((s) => s.name !== 'Down' && s.name !== 'Dying')
      : c.statusEffects;
    const turn = wasDown && newHp > 0
      ? { ...c.turn, deathSaves: { successes: 0, failures: 0 } }
      : c.turn;
    onChange({
      hp: { ...c.hp, current: newHp },
      statusEffects: effects,
      turn,
      combatLog: appendLog(c, 'heal', `Heal +${newHp - c.hp.current}${wasDown && newHp > 0 ? ' · Revived' : ''}`),
    });
    setHealInput('');
  };

  const basicAttack = () => {
    if (c.turn.basicAttackUsed) return;
    onChange({
      turn: { ...c.turn, basicAttackUsed: true },
      combatLog: appendLog(c, 'basic', 'Basic Attack (0 AP)'),
    });
  };

  const toggleReaction = () => {
    onChange({
      turn: { ...c.turn, reactionUsed: !c.turn.reactionUsed },
      combatLog: appendLog(c, 'react', c.turn.reactionUsed ? 'Reaction restored' : 'Reaction spent'),
    });
  };

  const endTurn = () => {
    const { hpDelta, effects, lines } = endOfTurnTicks(c);
    const { hpDelta: startDelta, lines: startLines } = startOfTurnTicks({ ...c, statusEffects: effects });
    const newTurn = c.turn.turnNumber + 1;
    const nextHp = Math.max(0, Math.min(c.hp.max, c.hp.current + hpDelta + startDelta));
    const newApMax = (() => {
      const ot = effects.filter((s) => s.name === 'Overheat').reduce((n, s) => n + s.stacks, 0);
      const pen = ot >= 6 ? 2 : ot >= 3 ? 1 : 0;
      return Math.max(0, c.ap.max - pen);
    })();
    const text = [
      ...lines.map((l) => `End T${c.turn.turnNumber}: ${l}`),
      ...startLines.map((l) => `Start T${newTurn}: ${l}`),
    ].join(' · ') || `Turn ${newTurn} begins`;
    onChange({
      hp: { ...c.hp, current: nextHp },
      ap: { ...c.ap, current: newApMax },
      statusEffects: effects,
      turn: {
        ...c.turn,
        turnNumber: newTurn,
        playedThisTurn: [],
        basicAttackUsed: false,
      },
      combatLog: appendLog(c, 'turn-end', text),
    });
  };

  const endRound = () => {
    onChange({
      turn: { ...c.turn, roundNumber: c.turn.roundNumber + 1, reactionUsed: false },
      combatLog: appendLog(c, 'round-end', `Round ${c.turn.roundNumber + 1} · reactions reset`),
    });
  };

  const endCombat = () => {
    // Clears combat-scoped trackers and purges encounter statuses (Guard, Bleed,
    // Burn, Expose, etc.). Persistent things like Shield stay.
    const keepers = c.statusEffects.filter((s) =>
      s.name === 'Shield' || s.name === 'Regen'
    );
    onChange({
      ap: { ...c.ap, current: c.ap.max },
      statusEffects: keepers,
      turn: {
        ...c.turn,
        turnNumber: 1,
        roundNumber: 1,
        playedThisTurn: [],
        usedThisCombat: [],
        basicAttackUsed: false,
        reactionUsed: false,
        deathSaves: { successes: 0, failures: 0 },
      },
      combatLog: appendLog(c, 'rest', 'End Combat · trackers cleared'),
    });
  };

  const bumpDeathSave = (kind: 'successes' | 'failures') => {
    const ds = c.turn.deathSaves || { successes: 0, failures: 0 };
    const next = { ...ds, [kind]: Math.min(3, ds[kind] + 1) };
    onChange({
      turn: { ...c.turn, deathSaves: next },
      combatLog: appendLog(c, 'note', `Death save: ${kind === 'successes' ? 'success' : 'failure'} (${next.successes}✓ / ${next.failures}✗)`),
    });
  };

  const resetDeathSaves = () => {
    onChange({
      turn: { ...c.turn, deathSaves: { successes: 0, failures: 0 } },
      combatLog: appendLog(c, 'note', 'Death saves reset'),
    });
  };

  return (
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
        cur={c.ap.current} max={effAp}
        onCur={(v) => onChange({ ap: { ...c.ap, current: v } })}
        onMax={(v) => onChange({ ap: { ...c.ap, max: v } })}
        color="text-accent-steel"
        note={overheat >= 3 ? `Overheat ${overheat} · −${overheat >= 6 ? 2 : 1} AP` : undefined}
      />
      <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-slate-400">
        <div>Guard: <span className="text-slate-100 font-display">{guardTotal}</span></div>
        <div>Shield: <span className="text-slate-100 font-display">{shieldTotal}</span></div>
      </div>

      {/* Take damage / heal */}
      <div className="mt-4 pt-3 border-t border-ink-700 space-y-2">
        <div className="flex gap-1 items-center">
          <input
            inputMode="numeric"
            value={dmgInput}
            onChange={(e) => setDmgInput(e.target.value)}
            placeholder="Dmg"
            className="w-14 bg-ink-800 border border-ink-700 focus:border-red-500 outline-none rounded px-2 py-1 text-center text-sm"
          />
          <input
            inputMode="numeric"
            value={pierceInput}
            onChange={(e) => setPierceInput(e.target.value)}
            placeholder="Pierce"
            className="w-16 bg-ink-800 border border-ink-700 focus:border-red-500 outline-none rounded px-2 py-1 text-center text-sm"
          />
          <button
            type="button"
            onClick={takeDamage}
            className="flex-1 px-2 py-1 text-xs rounded bg-red-900 hover:bg-red-800 text-red-100 font-display"
          >
            Take damage
          </button>
        </div>
        <div className="flex gap-1 items-center">
          <input
            inputMode="numeric"
            value={healInput}
            onChange={(e) => setHealInput(e.target.value)}
            placeholder="Heal"
            className="w-14 bg-ink-800 border border-ink-700 focus:border-green-500 outline-none rounded px-2 py-1 text-center text-sm"
          />
          <button
            type="button"
            onClick={heal}
            className="flex-1 px-2 py-1 text-xs rounded bg-green-900 hover:bg-green-800 text-green-100 font-display"
          >
            Heal
          </button>
        </div>
      </div>

      {/* Turn controls */}
      <div className="mt-3 pt-3 border-t border-ink-700">
        <div className="text-xs text-slate-400 mb-2">
          Round <span className="text-slate-100 font-display">{c.turn.roundNumber}</span> · Turn <span className="text-slate-100 font-display">{c.turn.turnNumber}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={basicAttack}
            disabled={c.turn.basicAttackUsed}
            className={cn(
              'px-2 py-1.5 text-xs rounded font-display',
              c.turn.basicAttackUsed
                ? 'bg-ink-800 text-slate-600 border border-ink-700 cursor-not-allowed'
                : 'bg-ink-700 hover:bg-ink-600 text-slate-200',
            )}
            title="0 AP, once per turn"
          >
            {c.turn.basicAttackUsed ? 'Basic · used' : 'Basic Attack'}
          </button>
          <button
            type="button"
            onClick={toggleReaction}
            className={cn(
              'px-2 py-1.5 text-xs rounded font-display',
              c.turn.reactionUsed
                ? 'bg-ink-800 text-slate-600 border border-ink-700'
                : 'bg-ink-700 hover:bg-ink-600 text-slate-200',
            )}
            title="Once per round"
          >
            {c.turn.reactionUsed ? 'React · used' : 'Reaction'}
          </button>
          <button
            type="button"
            onClick={endTurn}
            className="px-2 py-1.5 text-xs rounded bg-accent-steel/80 hover:bg-accent-steel text-ink-900 font-display font-bold"
          >
            End turn
          </button>
          <button
            type="button"
            onClick={endRound}
            className="px-2 py-1.5 text-xs rounded bg-ink-600 hover:bg-ink-500 text-slate-100 font-display"
          >
            End round
          </button>
        </div>
        <button
          type="button"
          onClick={endCombat}
          className="mt-2 w-full px-2 py-1.5 text-xs rounded border border-ink-600 text-slate-400 hover:bg-ink-800 hover:text-slate-200 font-display uppercase tracking-wider"
          title="Clear once-per-combat trackers, end-of-combat statuses"
        >
          End combat
        </button>
      </div>

      {/* Death save panel — surfaces when at 0 HP */}
      {c.hp.current === 0 && (
        <div className="mt-3 pt-3 border-t border-red-700/40">
          <div className="text-xs uppercase tracking-wider font-display text-red-300 mb-2">
            Dying · death saves
          </div>
          <div className="flex items-center gap-2 mb-2">
            <DeathPips count={c.turn.deathSaves?.successes ?? 0} tone="success" />
            <span className="text-xs text-slate-500">/</span>
            <DeathPips count={c.turn.deathSaves?.failures ?? 0} tone="failure" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => bumpDeathSave('successes')}
              className="px-2 py-1 text-xs rounded bg-green-900/60 hover:bg-green-800 text-green-100 font-display"
            >
              + Success
            </button>
            <button
              type="button"
              onClick={() => bumpDeathSave('failures')}
              className="px-2 py-1 text-xs rounded bg-red-900/60 hover:bg-red-800 text-red-100 font-display"
            >
              + Failure
            </button>
          </div>
          <button
            type="button"
            onClick={resetDeathSaves}
            className="mt-2 w-full px-2 py-1 text-[10px] rounded border border-ink-600 text-slate-500 hover:text-slate-300 font-display uppercase tracking-wider"
          >
            Reset saves
          </button>
          {(c.turn.deathSaves?.successes ?? 0) >= 3 && (
            <div className="mt-2 text-xs text-green-300 text-center font-display">Stabilized — at 0 HP but no longer dying.</div>
          )}
          {(c.turn.deathSaves?.failures ?? 0) >= 3 && (
            <div className="mt-2 text-xs text-red-300 text-center font-display">Dead. Long rest or resurrection required.</div>
          )}
        </div>
      )}

      {/* Rests */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-ink-700">
        <button
          type="button"
          onClick={() => onChange({
            ap: { ...c.ap, current: c.ap.max },
            combatLog: appendLog(c, 'rest', 'Short rest (AP restored)'),
          })}
          className="px-3 py-2 text-sm rounded bg-ink-700 hover:bg-ink-600"
        >
          Short rest
        </button>
        <button
          type="button"
          onClick={() => onChange({
            hp: { ...c.hp, current: c.hp.max },
            ap: { ...c.ap, current: c.ap.max },
            statusEffects: [],
            combatLog: appendLog(c, 'rest', 'Long rest (HP, AP, statuses cleared)'),
          })}
          className="px-3 py-2 text-sm rounded bg-ink-600 hover:bg-ink-500 font-display"
        >
          Long rest
        </button>
      </div>
    </Panel>
  );
}

function PassivesPanel({ c }: { c: Character }) {
  const racePassives = RACE_PASSIVES[c.species] || [];
  const classPassives = CLASS_PASSIVES[c.className] || [];
  if (racePassives.length === 0 && classPassives.length === 0) return null;
  return (
    <div className="bg-ink-900 border border-ink-700 rounded-lg overflow-hidden">
      <div className="bg-ink-600 px-4 py-2 font-display text-accent-gold text-sm uppercase tracking-wider">
        Passive Traits — always on
      </div>
      <div className="p-4 grid md:grid-cols-2 gap-3">
        {racePassives.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
              {c.species} · race
            </div>
            <ul className="space-y-2">
              {racePassives.map((p) => (
                <li key={p.name} className="text-sm">
                  <span className="font-display font-bold text-accent-gold">{p.name}.</span>{' '}
                  <span className="text-slate-300">{p.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {classPassives.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
              {c.className} · class
            </div>
            <ul className="space-y-2">
              {classPassives.map((p) => (
                <li key={p.name} className="text-sm">
                  <span className="font-display font-bold text-accent-gold">{p.name}.</span>{' '}
                  <span className="text-slate-300">{p.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function DeathPips({ count, tone }: { count: number; tone: 'success' | 'failure' }) {
  const filled = tone === 'success' ? 'bg-green-400' : 'bg-red-500';
  return (
    <div className="inline-flex gap-1" aria-label={`${count} ${tone}${count === 1 ? '' : 's'}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn('w-3 h-3 rounded-full border border-ink-600', i < count ? filled : 'bg-ink-800')}
        />
      ))}
    </div>
  );
}

function rebuildGuardShield(effects: StatusEffect[], newGuard: number, newShield: number): StatusEffect[] {
  const nonGS = effects.filter((s) => s.name !== 'Guard' && s.name !== 'Shield');
  const out = [...nonGS];
  if (newGuard > 0) out.push({ id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())), name: 'Guard', stacks: newGuard, remainingTurns: 1 });
  if (newShield > 0) out.push({ id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())), name: 'Shield', stacks: newShield, remainingTurns: null });
  return out;
}

// ─── Status Effects panel ──────────────────────────────────────────────

function StatusPanel({ c, onChange }: { c: Character; onChange: (p: Partial<Character>) => void }) {
  const [picker, setPicker] = useState(false);
  const [pickerKey, setPickerKey] = useState<StatusKey>('Guard');
  const [stackInput, setStackInput] = useState('1');
  const [turnsInput, setTurnsInput] = useState('');

  const addEffect = () => {
    const stacks = Math.max(1, parseInt(stackInput, 10) || 1);
    const turns = turnsInput.trim() === '' ? null : Math.max(0, parseInt(turnsInput, 10) || 0);
    const stacking = STATUS_META[pickerKey].stacking;
    onChange({
      statusEffects: addStatus(c.statusEffects, pickerKey, stacks, turns, stacking),
      combatLog: appendLog(c, 'status-add', `+${pickerKey} ${stacks}${turns !== null ? ` (${turns} turns)` : ''}`),
    });
    setPicker(false);
    setStackInput('1');
    setTurnsInput('');
  };

  return (
    <Panel title="Status Effects">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {c.statusEffects.length === 0 && (
          <span className="text-xs text-slate-500 italic">No active effects.</span>
        )}
        {c.statusEffects.map((s) => (
          <StatusChip
            key={s.id}
            eff={s}
            onInc={() => onChange({ statusEffects: modifyStatusStacks(c.statusEffects, s.id, 1) })}
            onDec={() =>
              onChange({
                statusEffects: modifyStatusStacks(c.statusEffects, s.id, -1),
                combatLog:
                  s.stacks - 1 <= 0
                    ? appendLog(c, 'status-remove', `−${s.name}`)
                    : c.combatLog,
              })
            }
            onRemove={() =>
              onChange({
                statusEffects: removeStatus(c.statusEffects, s.id),
                combatLog: appendLog(c, 'status-remove', `−${s.name} (cleared)`),
              })
            }
          />
        ))}
      </div>

      {picker ? (
        <div className="mt-3 pt-3 border-t border-ink-700 space-y-2">
          <select
            value={pickerKey}
            onChange={(e) => setPickerKey(e.target.value as StatusKey)}
            aria-label="Status effect to apply"
            className="w-full bg-ink-800 border border-ink-700 rounded px-2 py-1.5 text-sm text-slate-100"
          >
            {STATUS_KEYS.map((k) => (
              <option key={k} value={k}>
                {k} — {STATUS_META[k].summary}
              </option>
            ))}
          </select>
          <div className="flex gap-1">
            <input
              inputMode="numeric"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              placeholder="Stacks"
              className="flex-1 bg-ink-800 border border-ink-700 rounded px-2 py-1 text-center text-sm"
            />
            <input
              inputMode="numeric"
              value={turnsInput}
              onChange={(e) => setTurnsInput(e.target.value)}
              placeholder="Turns (blank = until consumed)"
              className="flex-[2] bg-ink-800 border border-ink-700 rounded px-2 py-1 text-center text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addEffect}
              className="flex-1 px-3 py-1.5 text-xs rounded bg-accent-gold text-ink-900 font-display font-bold hover:bg-yellow-300"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setPicker(false)}
              className="px-3 py-1.5 text-xs rounded border border-ink-600 text-slate-300 hover:bg-ink-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="mt-3 w-full px-3 py-1.5 text-xs rounded border border-dashed border-ink-600 text-slate-400 hover:text-slate-200 hover:border-ink-500 font-display uppercase tracking-wider"
        >
          + Add status
        </button>
      )}
    </Panel>
  );
}

function StatusChip({ eff, onInc, onDec, onRemove }: {
  eff: StatusEffect;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}) {
  const meta = STATUS_META[eff.name];
  const tone = meta.type === 'buff' ? 'bg-accent-gold/15 border-accent-gold/40 text-accent-gold'
             : meta.type === 'debuff' ? 'bg-red-900/40 border-red-700/50 text-red-200'
             : 'bg-ink-700 border-ink-600 text-slate-200';
  return (
    <div
      className={cn('inline-flex items-center gap-1 border rounded px-2 py-1 text-xs font-display', tone)}
      title={meta.summary}
    >
      <span className="font-bold">{eff.name}</span>
      {meta.stacking && <span className="tabular-nums">{eff.stacks}</span>}
      {eff.remainingTurns !== null && (
        <span className="text-[10px] opacity-70">({eff.remainingTurns}t)</span>
      )}
      {meta.stacking && (
        <>
          <button type="button" onClick={onInc} className="px-1 hover:text-white" aria-label={`Increase ${eff.name}`}>+</button>
          <button type="button" onClick={onDec} className="px-1 hover:text-white" aria-label={`Decrease ${eff.name}`}>−</button>
        </>
      )}
      <button type="button" onClick={onRemove} className="px-1 hover:text-white" aria-label={`Remove ${eff.name}`}>×</button>
    </div>
  );
}

const TIER_LEVELS = [1, 2, 3, 5, 9, 20] as const;
const TIER_LABEL: Record<number, string> = {
  1: 'Core · Level 1',
  2: 'Level 2',
  3: 'Subclass · Level 3',
  5: 'Power · Level 5',
  9: 'Subclass Power · Level 9',
  20: 'Capstone · Level 20',
};

function CardsTab({ c, onChange }: { c: Character; onChange: (p: Partial<Character>) => void }) {
  const [filter, setFilter] = useState<'available' | 'unlocked' | 'all'>('available');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [confirmReset, setConfirmReset] = useState(false);

  const { poolRows, unlockedIds, unlockedRows, availableRows, lockedRows, handSize, picksUsed, picksLeft, categories } = useMemo(() => {
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

    const handSize = handSizeFor(c.className, c.species);
    const picksUsed = unlockedRows.length;
    const picksLeft = handSize - picksUsed;

    const categories = Array.from(new Set(poolRows.map((a) => a.colorKey))).sort();

    return { poolRows, unlockedIds: unlockedSet, unlockedRows, availableRows, lockedRows, handSize, picksUsed, picksLeft, categories };
  }, [c.className, c.species, c.subclassPath, c.level, c.unlockedCards]);

  const togglePick = (id: string) => {
    const already = unlockedIds.has(id);
    if (already) {
      onChange({ unlockedCards: (c.unlockedCards || []).filter((x) => x !== id) });
    } else {
      if (picksLeft <= 0) return;
      onChange({ unlockedCards: [...(c.unlockedCards || []), id] });
    }
  };

  const playCard = (a: Action, opts?: { payHp?: number }) => {
    if (c.turn.playedThisTurn.includes(a.id)) return;
    const hpCost = opts?.payHp ?? 0;
    if (hpCost === 0 && c.ap.current < a.apCost) return;
    if (hpCost > 0 && c.hp.current < hpCost) return;
    onChange({
      ap: hpCost > 0 ? c.ap : { ...c.ap, current: c.ap.current - a.apCost },
      hp: hpCost > 0 ? { ...c.hp, current: c.hp.current - hpCost } : c.hp,
      turn: { ...c.turn, playedThisTurn: [...c.turn.playedThisTurn, a.id] },
      combatLog: appendLog(
        c,
        'play',
        hpCost > 0
          ? `Played ${a.title} (−${hpCost} HP, 0 AP)`
          : `Played ${a.title} (${a.apCost} AP)`,
      ),
    });
  };

  const hpCostFor = (a: Action): number | null => {
    // Cards that offer an HP-for-AP swap include a "pay N HP instead of X AP" clause.
    const m = a.description.match(/pay\s+(\d+)\s+HP\s+instead\s+of\s+(\d+)\s+AP/i);
    return m ? parseInt(m[1], 10) : null;
  };

  const baseRows =
    filter === 'unlocked' ? unlockedRows
    : filter === 'all' ? poolRows
    : availableRows;

  const q = query.trim().toLowerCase();
  const rowsToShow = baseRows.filter((a) => {
    if (category && a.colorKey !== category) return false;
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  const pickPct = Math.min(100, (picksUsed / Math.max(1, handSize)) * 100);
  const tierGroups = TIER_LEVELS
    .map((lv) => ({ level: lv, rows: rowsToShow.filter((a) => a.level === lv) }))
    .filter((g) => g.rows.length > 0);

  return (
    <div>
      {/* Picks header */}
      <div className="bg-ink-900 border border-ink-700 rounded-lg p-4 mb-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-baseline gap-2">
            <div className="font-display text-3xl text-accent-gold font-bold">{picksLeft}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider">hand slots open</div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Hand {picksUsed}/{handSize} · {c.className} base {CLASS_HAND_BASE[c.className] ?? '—'}
            {(RACE_HAND_MOD[c.species] ?? 0) !== 0 && ` · ${c.species} ${RACE_HAND_MOD[c.species]! > 0 ? '+' : ''}${RACE_HAND_MOD[c.species]}`}
          </div>
          <div
            role="progressbar"
            aria-label={`${picksUsed} of ${handSize} hand slots used`}
            aria-valuenow={Math.round(pickPct) as number}
            aria-valuemin={0 as number}
            aria-valuemax={100 as number}
            className="w-full bg-ink-800 rounded-full h-1.5 mt-2 overflow-hidden"
          >
            <div className={cn('bg-accent-gold h-full transition-all', pickBarWidth(pickPct))} />
          </div>
        </div>

        <div className="text-xs text-slate-400 max-w-sm">
          Your hand is the cards available each turn. Each card plays once per turn. Hand size is fixed — swap cards in and out as you level.
        </div>

        {picksUsed > 0 && (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-3 py-1.5 text-xs rounded border border-ink-600 text-slate-400 hover:bg-ink-800 hover:border-red-700 hover:text-red-200"
          >
            Refund all
          </button>
        )}
      </div>

      {/* Filter toggle + search */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="inline-flex bg-ink-800 border border-ink-700 rounded overflow-hidden" role="tablist" aria-label="Card filter">
          {(['available', 'unlocked', 'all'] as const).map((f) => (
            <button
              type="button"
              key={f}
              role="tab"
              aria-selected={filter === f ? 'true' : 'false'}
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
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search abilities…"
          className="flex-1 min-w-[160px] max-w-xs bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-3 py-1.5 text-sm text-slate-100"
        />
      </div>

      {/* Category chips */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          <CategoryChip label="all" active={!category} onClick={() => setCategory('')} />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={category === cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
            />
          ))}
        </div>
      )}

      {poolRows.length === 0 && (
        <div className="text-xs text-slate-500 italic mb-2">No abilities defined for this class/subclass yet.</div>
      )}

      {/* Tier-grouped card list */}
      {tierGroups.length === 0 ? (
        <EmptyState filter={filter} available={availableRows.length} locked={lockedRows.length} filtered={!!q || !!category} />
      ) : (
        <div className="space-y-5">
          {tierGroups.map((g) => (
            <div key={g.level}>
              <div className="flex items-baseline justify-between mb-2">
                <div className="font-display text-sm text-slate-300 uppercase tracking-wider">
                  {TIER_LABEL[g.level] || `Level ${g.level}`}
                </div>
                <div className="text-xs text-slate-500">
                  {g.rows.length} {g.rows.length === 1 ? 'ability' : 'abilities'}
                </div>
              </div>
              <div className="space-y-2">
                {g.rows.map((a) => {
                  const isPicked = unlockedIds.has(a.id);
                  const usedThisTurn = c.turn.playedThisTurn.includes(a.id);
                  const notEnoughAp = c.ap.current < a.apCost;
                  const hpCost = hpCostFor(a);
                  const notEnoughHp = hpCost !== null && c.hp.current < hpCost;
                  return (
                    <PickCardRow
                      key={a.id}
                      a={a}
                      picked={isPicked}
                      locked={a.level > c.level}
                      disabledPick={!isPicked && picksLeft <= 0}
                      usedThisTurn={usedThisTurn}
                      notEnoughAp={notEnoughAp}
                      hpCost={hpCost}
                      notEnoughHp={notEnoughHp}
                      onToggle={() => togglePick(a.id)}
                      onPlay={() => playCard(a)}
                      onPlayHp={hpCost !== null ? () => playCard(a, { payHp: hpCost }) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked preview always visible at bottom */}
      {filter !== 'unlocked' && lockedRows.length > 0 && !query && !category && (
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

      <ConfirmDialog
        open={confirmReset}
        title="Refund all picks?"
        message="All unlocked abilities will be cleared. You'll get every pick back."
        confirmLabel="Refund all"
        destructive
        onConfirm={() => {
          onChange({ unlockedCards: [] });
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-2 py-1 text-[11px] font-display uppercase tracking-wider rounded border transition',
        active
          ? 'bg-ink-600 border-accent-gold text-accent-gold'
          : 'bg-ink-800 border-ink-700 text-slate-400 hover:text-slate-200',
      )}
    >
      {label.replace(/_/g, ' ')}
    </button>
  );
}

/** Snap progress to nearest 5% so we can use Tailwind utility classes instead of inline style. */
function pickBarWidth(pct: number): string {
  const snapped = Math.max(0, Math.min(100, Math.round(pct / 5) * 5));
  const map: Record<number, string> = {
    0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]',
    25: 'w-1/4', 30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]',
    50: 'w-1/2', 55: 'w-[55%]', 60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]',
    75: 'w-3/4', 80: 'w-[80%]', 85: 'w-[85%]', 90: 'w-[90%]', 95: 'w-[95%]',
    100: 'w-full',
  };
  return map[snapped] || 'w-0';
}

function EmptyState({ filter, available, locked, filtered }: { filter: 'available' | 'unlocked' | 'all'; available: number; locked: number; filtered?: boolean }) {
  let msg = '';
  if (filtered) msg = 'No abilities match the current search/filter.';
  else if (filter === 'available') msg = available === 0 && locked > 0
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

function PickCardRow({ a, picked, locked, disabledPick, usedThisTurn, notEnoughAp, hpCost, notEnoughHp, onToggle, onPlay, onPlayHp }: {
  a: Action;
  picked: boolean;
  locked: boolean;
  disabledPick: boolean;
  usedThisTurn: boolean;
  notEnoughAp: boolean;
  hpCost: number | null;
  notEnoughHp: boolean;
  onToggle: () => void;
  onPlay: () => void;
  onPlayHp?: () => void;
}) {
  const cannotPlay = locked || usedThisTurn || notEnoughAp;
  const cannotPlayHp = locked || usedThisTurn || notEnoughHp;
  const tierText = a.tier !== null ? `T${a.tier}` : null;
  return (
    <div className={cn(
      'flex items-start gap-3 bg-ink-900 border rounded p-3 transition',
      picked ? 'border-accent-gold/60 bg-ink-800' : 'border-ink-700 hover:border-ink-500',
      (locked || usedThisTurn) && 'opacity-60',
    )}>
      <div className={cn('w-1 self-stretch rounded-full', categoryColor(a.colorKey))} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <div className="font-display font-bold text-accent-gold flex-1 min-w-0">{a.title}</div>
          {tierText && (
            <span className="text-xs font-display font-bold bg-ink-700 text-purple-200 px-2 py-0.5 rounded" title={`Tier ${a.tier}`}>
              {tierText}
            </span>
          )}
          {a.apCost > 0 && (
            <span className="text-xs font-display font-bold bg-ink-700 text-accent-steel px-2 py-0.5 rounded">
              {a.apCost} AP
            </span>
          )}
          {a.baseDamage !== null && (
            <span className="text-xs font-display font-bold bg-red-900/40 border border-red-700/40 text-red-200 px-2 py-0.5 rounded" title="Base damage + stat modifier">
              {a.baseDamage}{a.damageStat && `+${a.damageStat}`}
            </span>
          )}
          {a.isBasicAttack && (
            <span className="text-xs font-display bg-ink-700 text-slate-300 px-2 py-0.5 rounded">Basic</span>
          )}
          {a.startingHand && (
            <span className="text-xs font-display bg-accent-gold/20 text-accent-gold border border-accent-gold/40 px-2 py-0.5 rounded" title="In your starting hand — always known">
              Start
            </span>
          )}
          <span className="text-xs font-mono bg-ink-800 border border-ink-700 text-slate-400 px-1.5 py-0.5 rounded">L{a.level}</span>
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          {a.cardType || a.category.replace(/_/g, ' ')}
          {a.playLimitPerTurn && <> · {a.playLimitPerTurn}/turn</>}
        </div>
        {a.description && <div className="text-sm text-slate-300 mt-1.5 leading-snug">{a.description}</div>}
        {a.keywords.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1.5">
            {a.keywords.map((k, i) => (
              <span key={`${k.name}-${i}`} className="text-[10px] font-display bg-ink-800 border border-ink-700 text-accent-gold px-1.5 py-0.5 rounded">
                {k.name}{k.value !== null ? ` ${k.value}` : ''}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 flex flex-col gap-1 items-stretch">
        {picked && !locked && (
          <button
            type="button"
            onClick={onPlay}
            disabled={cannotPlay}
            className={cn(
              'px-3 py-1.5 text-xs font-display uppercase tracking-wider rounded transition',
              cannotPlay
                ? 'bg-ink-800 text-slate-600 cursor-not-allowed border border-ink-700'
                : 'bg-accent-steel text-ink-900 hover:bg-blue-300',
            )}
            title={
              usedThisTurn ? 'Already played this turn'
              : notEnoughAp ? `Need ${a.apCost} AP`
              : `Play (spend ${a.apCost} AP)`
            }
          >
            {usedThisTurn ? 'Used' : notEnoughAp ? 'Low AP' : 'Play'}
          </button>
        )}
        {picked && !locked && hpCost !== null && onPlayHp && (
          <button
            type="button"
            onClick={onPlayHp}
            disabled={cannotPlayHp}
            className={cn(
              'px-3 py-1 text-[10px] font-display uppercase tracking-wider rounded transition',
              cannotPlayHp
                ? 'bg-ink-800 text-slate-600 cursor-not-allowed border border-ink-700'
                : 'bg-red-900/50 text-red-200 hover:bg-red-800 border border-red-800/60',
            )}
            title={notEnoughHp ? `Need ${hpCost} HP` : `Play by paying ${hpCost} HP instead of ${a.apCost} AP`}
          >
            Pay {hpCost} HP
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          disabled={!picked && (locked || disabledPick)}
          className={cn(
            'px-3 py-1 text-[10px] font-display uppercase tracking-wider rounded transition',
            picked
              ? 'bg-ink-700 text-slate-300 border border-ink-600 hover:text-red-300 hover:border-red-800'
              : locked
                ? 'bg-ink-800 text-slate-600 cursor-not-allowed border border-ink-700'
                : disabledPick
                  ? 'bg-ink-800 text-slate-600 cursor-not-allowed border border-ink-700'
                  : 'bg-ink-700 text-slate-200 hover:bg-ink-600 border border-ink-600',
          )}
          title={
            picked ? 'Remove from hand'
            : locked ? `Locked — unlock at Level ${a.level}`
            : disabledPick ? 'Hand full — swap a card out first'
            : 'Add to hand'
          }
        >
          {picked ? 'Drop' : locked ? `L${a.level}` : 'Add'}
        </button>
      </div>
    </div>
  );
}

function CombatTab({ c, onChange }: { c: Character; onChange: (p: Partial<Character>) => void }) {
  const clearLog = () => onChange({ combatLog: [] });
  const log = [...c.combatLog].reverse(); // most recent first
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="font-display text-sm text-slate-300 uppercase tracking-wider">
          Combat log <span className="text-slate-500 ml-2 text-xs normal-case tracking-normal">R{c.turn.roundNumber} · T{c.turn.turnNumber} · {c.combatLog.length} entries</span>
        </div>
        {c.combatLog.length > 0 && (
          <button
            type="button"
            onClick={clearLog}
            className="px-3 py-1 text-xs rounded border border-ink-600 text-slate-400 hover:text-slate-200 hover:border-red-700 hover:text-red-200"
          >
            Clear
          </button>
        )}
      </div>
      {log.length === 0 ? (
        <div className="border border-dashed border-ink-600 rounded p-8 text-center text-slate-500 text-sm">
          Combat log is empty. Play a card, take damage, or end a turn to start logging.
        </div>
      ) : (
        <div className="space-y-1 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {log.map((entry) => (
            <LogLine key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function LogLine({ entry }: { entry: Character['combatLog'][number] }) {
  const tone: Record<string, string> = {
    play: 'text-accent-steel',
    basic: 'text-slate-300',
    react: 'text-purple-300',
    'turn-start': 'text-slate-500',
    'turn-end': 'text-slate-400',
    'round-end': 'text-slate-400',
    damage: 'text-red-300',
    heal: 'text-green-300',
    rest: 'text-slate-400',
    'status-add': 'text-accent-gold',
    'status-remove': 'text-slate-400',
    note: 'text-slate-300',
  };
  return (
    <div className="flex gap-3 py-1 px-2 text-sm border-l-2 border-ink-700 hover:bg-ink-900 rounded">
      <span className="w-14 shrink-0 font-mono text-xs text-slate-500">R{entry.round}·T{entry.turn}</span>
      <span className={cn('flex-1', tone[entry.kind] || 'text-slate-200')}>{entry.text}</span>
    </div>
  );
}

const INVENTORY_KINDS: InventoryItem['kind'][] = ['weapon', 'armor', 'consumable', 'enhancement', 'gear', 'other'];

function InventoryTab({ c, onChange }: { c: Character; onChange: (p: Partial<Character>) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{ name: string; kind: InventoryItem['kind']; effect: string; qty: string }>({
    name: '', kind: 'weapon', effect: '', qty: '1',
  });

  const addItem = () => {
    if (!draft.name.trim()) return;
    const item: InventoryItem = {
      id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()),
      name: draft.name.trim(),
      kind: draft.kind,
      effect: draft.effect.trim(),
      qty: Math.max(1, parseInt(draft.qty, 10) || 1),
      equipped: draft.kind === 'weapon' || draft.kind === 'armor' || draft.kind === 'enhancement',
    };
    onChange({ inventory: [...c.inventory, item] });
    setDraft({ name: '', kind: 'weapon', effect: '', qty: '1' });
    setAdding(false);
  };

  const update = (id: string, patch: Partial<InventoryItem>) =>
    onChange({ inventory: c.inventory.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

  const remove = (id: string) =>
    onChange({ inventory: c.inventory.filter((i) => i.id !== id) });

  const grouped = INVENTORY_KINDS
    .map((kind) => ({ kind, items: c.inventory.filter((i) => i.kind === kind) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-display text-xl text-accent-gold">Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Items don't grant cards — they modify cards already in your hand. Use the effect field to note bonuses (e.g. &quot;+2 to Melee Attack cards&quot;).
          </p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="px-3 py-1.5 text-sm rounded bg-accent-gold text-ink-900 font-display font-bold hover:bg-yellow-300"
          >
            + Add item
          </button>
        )}
      </div>

      {adding && (
        <div className="bg-ink-900 border border-ink-700 rounded p-4 space-y-2">
          <div className="grid sm:grid-cols-[2fr_1fr_80px] gap-2">
            <input
              autoFocus
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Item name"
              className="bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-3 py-2 text-sm text-slate-100"
            />
            <select
              value={draft.kind}
              onChange={(e) => setDraft((d) => ({ ...d, kind: e.target.value as InventoryItem['kind'] }))}
              aria-label="Item kind"
              className="bg-ink-800 border border-ink-700 rounded px-2 py-2 text-sm text-slate-100"
            >
              {INVENTORY_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <input
              inputMode="numeric"
              value={draft.qty}
              onChange={(e) => setDraft((d) => ({ ...d, qty: e.target.value }))}
              placeholder="Qty"
              className="bg-ink-800 border border-ink-700 rounded px-2 py-2 text-center text-sm text-slate-100"
            />
          </div>
          <textarea
            value={draft.effect}
            onChange={(e) => setDraft((d) => ({ ...d, effect: e.target.value }))}
            placeholder="Effect / modifier (e.g. &quot;+3 damage to Attack cards&quot;, &quot;reduce one Tier 2 card to 1 AP once per combat&quot;)"
            rows={2}
            className="w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-3 py-2 text-sm text-slate-100"
          />
          <div className="flex gap-2">
            <button type="button" onClick={addItem} className="px-4 py-1.5 text-sm rounded bg-accent-gold text-ink-900 font-display font-bold hover:bg-yellow-300">
              Add
            </button>
            <button type="button" onClick={() => { setAdding(false); setDraft({ name: '', kind: 'weapon', effect: '', qty: '1' }); }} className="px-4 py-1.5 text-sm rounded border border-ink-600 text-slate-300 hover:bg-ink-800">
              Cancel
            </button>
          </div>
        </div>
      )}

      {c.inventory.length === 0 && !adding ? (
        <div className="border border-dashed border-ink-600 rounded p-10 text-center text-slate-500 text-sm">
          No items yet. Click <span className="text-accent-gold">Add item</span> to start your loadout.
        </div>
      ) : (
        grouped.map(({ kind, items }) => (
          <div key={kind}>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-display">
              {kind} <span className="text-slate-600">· {items.length}</span>
            </div>
            <div className="space-y-1.5">
              {items.map((item) => (
                <InventoryRow
                  key={item.id}
                  item={item}
                  onUpdate={(patch) => update(item.id, patch)}
                  onRemove={() => remove(item.id)}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function InventoryRow({ item, onUpdate, onRemove }: {
  item: InventoryItem;
  onUpdate: (patch: Partial<InventoryItem>) => void;
  onRemove: () => void;
}) {
  const canEquip = item.kind === 'weapon' || item.kind === 'armor' || item.kind === 'enhancement';
  return (
    <div className={cn(
      'bg-ink-900 border rounded p-3 transition',
      item.equipped ? 'border-accent-gold/40' : 'border-ink-700',
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <input
              value={item.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              aria-label={`${item.name} name`}
              className="bg-transparent border-b border-transparent hover:border-ink-600 focus:border-accent-gold outline-none font-display font-bold text-slate-100 flex-1 min-w-0"
            />
            {item.qty > 1 && (
              <span className="text-xs font-mono bg-ink-800 border border-ink-700 text-slate-300 px-1.5 py-0.5 rounded">
                ×{item.qty}
              </span>
            )}
          </div>
          {item.effect && (
            <div className="text-xs text-slate-400 mt-1 leading-snug">{item.effect}</div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {canEquip && (
            <button
              type="button"
              onClick={() => onUpdate({ equipped: !item.equipped })}
              className={cn(
                'px-2 py-1 text-[10px] font-display uppercase tracking-wider rounded transition',
                item.equipped
                  ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
                  : 'bg-ink-800 text-slate-400 border border-ink-700 hover:text-slate-200',
              )}
              title={item.equipped ? 'Unequip' : 'Equip'}
            >
              {item.equipped ? '✓ Equipped' : 'Equip'}
            </button>
          )}
          {item.kind === 'consumable' && item.qty > 0 && (
            <button
              type="button"
              onClick={() => onUpdate({ qty: Math.max(0, item.qty - 1) })}
              className="px-2 py-1 text-[10px] font-display uppercase tracking-wider rounded bg-ink-700 text-slate-200 hover:bg-ink-600"
              title="Consume one"
            >
              Use
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Delete ${item.name}`}
            className="px-2 py-1 text-xs rounded text-slate-500 hover:text-red-300"
          >
            ×
          </button>
        </div>
      </div>
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

function VitalsRow({ label, cur, max, onCur, onMax, color, note }: {
  label: string; cur: number; max: number;
  onCur: (v: number) => void; onMax: (v: number) => void;
  color: string;
  note?: string;
}) {
  return (
    <div className="mb-3">
      <div className={cn('text-xs uppercase tracking-wider font-bold font-display flex items-center justify-between', color)}>
        <span>{label}</span>
        {note && <span className="text-[10px] font-normal text-red-300 normal-case">{note}</span>}
      </div>
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
