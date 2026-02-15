import { useFrame, useThree } from "@react-three/fiber";
import { SplatMesh } from "@sparkjsdev/spark";
import { useEffect, useMemo } from "react";

interface SplatMeshProps {
  downsample?: number;
  url: string;
}

export function SplatMeshComponent({ downsample = 2, url }: SplatMeshProps) {
  const splatMesh = useMemo(
    () =>
      new SplatMesh({
        downsample,
        url,
        worker: true,
      } as any) as any,
    [url, downsample],
  );
  const { camera } = useThree();

  // Set initial quaternion for correct orientation
  useEffect(() => {
    splatMesh.quaternion.set(1, 0, 0, 0);
  }, [splatMesh]);

  useFrame((_state, delta) => {
    splatMesh.update?.({
      deltaTime: delta,
      globalEdits: [],
      time: performance.now() / 1000,
      viewToWorld: camera.matrixWorld,
    });
  });

  useEffect(() => () => {
      splatMesh.dispose?.();
    }, [splatMesh]);

  return <primitive object={splatMesh} />;
}
