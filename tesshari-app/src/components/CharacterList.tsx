import { useMemo, useState } from 'react';
import type { Character } from '@/data/types';
import { cn, fmtDate } from '@/lib/utils';

type SortKey = 'updated' | 'created' | 'name' | 'level';

interface Props {
  characters: Character[];
  onNew: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
}

export function CharacterList({
  characters,
  onNew,
  onOpen,
  onDelete,
  onDuplicate,
  onExport,
  onImport,
}: Props) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('updated');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? characters.filter((c) =>
          [c.name, c.species, c.className, c.subclassPath].some((s) =>
            s.toLowerCase().includes(q),
          ),
        )
      : characters.slice();
    switch (sort) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'level':
        list.sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
        break;
      case 'created':
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    return list;
  }, [characters, query, sort]);

  return (
    <div>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-accent-gold">Your Characters</h1>
          <p className="text-sm text-slate-400 mt-1">
            {characters.length === 0
              ? 'No characters yet. Create your first.'
              : `${characters.length} saved in this browser${filtered.length !== characters.length ? ` · ${filtered.length} shown` : ''}.`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {onImport && (
            <label className="px-3 py-2 rounded border border-ink-600 text-sm text-slate-300 hover:bg-ink-800 cursor-pointer font-display">
              Import JSON
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImport(f);
                  e.target.value = '';
                }}
              />
            </label>
          )}
          {onExport && characters.length > 0 && (
            <button
              type="button"
              onClick={onExport}
              className="px-3 py-2 rounded border border-ink-600 text-sm text-slate-300 hover:bg-ink-800 font-display"
            >
              Export all
            </button>
          )}
          <button
            type="button"
            onClick={onNew}
            className="px-5 py-3 rounded bg-accent-gold text-ink-900 font-display font-bold hover:bg-yellow-300 transition"
          >
            + New Character
          </button>
        </div>
      </div>

      {characters.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, class, species…"
            className="flex-1 min-w-[200px] bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-3 py-2 text-sm text-slate-100"
          />
          <div className="inline-flex bg-ink-800 border border-ink-700 rounded overflow-hidden">
            {(['updated', 'name', 'level', 'created'] as SortKey[]).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setSort(k)}
                className={cn(
                  'px-3 py-2 text-xs font-display uppercase tracking-wider transition',
                  sort === k ? 'bg-ink-600 text-accent-gold' : 'text-slate-400 hover:text-slate-200',
                )}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {characters.length === 0 ? (
        <div className="border border-dashed border-ink-600 rounded-lg p-16 text-center">
          <div className="font-display text-lg text-slate-300">Nothing here yet</div>
          <p className="text-slate-400 text-sm mt-2">
            Click <span className="text-accent-gold">New Character</span> to walk through creation.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-ink-600 rounded-lg p-12 text-center text-slate-500 text-sm">
          No characters match “{query}”.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id} className="border border-ink-700 bg-ink-900 rounded-lg p-4 flex flex-col">
              <div className="flex-1">
                <div className="font-display text-xl text-slate-100">{c.name}</div>
                <div className="text-sm text-slate-400 mt-1">
                  <span className="text-accent-gold">{c.species}</span>
                  {' · '}
                  <span className="text-accent-gold">{c.className}</span>
                  {c.subclassPath && <> · <span className="text-accent-steel">{c.subclassPath}</span></>}
                </div>
                <div className="text-xs text-slate-500 mt-2">Level {c.level} · {fmtDate(c.updatedAt)}</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => onOpen(c.id)}
                  className="flex-1 px-3 py-2 text-sm rounded bg-ink-600 hover:bg-ink-500 font-display"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicate(c.id)}
                  aria-label={`Duplicate ${c.name}`}
                  title="Duplicate"
                  className="px-3 py-2 text-sm rounded bg-ink-800 border border-ink-700 hover:bg-ink-700 text-slate-300"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  aria-label={`Delete ${c.name}`}
                  title="Delete"
                  className="px-3 py-2 text-sm rounded bg-ink-800 border border-ink-700 hover:bg-red-900 hover:border-red-700 text-slate-400 hover:text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
