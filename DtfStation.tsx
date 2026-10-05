import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { chapterById, chapterProgress } from '../../../data/journey';
import { journey } from '../../../lib/journeyStore';
import { ease, lerp, range } from '../../../lib/math';
import { getMaterials } from '../materials';
import { FloorFrame } from '../parts';
import type { SceneTextures } from '../textures';
import { STATIONS } from '../world';
import { shirtShape } from './shapes';

const chapter = chapterById('dtf');
const FILM_LENGTH = 0.95;
const FILM_TILT = -0.18;
const TABLE: [number, number, number] = [2.65, 0, 0.2];
const RACK_X = [2.2, 2.65, 3.1];

/** DTF munkaállomás: a nyomtató filmre nyomtat, a grafika a pólóra kerül, a hőprés rögzíti. */
export default function DtfStation({ tex }: { tex: SceneTextures }) {
  const m = getMaterials();
  const pose = STATIONS.dtf;
  const carriage = useRef<THREE.Mesh>(null);
  const film = useRef<THREE.Mesh>(null);
  const transfer = useRef<THREE.Mesh>(null);
  const press = useRef<THREE.Group>(null);
  const status = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    const flat = new THREE.ExtrudeGeometry(shirtShape(), {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    });
    flat.rotateX(-Math.PI / 2);
    const hanging = new THREE.ExtrudeGeometry(shirtShape(), { depth: 0.015, bevelEnabled: false });
    const filmPlane = new THREE.PlaneGeometry(1.5, 1);
    filmPlane.translate(0, -0.5, 0);
    return { flat, hanging, filmPlane };
  }, []);

  const mats = useMemo(
    () => ({
      film: new THREE.MeshStandardMaterial({
        map: tex.dtfFilm,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.22,
        metalness: 0.05,
        depthWrite: false,
      }),
      transfer: new THREE.MeshStandardMaterial({
        map: tex.dtfPrint,
        transparent: true,
        roughness: 0.6,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
      print: new THREE.MeshStandardMaterial({
        map: tex.dtfPrint,
        transparent: true,
        roughness: 0.65,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
    }),
    [tex],
  );

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mats).forEach((mat) => mat.dispose());
    },
    [geo, mats],
  );

  useFrame(({ clock }) => {
    const p = journey.progress;
    const l = chapterProgress(chapter, p);
    const near = p > chapter.start - 0.05 && p < chapter.end + 0.02;
    const t = clock.elapsedTime;

    if (carriage.current && near) carriage.current.position.x = Math.sin(t * 2.6) * 0.82;
    if (status.current) status.current.visible = near && Math.sin(t * 6) > -0.2;

    const len = Math.max(0.001, FILM_LENGTH * ease(l, 0.18, 0.62));
    if (film.current) film.current.scale.y = len;
    tex.dtfFilm.repeat.set(1, len / FILM_LENGTH);

    const u = ease(l, 0.66, 0.88);
    const tr = transfer.current;
    if (tr) {
      tr.visible = l > 0.64;
      tr.position.set(lerp(0, TABLE[0], u), lerp(0.5, 0.937, u) + Math.sin(Math.PI * u) * 0.45, lerp(0.55, 0.1, u));
      tr.rotation.set(lerp(FILM_TILT, -Math.PI / 2, u), 0, 0);
      tr.scale.setScalar(lerp(0.34, 0.26, u));
      mats.transfer.opacity = range(l, 0.64, 0.68);
    }

    if (press.current) {
      const down = ease(l, 0.88, 0.93) * (1 - ease(l, 0.95, 0.99));
      press.current.position.y = lerp(0.38, 0.06, down);
    }
  });

  return (
    <group position={pose.position} rotation={[0, pose.rotation, 0]}>
      <FloorFrame position={[1.1, 0, 0.1]} size={[5.6, 2.6]} />

      {/* Nyomtató */}
      <mesh position={[0, 0.45, 0]} material={m.machineDark} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.9, 0.85]} />
      </mesh>
      <mesh position={[0, 1.11, -0.02]} material={m.machineLight} castShadow>
        <boxGeometry args={[2.3, 0.42, 0.8]} />
      </mesh>
      <mesh position={[0, 1.36, 0.05]} material={m.steel}>
        <boxGeometry args={[2.1, 0.04, 0.06]} />
      </mesh>
      <mesh ref={carriage} position={[0, 1.42, 0.05]} material={m.yellow} castShadow>
        <boxGeometry args={[0.34, 0.16, 0.26]} />
      </mesh>
      <mesh position={[0, 1.03, 0.39]} material={m.black}>
        <boxGeometry args={[1.7, 0.04, 0.04]} />
      </mesh>
      <mesh position={[0, 1.38, -0.34]} rotation={[0, 0, Math.PI / 2]} material={m.filmRoll}>
        <cylinderGeometry args={[0.11, 0.11, 1.8, 24]} />
      </mesh>
      <mesh position={[0.85, 1.22, 0.39]} material={m.black}>
        <boxGeometry args={[0.28, 0.16, 0.02]} />
      </mesh>
      <mesh ref={status} position={[0.98, 1.22, 0.405]} material={m.yellowLight}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
      </mesh>

      {/* Kifutó DTF film */}
      <mesh
        ref={film}
        geometry={geo.filmPlane}
        material={mats.film}
        position={[0, 1.02, 0.43]}
        rotation={[FILM_TILT, 0, 0]}
        scale={[1, 0.001, 1]}
      />

      {/* Átvitt grafika */}
      <mesh ref={transfer} material={mats.transfer} visible={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Munkaasztal pólóval és hőpréssel */}
      <group position={TABLE}>
        <mesh position={[0, 0.88, 0]} material={m.black} receiveShadow castShadow>
          <boxGeometry args={[1.7, 0.06, 1.0]} />
        </mesh>
        {[-0.78, 0.78].map((x) =>
          [-0.44, 0.44].map((z) => (
            <mesh key={`${x}:${z}`} position={[x, 0.425, z]} material={m.steel}>
              <boxGeometry args={[0.05, 0.85, 0.05]} />
            </mesh>
          )),
        )}
        <mesh geometry={geo.flat} material={m.fabric} position={[0, 0.912, 0]} castShadow receiveShadow />
        <group position={[0, 0.9, -0.1]}>
          <mesh position={[0, 0.3, -0.33]} material={m.machineDark}>
            <boxGeometry args={[0.08, 0.6, 0.08]} />
          </mesh>
          <mesh position={[0, 0.58, -0.17]} material={m.machineDark}>
            <boxGeometry args={[0.1, 0.06, 0.4]} />
          </mesh>
          <group ref={press} position={[0, 0.38, 0.02]}>
            <mesh material={m.steel} castShadow>
              <boxGeometry args={[0.46, 0.05, 0.42]} />
            </mesh>
            <mesh position={[0, 0.05, 0]} material={m.yellow}>
              <boxGeometry args={[0.3, 0.05, 0.26]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Kész darabok a fogason */}
      <group position={[0, 0, -0.85]}>
        <mesh position={[2.65, 1.75, 0]} rotation={[0, 0, Math.PI / 2]} material={m.steel}>
          <cylinderGeometry args={[0.015, 0.015, 1.6, 8]} />
        </mesh>
        {[1.88, 3.42].map((x) => (
          <mesh key={x} position={[x, 0.875, 0]} material={m.steel}>
            <cylinderGeometry args={[0.02, 0.02, 1.75, 8]} />
          </mesh>
        ))}
        {RACK_X.map((x, i) => (
          <group key={x} position={[x, 1.3, 0]}>
            <mesh geometry={geo.hanging} material={i === 1 ? m.fabricLight : m.fabric} castShadow />
            <mesh position={[0, 0.08, 0.02]} material={mats.print}>
              <planeGeometry args={[0.22, 0.22]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
