import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    audioLevel: number;
    isActive: boolean;
    className?: string;
}

export function AudioVisualizer({ audioLevel, isActive, className = '' }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const barCount = 32;
        const barWidth = width / barCount;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            if (!isActive) {
                animationFrameRef.current = requestAnimationFrame(draw);
                return;
            }

            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)'); // Purple
            gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.6)');
            gradient.addColorStop(1, 'rgba(192, 132, 252, 0.4)');

            // Draw bars
            for (let i = 0; i < barCount; i++) {
                const x = i * barWidth;

                // Add some randomness for visual interest
                const randomFactor = 0.3 + Math.random() * 0.7;
                const barHeight = audioLevel * height * randomFactor;

                const y = (height - barHeight) / 2;

                ctx.fillStyle = gradient;
                ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
            }

            animationFrameRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [audioLevel, isActive]);

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={100}
            className={`rounded-lg ${className}`}
            style={{ width: '100%', height: '100px' }}
        />
    );
}
