import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CLASSES, CLASS_DOCS, CLASS_FLAVOR, SUBCLASS_BY_CLASS, SUBCLASS_FLAVOR } from '@/data/generated';
import { SkillTree } from '@/components/SkillTree';
import { ClassDetail } from '@/components/ClassDetail';
import { cn } from '@/lib/utils';

interface Props {
  initialClass?: string;
}

type RefTab = 'overview' | 'tree' | 'details';

export function ClassReference({ initialClass }: Props) {
  const [selected, setSelected] = useState<string>(initialClass || CLASSES[0] || 'Tesshari Overview');
  const [tab, setTab] = useState<RefTab>('overview');
  const [query, setQuery] = useState('');

  const keys = useMemo(() => {
    const list = [...CLASSES as readonly string[]];
    if (CLASS_DOCS['Tesshari Overview']) list.unshift('Tesshari Overview');
    return list;
  }, []);

  const filteredKeys = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return keys;
    return keys.filter((k) => {
      if (k.toLowerCase().includes(q)) return true;
      const flavor = CLASS_FLAVOR[k] || '';
      return flavor.toLowerCase().includes(q);
    });
  }, [keys, query]);

  const doc = CLASS_DOCS[selected];
  const isClass = CLASSES.includes(selected as (typeof CLASSES)[number]);

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      <aside className="md:sticky md:top-20 md:self-start">
        <div className="bg-ink-900 border border-ink-700 rounded-lg overflow-hidden">
          <div className="bg-ink-600 px-3 py-2 font-display text-accent-gold text-xs uppercase tracking-wider">
            Index
          </div>
          <div className="p-2 border-b border-ink-700">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              className="w-full bg-ink-800 border border-ink-700 focus:border-accent-gold outline-none rounded px-2 py-1.5 text-xs text-slate-100"
            />
          </div>
          <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
            {filteredKeys.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-500 italic">No matches for “{query}”.</div>
            ) : (
              filteredKeys.map((k) => (
                <button
                  type="button"
                  key={k}
                  onClick={() => setSelected(k)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm border-l-2 transition',
                    selected === k
                      ? 'bg-ink-700 border-accent-gold text-accent-gold'
                      : 'border-transparent text-slate-300 hover:bg-ink-800 hover:text-slate-100',
                  )}
                >
                  {k}
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      <article className="bg-ink-900 border border-ink-700 rounded-lg p-6">
        {/* Header + class-specific tab switcher */}
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-3xl text-accent-gold">{selected}</h1>
            {isClass && CLASS_FLAVOR[selected] && (
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{CLASS_FLAVOR[selected]}</p>
            )}
          </div>
          {isClass && (
            <div
              role="tablist"
              aria-label="Reference view"
              className="inline-flex bg-ink-800 border border-ink-700 rounded overflow-hidden shrink-0"
            >
              {(['overview', 'tree', 'details'] as RefTab[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  role="tab"
                  aria-selected={tab === t ? 'true' : 'false'}
                  onClick={() => setTab(t)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-display uppercase tracking-wider transition',
                    tab === t ? 'bg-ink-600 text-accent-gold' : 'text-slate-400 hover:text-slate-200',
                  )}
                >
                  {t === 'tree' ? 'Skill Tree' : t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab content */}
        {!isClass || tab === 'overview' ? (
          doc ? (
            <>
              <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-accent-gold prose-h1:hidden prose-h2:text-2xl prose-h3:text-lg prose-strong:text-accent-gold prose-a:text-accent-steel prose-li:my-0 prose-ul:my-2">
                <ReactMarkdown>{doc}</ReactMarkdown>
              </div>
              {SUBCLASS_BY_CLASS[selected] && (
                <div className="mt-8 pt-6 border-t border-ink-700">
                  <h3 className="font-display text-xl text-accent-gold mb-3">Subclass Paths</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SUBCLASS_BY_CLASS[selected].map((p) => {
                      const key = `${selected} — ${p}`;
                      const flavor = SUBCLASS_FLAVOR[key];
                      return (
                        <div key={p} className="bg-ink-800 border border-ink-700 rounded p-3">
                          <div className="font-display font-bold text-accent-gold">{p}</div>
                          {flavor && <div className="text-sm text-slate-400 mt-1 leading-snug">{flavor}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-slate-400">No document found for {selected}.</div>
          )
        ) : tab === 'tree' ? (
          <SkillTree className={selected} />
        ) : (
          <ClassDetail className={selected} />
        )}
      </article>
    </div>
  );
}
