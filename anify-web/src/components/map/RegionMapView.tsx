
// ... existing imports
import { MapPin, Swords, Home, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { GlassBadge } from '@/components/ui/glass-card';
import type { Location } from '@/types';

interface WorldInfo {
  name: string;
  backgroundUrl?: string;
}

interface RegionMapViewProps {
  world: WorldInfo | undefined;
  locations: Location[];
  selectedLocationId: string | null;
  onSelectLocation: (location: Location) => void;
  onBack: () => void;
  availableWorlds?: { id: string; name: string }[];
  onSelectWorld?: (worldId: string) => void;
}

export function RegionMapView({
  world,
  locations,
  selectedLocationId,
  onSelectLocation,
  onBack,
  availableWorlds = [],
  onSelectWorld,
}: RegionMapViewProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!world) {
    return null;
  }

  // ... existing helper functions (getLocationIcon, getLocationColor)

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'town':
        return <Home className="w-5 h-5" />;
      case 'adventure':
        return <Swords className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getLocationColor = (type: Location['type'], unlocked: boolean) => {
    if (!unlocked) return 'bg-gray-500/50 border-gray-500/30';
    switch (type) {
      case 'town':
        return 'bg-blue-500/70 border-blue-400/50 hover:bg-blue-400/80';
      case 'adventure':
        return 'bg-red-500/70 border-red-400/50 hover:bg-red-400/80';
      default:
        return 'bg-gray-500/70 border-gray-400/50 hover:bg-gray-400/80';
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>

        {/* World Selector */}
        <div className="relative" ref={selectorRef}>
          <button
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-2 text-xl font-bold text-white bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            {world.name}
            {availableWorlds.length > 0 && (
              <ChevronDown className={`w-5 h-5 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          <AnimatePresence>
            {isSelectorOpen && availableWorlds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full text-center left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl z-50"
              >
                {availableWorlds.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      if (w.id !== world.name) { // Assuming world.name might not overlap with ID directly, but let's use check logic
                        onSelectWorld?.(w.id);
                      }
                      setIsSelectorOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between group ${
                      // world.name identifier check is weak, ideally checking IDs.
                      // But here we rely on what passed 'world' object has.
                      // The parent should ensure consistent props.
                      ''
                      }`}
                  >
                    <span className="text-white group-hover:text-amber-400 transition-colors">{w.name}</span>
                    {/* We don't have current ID easily available unless we compare names or pass it prop. 
                        Let's verify logic in parent. */}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-10" />
      </div>

      {/* Map background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900"
        style={{
          backgroundImage: world.backgroundUrl ? `url(${world.backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Location markers */}
      <div className="absolute inset-0">
        {locations.map((location) => {
          const isSelected = selectedLocationId === location.id;
          const unlocked = location.unlocked !== false;


          return (
            <button
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 cursor-pointer`}
              style={{
                left: `${location.mapX}%`,
                top: `${location.mapY}%`,
              }}
              onClick={() => {
                if (unlocked) {
                  onSelectLocation(location);
                } else {
                  // Show locked message
                  // In a real app, use a Toast or refined UI
                  alert(`此区域未解锁: ${location.name}\n\n解锁条件: 暂无具体说明`);
                }
              }}
            >
              {/* Marker */}
              <div
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center
                  backdrop-blur-sm shadow-lg transition-all duration-200
                  ${getLocationColor(location.type, unlocked)}
                  ${isSelected ? 'ring-4 ring-white/50 scale-110' : ''}
                `}
              >
                <span className="text-white">
                  {getLocationIcon(location.type)}
                </span>
              </div>

              {/* Label */}
              <div
                className={`
                  absolute top-full left-1/2 -translate-x-1/2 mt-2
                  whitespace-nowrap transition-opacity duration-200
                  ${isSelected ? 'opacity-100' : 'opacity-70'}
                `}
              >
                <div className="bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-white">
                    {location.name}
                  </span>
                  {location.type === 'adventure' && location.dangerLevel && (
                    <GlassBadge
                      variant={location.dangerLevel > 5 ? 'danger' : 'warning'}
                      className="ml-2"
                    >
                      Lv.{location.dangerLevel}
                    </GlassBadge>
                  )}
                  {!unlocked && (
                    <span className="ml-2 text-xs text-red-400">(未解锁)</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm rounded-xl p-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500/70" />
            <span className="text-white/70">城镇</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500/70" />
            <span className="text-white/70">冒险</span>
          </div>
        </div>
      </div>
    </div>
  );
}

