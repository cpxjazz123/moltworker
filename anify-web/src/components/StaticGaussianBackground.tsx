import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';

import { SplatMeshComponent } from './GaussSplattingScene/SplatMeshComponent';

interface StaticGaussianBackgroundProps {
  splatUrl: string;
  cameraPosition?: { x: number; y: number; z: number };
  cameraTarget?: { x: number; y: number; z: number };
  className?: string;
}

/**
 * Renders a few frames then stops — used as a static 3D backdrop for
 * the adventure page. No player controller, no physics, no interaction.
 */
function StaticCameraSetup({
  position,
  target,
}: {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
}) {
  const { camera, invalidate } = useThree();
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(target.x, target.y, target.z);
    camera.updateProjectionMatrix();

    // Render a handful of frames so the splat has time to load & appear
    let frame = 0;
    const kick = () => {
      invalidate();
      frame++;
      if (frame < 120) requestAnimationFrame(kick);
    };
    kick();
  }, [camera, position, target, invalidate]);

  return null;
}

export function StaticGaussianBackground({
  splatUrl,
  cameraPosition = { x: 0, y: 1.6, z: 5 },
  cameraTarget = { x: 0, y: 1, z: 0 },
  className = '',
}: StaticGaussianBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fade in after a short delay to let splat start rendering
    const timer = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <Canvas
        camera={{ far: 1000, fov: 60, near: 0.1 }}
        frameloop="demand"
        gl={{
          alpha: false,
          antialias: false,
          depth: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        <Suspense fallback={null}>
          <SplatMeshComponent url={splatUrl} />
          <StaticCameraSetup position={cameraPosition} target={cameraTarget} />
        </Suspense>
      </Canvas>
    </div>
  );
}
