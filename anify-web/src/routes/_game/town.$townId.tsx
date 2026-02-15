import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useWorldTowns, useWorldTownInteractions } from '@/contexts/WorldContext';
import type { TownInteractionPoint } from '@/types/world-metadata';
import { TownMap } from '@/components/map/TownMap';
import { SubMapModal } from '@/components/map/SubMapModal';

export const Route = createFileRoute('/_game/town/$townId')({
    component: TownPage,
});

function TownPage() {
    const { townId } = Route.useParams();
    const towns = useWorldTowns();
    const interactions = useWorldTownInteractions(townId);
    const town = towns.find(t => t.id === townId);
    const [selectedPoint, setSelectedPoint] = useState<TownInteractionPoint | null>(null);

    // Reset selected point when town changes
    useEffect(() => {
        setSelectedPoint(null);
    }, [townId]);

    if (!town) {
        return <div className="flex items-center justify-center h-screen text-white">Town not found</div>;
    }

    return (
        <div className="relative w-full h-screen">
            <TownMap
                backgroundUrl={town.background}
                points={interactions}
                onPointClick={setSelectedPoint}
            />

            <AnimatePresence>
                {selectedPoint && (
                    <SubMapModal
                        point={selectedPoint}
                        onClose={() => setSelectedPoint(null)}
                    />
                )}
            </AnimatePresence>

            {/* Town Name Overlay */}
            <div className="absolute top-8 left-8 pointer-events-none">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">{town.name}</h1>
                <p className="text-white/80 text-lg drop-shadow-md mt-2">{town.description}</p>
            </div>
        </div>
    );
}
