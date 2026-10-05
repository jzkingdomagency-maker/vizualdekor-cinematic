import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { chapterById, chapterProgress } from '../../../data/journey';
import { journey } from '../../../lib/journeyStore';
import { ease, lerp } from '../../../lib/math';
import { getMaterials } from '../materials';
import { FloorFrame } from '../parts';
import type { SceneTextures } from '../textures';
import { STATIONS } from '../world';

const chapter = chapterById('largeformat');
const SHEET_W = 1.6;
const SHEET_L = 0.8;
const SLOT = new THREE.Vector3(0, 1.02, 0.4);
const SLOT_TILT = -0.25;
const BOARD_W = 6;
const BOARD_H = 3;
const BOARD_CENTER_Y = 4.6;
const BOARD_Z = -4.85;
const LAMPS = [-2, 0, 2];

/** Bérnyomtatás: a nagyformátumú gép kinyomtatja a grafikát, ami kültéri reklámfelületté válik. */
export default function LargeFormatStation({ tex }: { tex: SceneTextures }) {
  const m = getMaterials();
  const pose = STATIONS.largeformat;
  const sheet = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Mesh>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(0, BOARD_CENTER_Y + BOARD_H / 2, BOARD_Z), []);

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1);
    g.translate(0, -0.5, 0);
    return g;
  }, []);

  const mats = useMemo(
    () => ({
      sheet: new THREE.MeshStandardMaterial({ map: tex.billboard, roughness: 0.55, side: THREE.DoubleSide }),
      lamp: new THREE.MeshStandardMaterial({ color: '#2a2a2a', emissive: '#fff4cc', emissiveIntensity: 0 }),
    }),
    [tex],
  );

  useEffect(
    () => () => {
      geo.dispose();
      Object.values(mats).forEach((mat) => mat.dispose());
    },
    [geo, mats],
  );

  useFrame(({ clock }) => {
    const p = journey.progress;
    const l = chapterProgress(chapter, p);
    const near = p > chapter.start - 0.05 && p < chapter.end + 0.02;
    if (head.current && near) head.current.position.x = Math.sin(clock.elapsedTime * 3.1) * 0.95;

    const print = ease(l, 0.14, 0.46);
    const fly = ease(l, 0.5, 0.84);
    const s = sheet.current;
    if (s) {
      const len = Math.max(0.001, SHEET_L * print);
      tex.billboard.repeat.set(1, fly > 0 ? 1 : len / SHEET_L);
      tmp.copy(SLOT).lerp(target, fly);
      tmp.y += Math.sin(Math.PI * fly) * 1.1;
      tmp.z += Math.sin(Math.PI * fly) * 0.9;
      s.position.copy(tmp);
      s.rotation.x = lerp(SLOT_TILT, 0, fly);
      s.scale.set(lerp(SHEET_W, BOARD_W, fly), lerp(len, BOARD_H, fly), 1);
    }
    mats.lamp.emissiveIntensity = ease(l, 0.82, 0.9) * 2.2;
  });

  return (
    <group position={pose.position} rotation={[0, pose.rotation, 0]}>
      <FloorFrame position={[0, 0, 0.4]} size={[3.6, 2.2]} />

      {/* Nagyformátumú nyomtató állvánnyal */}
      {[-1.05, 1.05].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.45, 0]} material={m.machineDark} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.5]} />
          </mesh>
          <mesh position={[0, 0.03, 0]} material={m.machineDark}>
            <boxGeometry args={[0.12, 0.06, 0.7]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.3, 0]} material={m.machineDark}>
        <boxGeometry args={[2.1, 0.05, 0.05]} />
      </mesh>
      <mesh position={[0, 1.18, 0]} material={m.machineDark} castShadow>
        <boxGeometry args={[2.4, 0.55, 0.7]} />
      </mesh>
      <mesh position={[0, 1.36, 0.355]} material={m.yellow}>
        <boxGeometry args={[2.4, 0.06, 0.01]} />
      </mesh>
      <mesh position={[0, 1.04, 0.36]} material={m.black}>
        <boxGeometry args={[1.8, 0.04, 0.04]} />
      </mesh>
      <mesh ref={head} position={[0, 1.48, 0.05]} material={m.machineLight}>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
      </mesh>
      <mesh position={[0, 1.44, 0.05]} material={m.steel}>
        <boxGeometry args={[2.2, 0.03, 0.05]} />
      </mesh>
      <mesh position={[0, 0.78, -0.28]} rotation={[0, 0, Math.PI / 2]} material={m.paper}>
        <cylinderGeometry args={[0.14, 0.14, 1.75, 24]} />
      </mesh>

      {/* A nyomat, ami a reklámfelületre kerül */}
      <mesh ref={sheet} geometry={geo} material={mats.sheet} position={SLOT} rotation={[SLOT_TILT, 0, 0]} scale={[SHEET_W, 0.001, 1]} />

      {/* Kültéri reklámkeret a falon */}
      <mesh position={[0, BOARD_CENTER_Y, BOARD_Z - 0.12]} material={m.black}>
        <boxGeometry args={[BOARD_W + 0.3, BOARD_H + 0.3, 0.16]} />
      </mesh>
      {LAMPS.map((x) => (
        <group key={x} position={[x, BOARD_CENTER_Y + BOARD_H / 2 + 0.25, BOARD_Z + 0.3]}>
          <mesh position={[0, 0, -0.18]} material={m.steel}>
            <boxGeometry args={[0.04, 0.04, 0.5]} />
          </mesh>
          <mesh position={[0, 0, 0.1]} material={mats.lamp}>
            <boxGeometry args={[0.5, 0.08, 0.16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
