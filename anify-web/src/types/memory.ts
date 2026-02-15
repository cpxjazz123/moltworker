export type MemoryCategory = 'conversation' | 'adventure' | 'achievement' | 'special';

export interface Memory {
  id: string;
  title: string;
  description: string;
  category: MemoryCategory;
  timestamp: Date;
  thumbnail?: string;
  characterName?: string;
  location?: string;
  isFavorite: boolean;
  isNew: boolean;
  content?: string;
}

export interface MemoryFilters {
  category: MemoryCategory | 'all';
  favoriteOnly: boolean;
  search?: string;
}
