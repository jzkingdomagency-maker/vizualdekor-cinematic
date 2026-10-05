import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { chapterById, chapterProgress } from '../../../data/journey';
import { journey } from '../../../lib/journeyStore';
import { ease, lerp } from '../../../lib/math';
import { getMaterials } from '../materials';
import { ClipPlane, FloorFrame, Rollup } from '../parts';
import type { SceneTextures } from '../textures';
import { STATIONS } from '../world';

const chapter = chapterById('decor');
const WINDOW_W = 6;
const WINDOW_H = 3.4;
const SHELF_ITEMS = [-2.3, -1.9, -1.5, -1.1, -0.7];

/** Kirakatdekoráció: a fólia balról jobbra kerül fel az üvegre, mellette rollup és mesh háló. */
export default function DecorStation({ tex }: { tex: SceneTextures }) {
  const m = getMaterials();
  const pose = STATIONS.decor;
  const root = useRef<THREE.Group>(null);
  const squeegee = useRef<THREE.Mesh>(null);
  const ghost = useRef<THREE.Mesh>(null);
  const rollupPanel = useRef<THREE.Group>(null);
  const clip = useMemo(() => new ClipPlane(), []);

  const mats = useMemo(
    () => ({
      film: new THREE.MeshStandardMaterial({
        map: tex.shopFilm,
        transparent: true,
        roughness: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
        clippingPlanes: [clip.world],
      }),
      ghost: new THREE.MeshStandardMaterial({
        map: tex.shopFilm,
        transparent: true,
        opacity: 0,
        roughness: 0.4,
        depthWrite: false,
      }),
      mesh: new THREE.MeshStandardMaterial({ map: tex.meshBanner, roughness: 0.8, side: THREE.DoubleSide }),
      ceiling: new THREE.MeshBasicMaterial({ color: '#f3efe6', toneMapped: false }),
    }),
    [tex, clip],
  );

  useEffect(() => () => Object.values(mats).forEach((mat) => mat.dispose()), [mats]);

  useFrame(({ clock }) => {
    const group = root.current;
    if (!group) return;
    const l = chapterProgress(chapter, journey.progress);

    const approach = ease(l, 0.16, 0.32);
    if (ghost.current) {
      ghost.current.position.set(0, 1.9 + (1 - approach) * 0.25, 0.012 + (1 - approach) * 0.35);
      mats.ghost.opacity = approach * (1 - ease(l, 0.32, 0.36)) * 0.55;
      ghost.current.visible = mats.ghost.opacity > 0.01;
    }

    const reveal = ease(l, 0.32, 0.78);
    const edge = lerp(-WINDOW_W / 2 - 0.05, WINDOW_W / 2 + 0.05, reveal);
    clip.update(group, -1, 0, 0, edge);

    if (squeegee.current) {
      const working = reveal > 0.001 && reveal < 0.999;
      squeegee.current.visible = working;
      squeegee.current.position.set(edge, 1.9 + Math.sin(clock.elapsedTime * 7) * 1.25, 0.07);
    }

    if (rollupPanel.current) rollupPanel.current.scale.y = Math.max(0.001, ease(l, 0.52, 0.76));
  });

  return (
    <group ref={root} position={pose.position} rotation={[0, pose.rotation, 0]}>
      <FloorFrame position={[0, 0, 0.6]} size={[10.2, 2.4]} />

      {/* Kirakat kerete */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (WINDOW_W / 2 + 0.07), 1.8, 0]} material={m.black} castShadow>
          <boxGeometry args={[0.14, 3.6, 0.2]} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, 0]} material={m.black}>
        <boxGeometry args={[WINDOW_W + 0.28, 0.2, 0.25]} />
      </mesh>
      <mesh position={[0, 3.95, 0]} material={m.black}>
        <boxGeometry args={[WINDOW_W + 0.6, 0.8, 0.32]} />
      </mesh>
      <mesh position={[0, 3.62, 0.17]} material={m.yellowLight}>
        <boxGeometry args={[WINDOW_W + 0.2, 0.05, 0.04]} />
      </mesh>
      <mesh position={[0, 1.9, 0]} material={m.glass}>
        <planeGeometry args={[WINDOW_W, WINDOW_H]} />
      </mesh>

      {/* Felkerülő kirakatfólia */}
      <mesh position={[0, 1.9, 0.012]} material={mats.film}>
        <planeGeometry args={[WINDOW_W, WINDOW_H]} />
      </mesh>
      <mesh ref={ghost} material={mats.ghost} visible={false}>
        <planeGeometry args={[WINDOW_W, WINDOW_H]} />
      </mesh>
      <mesh ref={squeegee} material={m.yellow} visible={false}>
        <boxGeometry args={[0.06, 0.36, 0.05]} />
      </mesh>

      {/* Az üzlet belseje */}
      <mesh position={[0, 1.8, -2.6]} material={m.shopWall}>
        <planeGeometry args={[WINDOW_W, 3.6]} />
      </mesh>
      <mesh position={[0, 3.55, -1.3]} rotation={[Math.PI / 2, 0, 0]} material={mats.ceiling}>
        <planeGeometry args={[5, 2]} />
      </mesh>
      {[1.1, 1.7].map((y) => (
        <group key={y}>
          <mesh position={[-1.5, y, -2.38]} material={m.black}>
            <boxGeometry args={[2.2, 0.04, 0.4]} />
          </mesh>
          {SHELF_ITEMS.map((x, i) => (
            <mesh
              key={x}
              position={[x + 0.1, y + 0.14, -2.38]}
              material={i % 3 === 0 ? m.yellow : i % 3 === 1 ? m.black : m.machineLight}
            >
              <boxGeometry args={[0.24, 0.24, 0.24]} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[1.6, 0.475, -1.6]} material={m.black}>
        <boxGeometry args={[1.4, 0.95, 0.6]} />
      </mesh>

      {/* Rollup és mesh háló */}
      <Rollup map={tex.rollup} position={[4.3, 0, 0.9]} rotation={-0.3} panelRef={rollupPanel} />
      <group position={[-4.4, 0, 0.6]} rotation={[0, 0.25, 0]}>
        {[-0.95, 0.95].map((x) => (
          <mesh key={x} position={[x, 1.2, 0]} material={m.steel}>
            <cylinderGeometry args={[0.025, 0.025, 2.4, 8]} />
          </mesh>
        ))}
        <mesh position={[0, 1.75, 0]} material={mats.mesh}>
          <planeGeometry args={[1.8, 1.1]} />
        </mesh>
        {[-0.86, 0.86].flatMap((x) =>
          [1.25, 2.25].map((y) => (
            <mesh key={`${x}:${y}`} position={[x, y, 0.01]} material={m.steel}>
              <sphereGeometry args={[0.02, 8, 6]} />
            </mesh>
          )),
        )}
      </group>
    </group>
  );
}
