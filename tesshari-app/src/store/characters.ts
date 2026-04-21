import { useEffect, useState } from 'react';
import type { Character } from '@/data/types';

const KEY = 'tesshari:characters:v1';

function read(): Character[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Migrate older records lacking new fields.
    return parsed.map((c: any) => ({
      unlockedCards: [],
      ...c,
    })) as Character[];
  } catch {
    return [];
  }
}

function write(chars: Character[]) {
  localStorage.setItem(KEY, JSON.stringify(chars));
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(() => read());

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setCharacters(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const save = (next: Character[]) => {
    setCharacters(next);
    write(next);
  };

  return {
    characters,
    add(c: Character) { save([...characters, c]); },
    update(id: string, patch: Partial<Character>) {
      save(characters.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c)));
    },
    remove(id: string) { save(characters.filter((c) => c.id !== id)); },
    get(id: string) { return characters.find((c) => c.id === id); },
  };
}
