import type { Character } from '@/data/types';
import { fmtDate } from '@/lib/utils';

interface Props {
  characters: Character[];
  onNew: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CharacterList({ characters, onNew, onOpen, onDelete }: Props) {
  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-accent-gold">Your Characters</h1>
          <p className="text-sm text-slate-400 mt-1">
            {characters.length === 0 ? 'No characters yet. Create your first.' : `${characters.length} saved in this browser.`}
          </p>
        </div>
        <button
          onClick={onNew}
          className="px-5 py-3 rounded bg-accent-gold text-ink-900 font-display font-bold hover:bg-yellow-300 transition"
        >
          + New Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="border border-dashed border-ink-600 rounded-lg p-16 text-center">
          <div className="font-display text-lg text-slate-300">Nothing here yet</div>
          <p className="text-slate-400 text-sm mt-2">
            Click <span className="text-accent-gold">New Character</span> to walk through creation.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => (
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
                  onClick={() => onOpen(c.id)}
                  className="flex-1 px-3 py-2 text-sm rounded bg-ink-600 hover:bg-ink-500 font-display"
                >
                  Open
                </button>
                <button
                  onClick={() => onDelete(c.id)}
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
