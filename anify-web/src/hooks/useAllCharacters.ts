import { useEffect, useState, useCallback } from "react";

import { useCharacters, type CharacterInfo } from "@/hooks/useCharacters";

const PLACEHOLDER_PORTRAIT = "/Character_sample.png";

// All known world IDs — must match useWorldLoader.ts
const WORLD_IDS = ["official-intro", "anthromyth"];

interface CharactersFile {
  characters: Array<{
    id: string;
    name: string;
    title?: string;
    description: string;
    portrait?: string;
    role: string;
    location?: string;
    baseFavorability: number;
    greeting?: string;
  }>;
}

/**
 * Fetch characters from all worlds, merged with current world characters.
 * Deduplicates by id, current world characters take priority.
 * All portraits are replaced with placeholder for now.
 */
export function useAllCharacters() {
  const { characters: currentWorldChars } = useCharacters();
  const [allChars, setAllChars] = useState<CharacterInfo[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      const results: CharacterInfo[] = [];

      await Promise.all(
        WORLD_IDS.map(async (worldId) => {
          try {
            const res = await fetch(`/worlds/${worldId}/characters.json`);
            if (!res.ok) return;
            const data: CharactersFile = await res.json();
            for (const c of data.characters) {
              results.push({
                id: c.id,
                name: c.name,
                title: c.title,
                description: c.description,
                portrait: PLACEHOLDER_PORTRAIT,
                role: c.role as CharacterInfo["role"],
                location: c.location,
                favorability: c.baseFavorability,
                greeting: c.greeting,
              });
            }
          } catch {
            // Skip worlds that fail to load
          }
        })
      );

      if (!cancelled) {
        // Deduplicate: current world characters take priority
        const currentIds = new Set(currentWorldChars.map((c) => c.id));
        const merged = [
          ...currentWorldChars.map((c) => ({
            ...c,
            portrait: PLACEHOLDER_PORTRAIT,
          })),
          ...results.filter((c) => !currentIds.has(c.id)),
        ];
        setAllChars(merged);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [currentWorldChars]);

  const getCharacter = useCallback(
    (id: string): CharacterInfo | undefined => {
      return allChars.find((c) => c.id === id);
    },
    [allChars]
  );

  return { characters: allChars, getCharacter };
}
