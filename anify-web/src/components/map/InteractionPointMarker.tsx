import { motion } from 'motion/react';
import { MapPin, ShoppingBag, Swords, Coffee, Bus, MessageCircle } from 'lucide-react';
import type { TownInteractionPoint } from '@/types/world-metadata';

interface InteractionPointMarkerProps {
    point: TownInteractionPoint;
    onClick: (point: TownInteractionPoint) => void;
}

export function InteractionPointMarker({ point, onClick }: InteractionPointMarkerProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'shop': return <ShoppingBag className="w-6 h-6" />;
            case 'adventure': return <Swords className="w-6 h-6" />;
            case 'rest': return <Coffee className="w-6 h-6" />;
            case 'transport': return <Bus className="w-6 h-6" />;
            case 'npc': return <MessageCircle className="w-6 h-6" />;
            default: return <MapPin className="w-6 h-6" />;
        }
    };

    return (
        <motion.button
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{
                left: `${point.position.x}%`,
                top: `${point.position.y}%`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(point)}
        >
            <div className={`
                w-12 h-12 rounded-full
                bg-black/60 backdrop-blur-md border border-white/20
                flex items-center justify-center
                shadow-[0_0_15px_rgba(0,0,0,0.5)]
                group-hover:bg-white/10 group-hover:border-white/50
                transition-colors duration-300
            `}>
                <div className="text-white/90 group-hover:text-white drop-shadow-md">
                    {getIcon(point.type)}
                </div>
            </div>

            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                <div className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 text-sm text-white font-medium">
                    {point.name}
                </div>
            </div>
        </motion.button>
    );
}
