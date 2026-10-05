import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getMaterials } from '../materials';
import { Flag, Rollup } from '../parts';
import { YELLOW, type SceneTextures } from '../textures';
import { letterD, letterV } from './shapes';

/** Belógatós molinók (x, z), a közlekedősáv fölött. */
const BANNERS: [number, number][] = [
  [-5, -6],
  [5, -12],
  [-5, -18],
  [5, -24],
  [-5, -30],
  [5, -35],
];

/** Falra kerülő poszterek: x, z, elforgatás. */
const POSTERS: [number, number, number][] = [
  [-17.97, -14, Math.PI / 2],
  [-17.97, -20.5, Math.PI / 2],
  [17.97, -16.5, -Math.PI / 2],
  [17.97, -21.5, -Math.PI / 2],
];

/** Zászlók, belógatós molinók, poszterek, rollupok és térbetűk a csarnok terében. */
export default function SpaceDecor({ tex, lowDetail }: { tex: SceneTextures; lowDetail: boolean }) {
  const m = getMaterials();
  const banners = useRef<(THREE.Group | null)[]>([]);

  const geo = useMemo(() => {
    const options = { depth: 0.35, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 24 };
    return { v: new THREE.ExtrudeGeometry(letterV(), options), d: new THREE.ExtrudeGeometry(letterD(), options) };
  }, []);

  const mats = useMemo(
    () => ({
      banners: tex.banners.map((map) => new THREE.MeshStandardMaterial({ map, roughness: 0.8 })),
      posters: tex.posters.map((map) => new THREE.MeshStandardMaterial({ map, roughness: 0.75 })),
      glow: new THREE.MeshBasicMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    }),
    [tex],
  );

  useEffect(
    () => () => {
      geo.v.dispose();
      geo.d.dispose();
      mats.banners.forEach((mat) => mat.dispose());
      mats.posters.forEach((mat) => mat.dispose());
      mats.glow.dispose();
    },
    [geo, mats],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    banners.current.forEach((group, i) => {
      if (group) group.rotation.y = Math.sin(t * 0.4 + i * 1.3) * 0.06;
    });
  });

  return (
    <group>
      {BANNERS.map(([x, z], i) => (
        <group
          key={`${x}:${z}`}
          position={[x, 6.9, z]}
          ref={(node) => {
            banners.current[i] = node;
          }}
        >
          {[-0.6, 0.6].map((dx) => (
            <mesh key={dx} position={[dx, 1.35, 0]} material={m.steel}>
              <cylinderGeometry args={[0.006, 0.006, 0.9, 4]} />
            </mesh>
          ))}
          <mesh position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} material={m.black}>
            <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
          </mesh>
          <mesh position={[0, -0.7, 0.003]} material={mats.banners[i % mats.banners.length]}>
            <planeGeometry args={[1.4, 3.2]} />
          </mesh>
          <mesh position={[0, -0.7, -0.003]} rotation={[0, Math.PI, 0]} material={mats.banners[(i + 3) % mats.banners.length]}>
            <planeGeometry args={[1.4, 3.2]} />
          </mesh>
        </group>
      ))}

      {POSTERS.map(([x, z, rot], i) => (
        <mesh key={`${x}:${z}`} position={[x, 3.4, z]} rotation={[0, rot, 0]} material={mats.posters[i % mats.posters.length]}>
          <planeGeometry args={[1.6, 2.25]} />
        </mesh>
      ))}

      <Rollup map={tex.rollup} position={[-3.4, 0, -1.6]} rotation={0.35} />
      <Rollup map={tex.rollup} position={[3.4, 0, -1.6]} rotation={-0.35} />

      {lowDetail ? null : (
        <>
          <Flag position={[-2.8, 0, -38]} map={tex.flag} height={4.6} size={[1.4, 0.9]} flip />
          <Flag position={[2.8, 0, -38]} map={tex.flag} height={4.6} size={[1.4, 0.9]} />
        </>
      )}

      {/* Térbetűk a hátsó kapu két oldalán */}
      <mesh geometry={geo.v} material={m.yellow} position={[-5.6, 0, -41.8]} castShadow />
      <mesh geometry={geo.d} material={m.yellow} position={[5.45, 0, -41.8]} castShadow />
      <mesh position={[-5.6, 1.3, -43.95]} material={mats.glow}>
        <planeGeometry args={[3.4, 3.4]} />
      </mesh>
      <mesh position={[5.6, 1.3, -43.95]} material={mats.glow}>
        <planeGeometry args={[3.4, 3.4]} />
      </mesh>
    </group>
  );
}
