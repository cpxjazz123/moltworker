import type { TownInteractionPoint } from '@/types/world-metadata';
import { InteractionPointMarker } from './InteractionPointMarker';

interface TownMapProps {
    backgroundUrl: string;
    points: TownInteractionPoint[];
    onPointClick: (point: TownInteractionPoint) => void;
}

export function TownMap({ backgroundUrl, points, onPointClick }: TownMapProps) {
    return (
        <div className="relative w-full h-full overflow-hidden bg-black">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
            >
                <div className="absolute inset-0 bg-black/30" /> {/* Overlay for better contrast */}
            </div>

            {/* Interaction Points */}
            <div className="absolute inset-0">
                {points.map(point => (
                    <InteractionPointMarker
                        key={point.id}
                        point={point}
                        onClick={onPointClick}
                    />
                ))}
            </div>
        </div>
    );
}
