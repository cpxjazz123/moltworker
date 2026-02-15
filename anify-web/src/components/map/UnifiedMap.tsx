// ... existing imports
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Location } from '@/types/location';
import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useWorld } from '@/contexts/WorldContext';
import { useLocations } from '@/hooks/useLocations';
import { useMapStore } from '@/stores/mapStore';

import { RegionMapView } from './RegionMapView';
import { WorldMapView } from './WorldMapView';

export function UnifiedMap() {
  const navigate = useNavigate();
  const [loadingWorldId, setLoadingWorldId] = useState<string | null>(null);

  const {
    isOpen,
    zoomLevel,
    selectedWorldId,
    selectedLocationId,
    closeMap,
    selectWorld,
    selectLocation,
    zoomOut,
  } = useMapStore();

  const { loadWorld } = useWorld();
  const { worlds, locations } = useLocations();

  const selectedWorld = worlds.find((w) => w.id === selectedWorldId);

  // Separate handler for switching worlds inside the map (doesn't close map/navigate)
  const handleSwitchWorld = useCallback(async (worldId: string) => {
    setLoadingWorldId(worldId);
    try {
      await loadWorld(worldId);
      selectWorld(worldId); // This updates the store, UnifiedMap re-renders with new world
    } catch (error) {
      console.error('Failed to switch world:', error);
    } finally {
      setLoadingWorldId(null);
    }
  }, [loadWorld, selectWorld]);

  const handleSelectWorld = useCallback(async (worldId: string) => {
    setLoadingWorldId(worldId);

    try {
      await loadWorld(worldId);
      selectWorld(worldId);
      // Removed closeMap() and navigate() to keep map open when selecting from main list
      // If the intention of the MAIN list was to just open the region map, we are good.
      // If it was to fast travel, we should check requirements.
      // Assuming behavior: main list -> opens region map.
    } catch (error) {
      console.error('Failed to load world:', error);
    } finally {
      setLoadingWorldId(null);
    }
  }, [loadWorld, selectWorld]);

  const handleSelectLocation = useCallback(async (location: Location) => {
    selectLocation(location.id);
    closeMap();

    if (location.type === 'town') {
      navigate({ to: '/explore', search: { area: location.id, world: location.worldId } });
    } else {
      navigate({ to: '/adventure', search: { area: location.id, world: location.worldId } });
    }
  }, [selectLocation, closeMap, navigate]);

  const handleBackFromRegion = () => {
    zoomOut();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeMap}
          />

          {/* Map container */}
          <motion.div
            className="relative w-[90vw] h-[80vh] max-w-4xl bg-black/80 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={closeMap}
              className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Map content */}
            <AnimatePresence mode="wait">
              {zoomLevel === 'world' ? (
                <motion.div
                  key="world"
                  className="w-full h-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <WorldMapView
                    worlds={worlds}
                    onSelectWorld={handleSelectWorld}
                    loadingWorldId={loadingWorldId}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="region"
                  className="w-full h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <RegionMapView
                    world={selectedWorld}
                    locations={locations}
                    selectedLocationId={selectedLocationId}
                    onSelectLocation={handleSelectLocation}
                    onBack={handleBackFromRegion}
                    availableWorlds={worlds}
                    onSelectWorld={handleSwitchWorld}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
