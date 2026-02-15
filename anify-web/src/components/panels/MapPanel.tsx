import { AnimatePresence, motion } from 'motion/react';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

import type { Location } from '@/types/location';
import { useWorld } from '@/contexts/WorldContext';
import { useLocations } from '@/hooks/useLocations';
import { useMapStore } from '@/stores/mapStore';

import { RegionMapView } from '../map/RegionMapView';
import { WorldMapView } from '../map/WorldMapView';

interface MapPanelProps {
  onClose?: () => void;
}

export function MapPanel({ onClose }: MapPanelProps) {
  const navigate = useNavigate();
  const [loadingWorldId, setLoadingWorldId] = useState<string | null>(null);

  const {
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

  useEffect(() => {
    return () => closeMap();
  }, [closeMap]);

  const handleClose = useCallback(() => {
    closeMap();
    onClose?.();
  }, [closeMap, onClose]);

  const handleSwitchWorld = useCallback(async (worldId: string) => {
    setLoadingWorldId(worldId);
    try {
      await loadWorld(worldId);
      selectWorld(worldId);
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
    } catch (error) {
      console.error('Failed to load world:', error);
    } finally {
      setLoadingWorldId(null);
    }
  }, [loadWorld, selectWorld]);

  const handleSelectLocation = useCallback(async (location: Location) => {
    selectLocation(location.id);
    handleClose();

    if (location.type === 'town') {
      navigate({ to: '/explore', search: { area: location.id, world: location.worldId } });
    } else {
      navigate({ to: '/adventure', search: { area: location.id, world: location.worldId } });
    }
  }, [selectLocation, handleClose, navigate]);

  const handleBackFromRegion = () => {
    zoomOut();
  };

  return (
    <div className="relative h-[80vh] overflow-hidden">
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
    </div>
  );
}
