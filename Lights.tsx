import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Tier } from '../../hooks/useDeviceTier';
import { AimedSpot } from './parts';

function Skylight({ castShadow, size }: { castShadow: boolean; size: number }) {
  const ref = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    const light = ref.current;
    if (!light) return;
    light.target.position.set(0, 0, -22);
    light.target.updateMatrixWorld();
    const cam = light.shadow.camera;
    cam.left = -24;
    cam.right = 24;
    cam.top = 26;
    cam.bottom = -26;
    cam.near = 1;
    cam.far = 70;
    cam.updateProjectionMatrix();
    light.shadow.mapSize.set(size, size);
    light.shadow.bias = -0.0004;
    light.shadow.normalBias = 0.02;
  }, [size]);
  return <directionalLight ref={ref} position={[10, 30, -14]} intensity={0.9} color="#fff4e0" castShadow={castShadow} />;
}

/** Fényterv: tompa csarnokfény, homlokzatvilágítás kívül, erős felülvilágítás az autón. */
export default function Lights({ tier }: { tier: Tier }) {
  const shadows = tier === 'high';
  return (
    <>
      <hemisphereLight args={['#f4f1ea', '#121212', 0.45]} />
      <Skylight castShadow={shadows} size={2048} />
      {tier !== 'low' ? (
        <>
          <AimedSpot position={[-12, 0.4, 7]} target={[-9.5, 8, 0]} intensity={140} angle={0.55} penumbra={0.85} color="#fff1cf" />
          <AimedSpot position={[12, 0.4, 7]} target={[9.5, 8, 0]} intensity={140} angle={0.55} penumbra={0.85} color="#fff1cf" />
        </>
      ) : null}
      <pointLight position={[0, 7.4, -8]} intensity={30} distance={34} decay={1.5} color="#fff6e6" />
      <pointLight position={[0, 7.4, -22]} intensity={30} distance={34} decay={1.5} color="#fff6e6" />
      <pointLight position={[0, 7.4, -36]} intensity={30} distance={34} decay={1.5} color="#fff6e6" />
      <AimedSpot
        position={[0, 8.6, -19]}
        target={[0, 0.5, -19]}
        intensity={220}
        angle={0.48}
        penumbra={0.75}
        castShadow={shadows}
      />
    </>
  );
}
