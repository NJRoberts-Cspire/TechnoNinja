import { useState } from 'react';
import { useCharacters } from '@/store/characters';
import { CharacterList } from '@/components/CharacterList';
import { CreationWizard } from '@/components/CreationWizard';
import { CharacterSheet } from '@/components/CharacterSheet';
import { ClassReference } from '@/components/ClassReference';
import { cn } from '@/lib/utils';

type View =
  | { kind: 'home' }
  | { kind: 'create' }
  | { kind: 'sheet'; id: string }
  | { kind: 'reference'; className?: string };

export default function App() {
  const chars = useCharacters();
  const [view, setView] = useState<View>({ kind: 'home' });

  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-slate-100">
      <TopBar view={view} setView={setView} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {view.kind === 'home' && (
          <CharacterList
            characters={chars.characters}
            onNew={() => setView({ kind: 'create' })}
            onOpen={(id) => setView({ kind: 'sheet', id })}
            onDelete={(id) => { if (confirm('Delete this character?')) chars.remove(id); }}
          />
        )}

        {view.kind === 'create' && (
          <CreationWizard
            onCancel={() => setView({ kind: 'home' })}
            onCreate={(c) => { chars.add(c); setView({ kind: 'sheet', id: c.id }); }}
          />
        )}

        {view.kind === 'sheet' && (() => {
          const c = chars.get(view.id);
          if (!c) return <div className="text-slate-400">Character not found.</div>;
          return (
            <CharacterSheet
              character={c}
              onChange={(patch) => chars.update(c.id, patch)}
              onOpenReference={(className) => setView({ kind: 'reference', className })}
            />
          );
        })()}

        {view.kind === 'reference' && (
          <ClassReference initialClass={view.className} />
        )}
      </main>

      <footer className="border-t border-ink-700 text-xs text-slate-500 py-3 text-center">
        Tesshari Character Builder · data saved in your browser · no account needed
      </footer>
    </div>
  );
}

function TopBar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const Btn = ({ label, kind, active }: { label: string; kind: View['kind']; active: boolean }) => (
    <button
      onClick={() => setView(kind === 'reference' ? { kind: 'reference' } : kind === 'create' ? { kind: 'create' } : { kind: 'home' })}
      className={cn(
        'px-4 py-2 text-sm font-display rounded border transition',
        active
          ? 'bg-ink-500 text-accent-gold border-ink-500'
          : 'bg-ink-800 text-slate-300 border-ink-700 hover:bg-ink-700 hover:text-slate-100',
      )}
    >
      {label}
    </button>
  );

  return (
    <header className="border-b border-ink-700 bg-ink-900 sticky top-0 z-10">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <button
          className="font-display text-xl tracking-wide text-accent-gold hover:text-yellow-200"
          onClick={() => setView({ kind: 'home' })}
        >
          TESSHARI
          <span className="ml-2 text-xs font-normal text-slate-400">character builder</span>
        </button>
        <nav className="flex gap-2">
          <Btn label="Characters" kind="home" active={view.kind === 'home' || view.kind === 'sheet'} />
          <Btn label="New" kind="create" active={view.kind === 'create'} />
          <Btn label="Reference" kind="reference" active={view.kind === 'reference'} />
        </nav>
      </div>
    </header>
  );
}
