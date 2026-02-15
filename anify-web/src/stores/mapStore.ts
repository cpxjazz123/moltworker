import { create } from 'zustand';

import type { MapZoomLevel } from '@/types';

interface MapStore {
  // State
  zoomLevel: MapZoomLevel;
  selectedWorldId: string | null;
  selectedLocationId: string | null;
  isOpen: boolean;
  canTravel: boolean;

  // Actions
  openMap: (canTravel?: boolean) => void;
  closeMap: () => void;
  setZoomLevel: (level: MapZoomLevel) => void;
  selectWorld: (worldId: string | null) => void;
  selectLocation: (locationId: string | null) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

const initialState = {
  zoomLevel: 'world' as MapZoomLevel,
  selectedWorldId: null,
  selectedLocationId: null,
  isOpen: false,
  canTravel: false,
};

export const useMapStore = create<MapStore>((set, get) => ({
  ...initialState,

  openMap: (canTravel = false) => set({ isOpen: true, canTravel }),

  closeMap: () => set({ isOpen: false }),

  setZoomLevel: (level) => set({ zoomLevel: level }),

  selectWorld: (worldId) => set({
    selectedWorldId: worldId,
    selectedLocationId: null,
    zoomLevel: worldId ? 'region' : 'world',
  }),

  selectLocation: (locationId) => set({
    selectedLocationId: locationId,
    zoomLevel: locationId ? 'town' : get().zoomLevel,
  }),

  zoomIn: () => {
    const { zoomLevel, selectedWorldId, selectedLocationId } = get();
    if (zoomLevel === 'world' && selectedWorldId) {
      set({ zoomLevel: 'region' });
    } else if (zoomLevel === 'region' && selectedLocationId) {
      set({ zoomLevel: 'town' });
    }
  },

  zoomOut: () => {
    const { zoomLevel } = get();
    if (zoomLevel === 'town') {
      set({ zoomLevel: 'region', selectedLocationId: null });
    } else if (zoomLevel === 'region') {
      set({ zoomLevel: 'world', selectedWorldId: null });
    }
  },

  reset: () => set(initialState),
}));
