// src/hooks/useCharacters.ts

import { useMemo, useCallback } from 'react';
import { useWorld, useWorldCharacters as useWorldCharactersContext } from '@/contexts/WorldContext';
import type { CharacterRole } from '@/types/world-metadata';

// ============================================================================
// Types
// ============================================================================

export interface CharacterWithRelationship {
  id: string;
  name: string;
  title?: string;
  description: string;
  portrait?: string;
  role: CharacterRole;
  location?: string;
  favorability: number;
  greeting?: string;
  relationship?: string;
}

export interface CharacterInfo {
  id: string;
  name: string;
  title?: string;
  description: string;
  portrait?: string;
  role: CharacterRole;
  location?: string;
  favorability: number;
  greeting?: string;
}

// Favorability level system
export interface FavorabilityLevel {
  level: string;
  icon: string;
  minValue: number;
  maxValue: number;
  color: string;
}

export const favorabilityLevels: FavorabilityLevel[] = [
  { level: '敌意', icon: '💔', minValue: 0, maxValue: 19, color: 'text-red-500' },
  { level: '冷淡', icon: '🖤', minValue: 20, maxValue: 39, color: 'text-gray-400' },
  { level: '中立', icon: '🤍', minValue: 40, maxValue: 59, color: 'text-white/70' },
  { level: '友好', icon: '💛', minValue: 60, maxValue: 79, color: 'text-yellow-400' },
  { level: '亲密', icon: '🧡', minValue: 80, maxValue: 89, color: 'text-orange-400' },
  { level: '挚爱', icon: '❤️', minValue: 90, maxValue: 100, color: 'text-pink-500' },
];

export function getFavorabilityLevel(value: number): FavorabilityLevel {
  const clampedValue = Math.max(0, Math.min(100, value));
  return (
    favorabilityLevels.find(
      (level) => clampedValue >= level.minValue && clampedValue <= level.maxValue
    ) || favorabilityLevels[2] // Default to 中立
  );
}

export function getFavorabilityColor(value: number): string {
  if (value < 20) return 'from-red-500 to-red-400';
  if (value < 40) return 'from-gray-500 to-gray-400';
  if (value < 60) return 'from-white/60 to-white/40';
  if (value < 80) return 'from-yellow-500 to-yellow-400';
  if (value < 90) return 'from-orange-500 to-orange-400';
  return 'from-pink-500 to-pink-400';
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * 获取当前世界的角色列表
 */
export function useCharacters() {
  const characters = useWorldCharactersContext();
  const { getCharacter, currentWorld } = useWorld();

  const characterList: CharacterInfo[] = useMemo(() => {
    return characters.map(c => ({
      id: c.id,
      name: c.name,
      title: c.title,
      description: c.description,
      portrait: c.portrait,
      role: c.role,
      location: c.location,
      favorability: c.baseFavorability,
      greeting: c.greeting,
    }));
  }, [characters]);

  const getCharacterInfo = useCallback((characterId: string): CharacterInfo | undefined => {
    const char = getCharacter(characterId);
    if (!char) return undefined;

    return {
      id: char.id,
      name: char.name,
      title: char.title,
      description: char.description,
      portrait: char.portrait,
      role: char.role,
      location: char.location,
      favorability: char.baseFavorability,
      greeting: char.greeting,
    };
  }, [getCharacter]);

  // 按角色类型筛选
  const getCharactersByRole = useCallback((role: CharacterRole) => {
    return characterList.filter(c => c.role === role);
  }, [characterList]);

  // 获取指定地点的角色
  const getCharactersInLocation = useCallback((locationId: string) => {
    return characterList.filter(c => c.location === locationId);
  }, [characterList]);

  // 默认角色 (guide/companion)
  const defaultCharacter = useMemo(() => {
    if (!currentWorld?.world.defaultCharacter) return null;
    return getCharacterInfo(currentWorld.world.defaultCharacter) ?? null;
  }, [currentWorld, getCharacterInfo]);

  // 可招募的同伴
  const companions = useMemo(() => {
    return characterList.filter(c => c.role === 'companion');
  }, [characterList]);

  // 商人
  const merchants = useMemo(() => {
    return characterList.filter(c => c.role === 'merchant');
  }, [characterList]);

  return {
    characters: characterList,
    getCharacter: getCharacterInfo,
    getCharactersByRole,
    getCharactersInLocation,
    defaultCharacter,
    companions,
    merchants,
    loading: !currentWorld,
  };
}

/**
 * 获取世界角色列表 (API兼容层)
 * @deprecated Use useCharacters() instead
 */
export function useWorldCharacters(_worldId?: string) {
  const { characters, loading } = useCharacters();
  
  return {
    data: characters,
    isLoading: loading,
    error: null as Error | null,
  };
}

/**
 * 获取单个角色 (带关系状态)
 */
export function useCharacter(characterId: string | undefined, _worldId?: string) {
  const { getCharacter, currentWorld } = useWorld();
  
  const character = useMemo((): CharacterWithRelationship | null => {
    if (!characterId) return null;
    const char = getCharacter(characterId);
    if (!char) return null;
    
    const favLevel = getFavorabilityLevel(char.baseFavorability);
    
    return {
      id: char.id,
      name: char.name,
      title: char.title,
      description: char.description,
      portrait: char.portrait,
      role: char.role,
      location: char.location,
      favorability: char.baseFavorability,
      greeting: char.greeting,
      relationship: favLevel.level,
    };
  }, [characterId, getCharacter]);

  return {
    character,
    loading: !currentWorld,
    favorability: character?.favorability ?? 50,
    // API 兼容
    data: character,
    isLoading: !currentWorld,
  };
}
