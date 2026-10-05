import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { chapterById, chapterProgress } from '../../../data/journey';
import { journey } from '../../../lib/journeyStore';
import { ease, lerp, range } from '../../../lib/math';
import { getMaterials } from '../materials';
import { ClipPlane, FloorFrame } from '../parts';
import { YELLOW, type SceneTextures } from '../textures';
import { STATIONS } from '../world';

const chapter = chapterById('glass');
const W = 8;
const H = 4.4;
const MULLIONS = [-4, -1.33, 1.33, 4];
/** Buborékok helye a fólia alatt (x, y). */
const BUBBLES: [number, number][] = [
  [-3.1, 3.4],
  [-2.2, 1.6],
  [-1.6, 2.7],
  [-0.4, 3.8],
  [0.3, 1.2],
  [0.9, 2.9],
  [1.8, 2.0],
  [2.5, 3.5],
  [3.3, 1.5],
  [-2.8, 0.8],
];

/** Épületüveg fóliázás: tisztítás, pozicionálás, felhelyezés felülről lefelé, buborékmentesítés. */
export default function GlassStation({ tex }: { tex: SceneTextures }) {
  const m = getMaterials();
  const pose = STATIONS.glass;
  const root = useRef<THREE.Group>(null);
  const wiper = useRef<THREE.Mesh>(null);
  const ghost = useRef<THREE.Mesh>(null);
  const squeegee = useRef<THREE.Mesh>(null);
  const bubbles = useRef<(THREE.Mesh | null)[]>([]);
  const outline = useRef<THREE.Group>(null);
  const clip = useMemo(() => new ClipPlane(), []);

  const mats = useMemo(
    () => ({
      film: new THREE.MeshStandardMaterial({
        map: tex.frost,
        transparent: true,
        opacity: 0.8,
        roughness: 0.6,
        side: THREE.DoubleSide,
        depthWrite: false,
        clippingPlanes: [clip.world],
      }),
      ghost: new THREE.MeshStandardMaterial({
        map: tex.frost,
        transparent: true,
        opacity: 0,
        roughness: 0.6,
        depthWrite: false,
      }),
      bubble: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.55,
        roughness: 0.05,
        metalness: 0.3,
      }),
      outline: new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0, toneMapped: false }),
      panel: new THREE.MeshBasicMaterial({ color: '#f6f2e8', toneMapped: false }),
      screen: new THREE.MeshBasicMaterial({ color: '#2b3a44', toneMapped: false }),
    }),
    [tex, clip],
  );

  useEffect(() => () => Object.values(mats).forEach((mat) => mat.dispose()), [mats]);

  useFrame(({ clock }) => {
    const group = root.current;
    if (!group) return;
    const l = chapterProgress(chapter, journey.progress);
    const t = clock.elapsedTime;

    const cleaning = range(l, 0.1, 0.28);
    if (wiper.current) {
      wiper.current.visible = cleaning > 0 && cleaning < 1;
      const row = Math.floor(cleaning * 4);
      const along = (cleaning * 4) % 1;
      const dir = row % 2 === 0 ? 1 : -1;
      wiper.current.position.set(dir * lerp(-W / 2 + 0.4, W / 2 - 0.4, along), H - 0.6 - row * 1.0, 0.08);
    }

    const approach = ease(l, 0.26, 0.38);
    if (ghost.current) {
      ghost.current.position.set(0.3 * (1 - approach), H / 2 + 0.3 * (1 - approach), 0.02 + 0.45 * (1 - approach));
      mats.ghost.opacity = approach * (1 - ease(l, 0.38, 0.42)) * 0.7;
      ghost.current.visible = mats.ghost.opacity > 0.01;
    }

    const reveal = ease(l, 0.38, 0.72);
    const edgeY = lerp(H + 0.05, -0.05, reveal);
    clip.update(group, 0, 1, 0, -edgeY);
    mats.film.opacity = lerp(0.8, 0.95, ease(l, 0.86, 0.96));

    const sweep = ease(l, 0.72, 0.86);
    const sweepX = lerp(-W / 2 - 0.2, W / 2 + 0.2, sweep);
    if (squeegee.current) {
      const vertical = reveal > 0.001 && reveal < 0.999;
      const horizontal = sweep > 0.001 && sweep < 0.999;
      squeegee.current.visible = vertical || horizontal;
      if (vertical) {
        squeegee.current.position.set(Math.sin(t * 5) * (W / 2 - 0.5), edgeY, 0.06);
        squeegee.current.rotation.z = Math.PI / 2;
      } else {
        squeegee.current.position.set(sweepX, H / 2, 0.06);
        squeegee.current.rotation.z = 0;
      }
    }

    BUBBLES.forEach(([bx, by], i) => {
      const b = bubbles.current[i];
      if (!b) return;
      const covered = edgeY < by - 0.1;
      const pushed = sweepX > bx;
      const s = covered && !pushed ? 1 : 0;
      b.scale.setScalar(lerp(b.scale.x, s, 0.18) + 0.0001);
      b.visible = b.scale.x > 0.02;
    });

    const done = ease(l, 0.86, 0.94);
    if (outline.current) outline.current.visible = done > 0.01;
    mats.outline.opacity = done * 0.9;
  });

  return (
    <group ref={root} position={pose.position} rotation={[0, pose.rotation, 0]}>
      <FloorFrame position={[0, 0, 1.2]} size={[8.4, 2]} />

      {/* Üvegfal kerettel */}
      {MULLIONS.map((x) => (
        <mesh key={x} position={[x, H / 2, 0]} material={m.black} castShadow>
          <boxGeometry args={[0.08, H, 0.12]} />
        </mesh>
      ))}
      {[0.04, H].map((y) => (
        <mesh key={y} position={[0, y, 0]} material={m.black}>
          <boxGeometry args={[W + 0.08, 0.08, 0.12]} />
        </mesh>
      ))}
      <mesh position={[0, H / 2, 0]} material={m.glass}>
        <planeGeometry args={[W, H]} />
      </mesh>

      {/* Fólia és szerszámok */}
      <mesh position={[0, H / 2, 0.015]} material={mats.film}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <mesh ref={ghost} material={mats.ghost} visible={false}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <mesh ref={wiper} material={m.yellow} visible={false}>
        <boxGeometry args={[0.5, 0.06, 0.04]} />
      </mesh>
      <mesh ref={squeegee} material={m.yellow} visible={false}>
        <boxGeometry args={[0.06, 0.42, 0.05]} />
      </mesh>
      {BUBBLES.map(([x, y], i) => (
        <mesh
          key={`${x}:${y}`}
          ref={(node) => {
            bubbles.current[i] = node;
          }}
          position={[x, y, 0.03]}
          scale={0.0001}
          material={mats.bubble}
          visible={false}
        >
          <sphereGeometry args={[0.06, 12, 8]} />
        </mesh>
      ))}
      <group ref={outline} visible={false}>
        {[0.06, H - 0.02].map((y) => (
          <mesh key={y} position={[0, y, 0.07]} material={mats.outline}>
            <boxGeometry args={[W, 0.025, 0.01]} />
          </mesh>
        ))}
        {[-W / 2, W / 2].map((x) => (
          <mesh key={x} position={[x, H / 2, 0.07]} material={mats.outline}>
            <boxGeometry args={[0.025, H, 0.01]} />
          </mesh>
        ))}
      </group>

      {/* Iroda az üveg mögött */}
      <mesh position={[0, 2.3, -6.4]} material={m.shopWall}>
        <planeGeometry args={[W, 4.6]} />
      </mesh>
      <mesh position={[-W / 2, 2.3, -3.2]} rotation={[0, Math.PI / 2, 0]} material={m.shopWall}>
        <planeGeometry args={[6.4, 4.6]} />
      </mesh>
      <mesh position={[0, 4.5, -3.2]} rotation={[Math.PI / 2, 0, 0]} material={mats.panel}>
        <planeGeometry args={[3, 1.2]} />
      </mesh>
      <group position={[1.2, 0, -2.6]}>
        <mesh position={[0, 0.74, 0]} material={m.machineLight} castShadow>
          <boxGeometry args={[1.8, 0.05, 0.8]} />
        </mesh>
        {[-0.85, 0.85].map((x) => (
          <mesh key={x} position={[x, 0.36, 0]} material={m.black}>
            <boxGeometry args={[0.05, 0.72, 0.7]} />
          </mesh>
        ))}
        <mesh position={[0, 1.08, -0.25]} material={m.black}>
          <boxGeometry args={[0.8, 0.48, 0.03]} />
        </mesh>
        <mesh position={[0, 1.08, -0.23]} material={mats.screen}>
          <planeGeometry args={[0.74, 0.42]} />
        </mesh>
        <mesh position={[0, 0.5, 0.75]} material={m.black}>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
        </mesh>
        <mesh position={[0, 0.85, 0.98]} material={m.black}>
          <boxGeometry args={[0.5, 0.6, 0.06]} />
        </mesh>
      </group>
      <group position={[-2.9, 0, -4.8]}>
        <mesh position={[0, 0.25, 0]} material={m.machineDark}>
          <cylinderGeometry args={[0.22, 0.18, 0.5, 16]} />
        </mesh>
        <mesh position={[0, 0.95, 0]} material={m.plant}>
          <sphereGeometry args={[0.5, 16, 12]} />
        </mesh>
      </group>
    </group>
  );
}
