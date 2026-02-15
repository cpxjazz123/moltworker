import { create } from 'zustand';

import type { PanelConfig, PanelType } from '@/types';

interface PanelStore {
  // State
  activePanel: PanelConfig | null;
  isOpen: boolean;

  // Actions
  openPanel: (panelType: PanelType, config?: Partial<Omit<PanelConfig, 'panelType'>>) => void;
  closePanel: () => void;
}

const initialState = {
  activePanel: null,
  isOpen: false,
};

export const usePanelStore = create<PanelStore>((set) => ({
  ...initialState,

  openPanel: (panelType, config = {}) =>
    set({
      activePanel: {
        panelType,
        ...config,
      },
      isOpen: true,
    }),

  closePanel: () =>
    set({
      isOpen: false,
      activePanel: null,
    }),
}));
