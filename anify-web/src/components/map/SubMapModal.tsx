import { motion } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import type { TownInteractionPoint, TownInteractionAction } from '@/types/world-metadata';
import { useNavigate } from '@tanstack/react-router';

interface SubMapModalProps {
    point: TownInteractionPoint;
    onClose: () => void;
}

export function SubMapModal({ point, onClose }: SubMapModalProps) {
    const navigate = useNavigate();

    const handleAction = (action: TownInteractionAction) => {
        if (action.type === 'travel' && action.target) {
            navigate({ to: '/town/$townId', params: { townId: action.target } });
            onClose();
        } else if (action.type === 'adventure') {
            // For now, just log or maybe navigate to an adventure placeholder
            console.log('Starting adventure:', action.target);
            // TODO: Navigate to adventure route when ready
        }
        // Implement other actions like 'adventure' later
        console.log('Action triggered:', action);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${point.subMap.background})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white/70 hover:bg-black/60 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-2">{point.name}</h2>
                        <p className="text-white/80 text-lg mb-8 max-w-2xl">{point.subMap.intro}</p>

                        <div className="flex flex-wrap gap-4">
                            {point.actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAction(action)}
                                    className="
                                        flex items-center gap-2 px-6 py-3
                                        bg-white/10 hover:bg-white/20
                                        backdrop-blur-md rounded-xl
                                        text-white font-medium
                                        border border-white/10 hover:border-white/30
                                        transition-all duration-200
                                    "
                                >
                                    {action.label}
                                    {action.type === 'travel' && <ArrowRight className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
