import { useCallback, useEffect, useState } from 'react';
import type { Character } from '@/data/types';
import { migrateCharacter } from '@/lib/utils';

const KEY = 'tesshari:characters:v1';

function read(): Character[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((c: any) => migrateCharacter(c));
  } catch {
    return [];
  }
}

function write(chars: Character[]) {
  localStorage.setItem(KEY, JSON.stringify(chars));
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setCharacters(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const mutate = useCallback((updater: (prev: Character[]) => Character[]) => {
    setCharacters((prev) => {
      const next = updater(prev);
      write(next);
      return next;
    });
  }, []);

  const add = useCallback(
    (c: Character) => mutate((prev) => [...prev, c]),
    [mutate],
  );
  const update = useCallback(
    (id: string, patch: Partial<Character>) =>
      mutate((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c)),
      ),
    [mutate],
  );
  const remove = useCallback(
    (id: string) => mutate((prev) => prev.filter((c) => c.id !== id)),
    [mutate],
  );
  const duplicate = useCallback(
    (id: string): string | null => {
      let newId: string | null = null;
      mutate((prev) => {
        const src = prev.find((c) => c.id === id);
        if (!src) return prev;
        newId = (crypto.randomUUID?.() ?? String(Date.now()));
        const now = new Date().toISOString();
        const copy: Character = {
          ...src,
          id: newId,
          name: `${src.name} (copy)`,
          createdAt: now,
          updatedAt: now,
        };
        return [...prev, copy];
      });
      return newId;
    },
    [mutate],
  );

  const get = useCallback((id: string) => characters.find((c) => c.id === id), [characters]);

  return { characters, add, update, remove, duplicate, get };
}
