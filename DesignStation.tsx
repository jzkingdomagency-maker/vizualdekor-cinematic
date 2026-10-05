import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { chapterById, chapterProgress } from '../../../data/journey';
import { journey } from '../../../lib/journeyStore';
import { ease, lerp } from '../../../lib/math';
import { getMaterials } from '../materials';
import { FloorFrame } from '../parts';
import { YELLOW, type SceneTextures } from '../textures';
import { STATIONS } from '../world';

const chapter = chapterById('design');
const SCREEN = new THREE.Vector3(0, 1.32, -0.21);
const OUTSIDE = new THREE.Vector3(0, 1.6, 0.65);
const SIGN = new THREE.Vector3(0, 3.6, -2.47);
const SIGN_SIZE = 1.6;

/**
 * Grafikai tervezés: a logó kilép a monitorból, papírra nyomtatjuk, fóliát kap,
 * majd valódi, megvilágított cégtáblaként kerül a falra.
 */
export default function DesignStation({ tex }: { tex: SceneTextures }) {
  const m = getMaterials();
  const pose = STATIONS.design;
  const art = useRef<THREE.Group>(null);
  const paper = useRef<THREE.Mesh>(null);
  const film = useRef<THREE.Mesh>(null);
  const sign = useRef<THREE.Group>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const mats = useMemo(
    () => ({
      screen: new THREE.MeshBasicMaterial({ map: tex.monitor, toneMapped: false }),
      logo: new THREE.MeshBasicMaterial({ map: tex.logoMark, transparent: true, toneMapped: false, side: THREE.DoubleSide }),
      paper: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, transparent: true, opacity: 0 }),
      film: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.05,
        metalness: 0.4,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
      signFace: new THREE.MeshStandardMaterial({
        map: tex.logoMark,
        transparent: true,
        roughness: 0.35,
        emissive: '#ffffff',
        emissiveMap: tex.logoMark,
        emissiveIntensity: 0.35,
      }),
      glow: new THREE.MeshBasicMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
      lamp: new THREE.MeshBasicMaterial({ color: '#fff2b0', toneMapped: false }),
    }),
    [tex],
  );

  useEffect(() => () => Object.values(mats).forEach((mat) => mat.dispose()), [mats]);

  useFrame(() => {
    const l = chapterProgress(chapter, journey.progress);
    const exit = ease(l, 0.3, 0.45);
    const printed = ease(l, 0.45, 0.55);
    const filmed = ease(l, 0.56, 0.68);
    const mount = ease(l, 0.7, 0.88);
    const installed = ease(l, 0.86, 0.93);

    const g = art.current;
    if (g) {
      tmp.copy(SCREEN).lerp(OUTSIDE, exit);
      if (mount > 0) {
        tmp.lerp(SIGN, mount);
        tmp.z += Math.sin(Math.PI * mount) * 0.6;
        tmp.y += Math.sin(Math.PI * mount) * 0.4;
      }
      g.position.copy(tmp);
      const size = lerp(lerp(0.34, 0.6, exit), SIGN_SIZE, mount);
      g.scale.setScalar(size);
      g.rotation.y = Math.sin(Math.PI * exit) * 0.25 * (1 - mount);
      g.visible = exit > 0.001 && installed < 0.999;
      mats.logo.opacity = 1 - installed;
    }

    mats.paper.opacity = printed * (1 - ease(l, 0.84, 0.9));
    if (paper.current) paper.current.visible = mats.paper.opacity > 0.01;
    if (film.current) {
      film.current.position.x = lerp(-1.4, 0, filmed);
      film.current.visible = filmed > 0.001 && l < 0.9;
    }
    mats.film.opacity = filmed * 0.35 * (1 - ease(l, 0.84, 0.9));

    if (sign.current) {
      sign.current.visible = installed > 0.001;
      sign.current.scale.setScalar(Math.max(0.001, lerp(0.92, 1, installed)));
    }
    mats.glow.opacity = installed * 0.45;
  });

  return (
    <group position={pose.position} rotation={[0, pose.rotation, 0]}>
      <FloorFrame position={[0, 0, 0.4]} size={[3.2, 2.6]} />

      {/* Íróasztal, monitor, szék */}
      <mesh position={[0, 0.75, 0]} material={m.black} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.05, 0.85]} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.365, 0]} material={m.black}>
          <boxGeometry args={[0.04, 0.73, 0.75]} />
        </mesh>
      ))}
      <mesh position={[0, 0.78, -0.25]} material={m.machineDark}>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
      </mesh>
      <mesh position={[0, 0.95, -0.27]} material={m.machineDark}>
        <boxGeometry args={[0.06, 0.35, 0.06]} />
      </mesh>
      <mesh position={[0, 1.32, -0.25]} material={m.machineDark} castShadow>
        <boxGeometry args={[1.12, 0.68, 0.035]} />
      </mesh>
      <mesh position={[0, 1.32, -0.231]} material={mats.screen}>
        <planeGeometry args={[1.06, 0.62]} />
      </mesh>
      <mesh position={[0, 0.785, 0.15]} material={m.machineLight}>
        <boxGeometry args={[0.45, 0.02, 0.15]} />
      </mesh>
      <group position={[0.72, 0.775, -0.15]}>
        <mesh position={[0, 0.02, 0]} material={m.machineDark}>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
        </mesh>
        <mesh position={[0, 0.25, 0]} material={m.machineDark}>
          <cylinderGeometry args={[0.012, 0.012, 0.46, 8]} />
        </mesh>
        <mesh position={[0, 0.5, 0.06]} rotation={[0.5, 0, 0]} material={m.yellow}>
          <coneGeometry args={[0.09, 0.14, 20, 1, true]} />
        </mesh>
        <mesh position={[0, 0.46, 0.08]} material={mats.lamp}>
          <sphereGeometry args={[0.03, 10, 8]} />
        </mesh>
      </group>
      <group position={[0, 0, 0.8]}>
        <mesh position={[0, 0.48, 0]} material={m.black}>
          <boxGeometry args={[0.5, 0.07, 0.48]} />
        </mesh>
        <mesh position={[0, 0.85, 0.24]} material={m.black}>
          <boxGeometry args={[0.5, 0.62, 0.05]} />
        </mesh>
        <mesh position={[0, 0.24, 0]} material={m.steel}>
          <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
        </mesh>
      </group>

      {/* A logó útja */}
      <group ref={art} visible={false}>
        <mesh ref={paper} position={[0, 0, -0.01]} material={mats.paper} visible={false}>
          <planeGeometry args={[1.2, 1.2]} />
        </mesh>
        <mesh material={mats.logo}>
          <planeGeometry args={[1, 1]} />
        </mesh>
        <mesh ref={film} position={[-1.4, 0, 0.01]} material={mats.film} visible={false}>
          <planeGeometry args={[1.1, 1.1]} />
        </mesh>
      </group>

      {/* Fali panel és a kész cégtábla */}
      <mesh position={[0, 3.6, -2.65]} material={m.concrete}>
        <boxGeometry args={[4.6, 2.8, 0.08]} />
      </mesh>
      <mesh position={[0, 3.6, -2.6]} material={mats.glow}>
        <planeGeometry args={[2.6, 2.6]} />
      </mesh>
      <group ref={sign} position={[0, 3.6, -2.54]} visible={false}>
        <mesh material={m.yellow} castShadow>
          <boxGeometry args={[SIGN_SIZE * 0.92, SIGN_SIZE * 0.92, 0.12]} />
        </mesh>
        <mesh position={[0, 0, 0.065]} material={mats.signFace}>
          <planeGeometry args={[SIGN_SIZE, SIGN_SIZE]} />
        </mesh>
      </group>
    </group>
  );
}
