import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { chapterById, chapterProgress } from '../../data/journey';
import { journey } from '../../lib/journeyStore';
import { ease } from '../../lib/math';
import { getMaterials } from './materials';
import { Flag } from './parts';
import type { SceneTextures } from './textures';
import { HALL } from './world';

const intro = chapterById('intro');
const STRIP_X = [-9, 0, 9];
const STRIP_Z = [-5, -12, -19, -26, -33, -40];
const TRUSS_Z = [-3, -8.5, -14, -19.5, -25, -30.5, -36, -41.5];
const PILASTER_Z = [-5.5, -16.5, -27.5, -38.5];
const EXIT_PANELS = [-1.8, -0.6, 0.6, 1.8];

/** A fehér üzemcsarnok kívül-belül: homlokzat, bejárati ajtó, belső tér és a hátsó kapu. */
export default function Building({ tex }: { tex: SceneTextures }) {
  const m = getMaterials();
  const leftDoor = useRef<THREE.Group>(null);
  const rightDoor = useRef<THREE.Group>(null);
  const exitDoor = useRef<THREE.Group>(null);
  const exitLight = useRef<THREE.PointLight>(null);

  const walls = useMemo(() => {
    const { facade: f, interior: i, roof: r } = m;
    return {
      front: [f, f, f, f, f, i],
      left: [i, f, f, f, f, f],
      right: [f, i, f, f, f, f],
      back: [f, f, f, f, i, f],
      ceiling: [r, r, r, i, r, r],
    };
  }, [m]);

  const signMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: tex.sign,
        emissiveMap: tex.sign,
        emissive: '#ffffff',
        emissiveIntensity: 0.55,
        roughness: 0.5,
      }),
    [tex],
  );
  const signFaces = useMemo(() => [m.black, m.black, m.black, m.black, signMaterial, m.black], [m, signMaterial]);
  const glowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ map: tex.exitGlow, toneMapped: false, fog: false }),
    [tex],
  );

  useEffect(
    () => () => {
      signMaterial.dispose();
      glowMaterial.dispose();
    },
    [signMaterial, glowMaterial],
  );

  useFrame(() => {
    const p = journey.progress;
    const open = ease(chapterProgress(intro, p), 0.38, 0.7);
    if (leftDoor.current) leftDoor.current.rotation.y = open * 1.55;
    if (rightDoor.current) rightDoor.current.rotation.y = -open * 1.55;
    const exitOpen = ease(p, 0.9, 0.945);
    if (exitDoor.current) exitDoor.current.position.y = HALL.exitHeight / 2 + exitOpen * (HALL.exitHeight - 0.3);
    if (exitLight.current) exitLight.current.intensity = exitOpen * 90;
  });

  const doorSide = HALL.width / 2 - HALL.doorWidth / 2;
  const frontHeight = 10.5;

  return (
    <group>
      {/* Talaj és előtér */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} material={m.ground}>
        <planeGeometry args={[240, 240]} />
      </mesh>
      <mesh position={[0, 0, 3.5]} material={m.concrete} receiveShadow>
        <boxGeometry args={[16, 0.04, 7]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -HALL.depth / 2]} material={m.floor} receiveShadow>
        <planeGeometry args={[HALL.width, HALL.depth]} />
      </mesh>

      {/* Homlokzat a bejárattal */}
      <mesh position={[-(HALL.doorWidth / 2 + doorSide / 2), frontHeight / 2, -0.2]} material={walls.front}>
        <boxGeometry args={[doorSide, frontHeight, 0.4]} />
      </mesh>
      <mesh position={[HALL.doorWidth / 2 + doorSide / 2, frontHeight / 2, -0.2]} material={walls.front}>
        <boxGeometry args={[doorSide, frontHeight, 0.4]} />
      </mesh>
      <mesh
        position={[0, HALL.doorHeight + (frontHeight - HALL.doorHeight) / 2, -0.2]}
        material={walls.front}
      >
        <boxGeometry args={[HALL.doorWidth, frontHeight - HALL.doorHeight, 0.4]} />
      </mesh>
      <mesh position={[0, 8.3, 0.15]} material={signFaces}>
        <boxGeometry args={[13, 2, 0.3]} />
      </mesh>
      <mesh position={[0, 6.15, 0.06]} material={m.yellow}>
        <boxGeometry args={[HALL.width + 0.4, 0.22, 0.12]} />
      </mesh>
      {[-10.75, 10.75].map((x) => (
        <mesh key={x} position={[x, 3.3, 0.03]} material={m.windowGlow}>
          <boxGeometry args={[10, 1.7, 0.06]} />
        </mesh>
      ))}
      <mesh position={[0, 5.75, 0.9]} material={m.black}>
        <boxGeometry args={[7, 0.25, 1.8]} />
      </mesh>
      <mesh position={[0, 5.61, 1.65]} material={m.yellowLight}>
        <boxGeometry args={[6.4, 0.03, 0.08]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (HALL.doorWidth / 2 + 0.06), HALL.doorHeight / 2, 0.02]} material={m.black}>
          <boxGeometry args={[0.12, HALL.doorHeight, 0.5]} />
        </mesh>
      ))}

      {/* Bejárati ajtószárnyak */}
      <group ref={leftDoor} position={[-HALL.doorWidth / 2, 0, -0.1]}>
        <mesh position={[1.24, 2.73, 0]} material={m.darkGlass}>
          <boxGeometry args={[2.48, 5.45, 0.08]} />
        </mesh>
        <mesh position={[2.25, 2.7, 0.08]} material={m.yellow}>
          <cylinderGeometry args={[0.025, 0.025, 1.4, 8]} />
        </mesh>
      </group>
      <group ref={rightDoor} position={[HALL.doorWidth / 2, 0, -0.1]}>
        <mesh position={[-1.24, 2.73, 0]} material={m.darkGlass}>
          <boxGeometry args={[2.48, 5.45, 0.08]} />
        </mesh>
        <mesh position={[-2.25, 2.7, 0.08]} material={m.yellow}>
          <cylinderGeometry args={[0.025, 0.025, 1.4, 8]} />
        </mesh>
      </group>

      <Flag position={[-8.4, 0, 5.5]} map={tex.flag} height={7} size={[1.8, 1.15]} flip />
      <Flag position={[8.4, 0, 5.5]} map={tex.flag} height={7} size={[1.8, 1.15]} />

      {/* Oldalfalak, mennyezet */}
      <mesh position={[-(HALL.width / 2 + 0.2), 4.65, -HALL.depth / 2 - 0.2]} material={walls.left}>
        <boxGeometry args={[0.4, 9.3, HALL.depth + 0.4]} />
      </mesh>
      <mesh position={[HALL.width / 2 + 0.2, 4.65, -HALL.depth / 2 - 0.2]} material={walls.right}>
        <boxGeometry args={[0.4, 9.3, HALL.depth + 0.4]} />
      </mesh>
      <mesh position={[0, 9.45, -HALL.depth / 2 - 0.2]} material={walls.ceiling}>
        <boxGeometry args={[HALL.width + 0.8, 0.3, HALL.depth + 0.4]} />
      </mesh>

      {/* Hátsó fal a kapunyílással */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * (HALL.exitWidth / 2 + (HALL.width / 2 - HALL.exitWidth / 2) / 2), 4.65, -HALL.depth - 0.2]}
          material={walls.back}
        >
          <boxGeometry args={[HALL.width / 2 - HALL.exitWidth / 2, 9.3, 0.4]} />
        </mesh>
      ))}
      <mesh position={[0, HALL.exitHeight + (9.3 - HALL.exitHeight) / 2, -HALL.depth - 0.2]} material={walls.back}>
        <boxGeometry args={[HALL.exitWidth, 9.3 - HALL.exitHeight, 0.4]} />
      </mesh>
      <group ref={exitDoor} position={[0, HALL.exitHeight / 2, -HALL.depth - 0.5]}>
        <mesh material={m.machineLight}>
          <boxGeometry args={[HALL.exitWidth, HALL.exitHeight, 0.1]} />
        </mesh>
        {EXIT_PANELS.map((y) => (
          <mesh key={y} position={[0, y, 0.06]} material={m.black}>
            <boxGeometry args={[HALL.exitWidth - 0.1, 0.03, 0.02]} />
          </mesh>
        ))}
        <mesh position={[0, -HALL.exitHeight / 2 + 0.15, 0.06]} material={m.yellow}>
          <boxGeometry args={[HALL.exitWidth, 0.3, 0.04]} />
        </mesh>
      </group>
      <mesh position={[0, 6, -56]} material={glowMaterial}>
        <planeGeometry args={[44, 26]} />
      </mesh>
      <pointLight ref={exitLight} position={[0, 3, -47]} color="#ffd84a" intensity={0} distance={30} decay={1.4} />

      {/* Belső szerkezet: fénycsíkok, rácsos tartók, pillérek, padlójelölés */}
      {STRIP_X.flatMap((x) =>
        STRIP_Z.map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 9.27, z]} material={m.whiteLight}>
            <boxGeometry args={[0.16, 0.05, 4.6]} />
          </mesh>
        )),
      )}
      {TRUSS_Z.map((z) => (
        <mesh key={z} position={[0, 8.55, z]} material={m.black}>
          <boxGeometry args={[HALL.width - 0.4, 0.4, 0.16]} />
        </mesh>
      ))}
      {PILASTER_Z.flatMap((z) =>
        [-1, 1].map((s) => (
          <group key={`${z}:${s}`} position={[s * (HALL.width / 2 - 0.25), 0, z]}>
            <mesh position={[0, 4.5, 0]} material={m.black}>
              <boxGeometry args={[0.5, 9, 0.5]} />
            </mesh>
            <mesh position={[0, 0.3, 0]} material={m.yellow}>
              <boxGeometry args={[0.52, 0.6, 0.52]} />
            </mesh>
          </group>
        )),
      )}
      {[-3.4, 3.4].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, -21.75]} material={m.line}>
          <planeGeometry args={[0.1, 41.5]} />
        </mesh>
      ))}
    </group>
  );
}
