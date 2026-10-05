import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { chapterById, chapterProgress } from '../../../data/journey';
import { journey } from '../../../lib/journeyStore';
import { ease } from '../../../lib/math';
import { getMaterials } from '../materials';
import { FloorFrame } from '../parts';
import type { SceneTextures } from '../textures';
import { STATIONS } from '../world';

const chapter = chapterById('labels');
const CUTTER = new THREE.Vector3(0.3, 1.3, 0);
const JAR = new THREE.Vector3(1.8, 1.05, 0.2);
const FLOATING = 6;
const JARS: [number, number][] = [
  [2.18, -0.12],
  [1.45, -0.18],
];

/** Címkenyomtatás: tekercsről nyomtatott, vágott címkék, amelyek a termékre kerülnek. */
export default function LabelStation({ tex }: { tex: SceneTextures }) {
  const m = getMaterials();
  const pose = STATIONS.labels;
  const unwind = useRef<THREE.Mesh>(null);
  const rewind = useRef<THREE.Mesh>(null);
  const cutter = useRef<THREE.Mesh>(null);
  const curved = useRef<THREE.Mesh>(null);
  const labels = useRef<(THREE.Mesh | null)[]>([]);
  const tmp = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3() }), []);

  const hover = useMemo(
    () =>
      Array.from({ length: FLOATING }, (_, i) => new THREE.Vector3(-0.7 + i * 0.3, 1.75 + (i % 2) * 0.2, 1.1 + (i % 3) * 0.18)),
    [],
  );

  const mats = useMemo(
    () => ({
      strip: new THREE.MeshStandardMaterial({ map: tex.labelStrip, roughness: 0.6 }),
      label: new THREE.MeshStandardMaterial({ map: tex.label, transparent: true, roughness: 0.5, side: THREE.DoubleSide }),
      curved: new THREE.MeshStandardMaterial({ map: tex.label, transparent: true, roughness: 0.45, side: THREE.DoubleSide }),
      jar: new THREE.MeshStandardMaterial({ color: '#d9961c', roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.88 }),
    }),
    [tex],
  );

  useEffect(() => {
    tex.labelStrip.repeat.set(2, 1);
    return () => Object.values(mats).forEach((mat) => mat.dispose());
  }, [mats, tex]);

  useFrame(({ clock }, delta) => {
    const p = journey.progress;
    const l = chapterProgress(chapter, p);
    const near = p > chapter.start - 0.05 && p < chapter.end + 0.02;
    const t = clock.elapsedTime;
    if (near) {
      const speed = Math.min(delta, 0.05) * 0.35;
      tex.labelStrip.offset.x -= speed;
      if (unwind.current) unwind.current.rotation.y += speed * 9;
      if (rewind.current) rewind.current.rotation.y += speed * 12;
      if (cutter.current) cutter.current.position.y = 1.36 + Math.max(0, Math.sin(t * 7)) * -0.05;
    }

    for (let i = 0; i < FLOATING; i += 1) {
      const mesh = labels.current[i];
      if (!mesh) continue;
      const rise = ease(l, 0.3 + i * 0.03, 0.5 + i * 0.03);
      const land = ease(l, 0.7 + i * 0.015, 0.84 + i * 0.015);
      tmp.a.copy(CUTTER).lerp(hover[i], rise);
      tmp.a.y += Math.sin(t * 1.4 + i) * 0.03 * rise * (1 - land);
      tmp.b.copy(tmp.a).lerp(JAR, land);
      mesh.position.copy(tmp.b);
      mesh.rotation.set(-0.2 * rise * (1 - land), Math.sin(t * 0.7 + i) * 0.4 * rise * (1 - land), 0);
      mesh.scale.setScalar(Math.max(0.001, 1 - land * 0.8));
      mesh.visible = rise > 0.001 && land < 0.995;
    }

    if (curved.current) curved.current.scale.setScalar(Math.max(0.001, ease(l, 0.82, 0.92)));
  });

  return (
    <group position={pose.position} rotation={[0, pose.rotation, 0]}>
      <FloorFrame position={[0.6, 0, 0.3]} size={[4, 2]} />

      <mesh position={[0.5, 0.88, 0]} material={m.black} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.06, 1.0]} />
      </mesh>
      {[-1, 2].map((x) =>
        [-0.44, 0.44].map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 0.425, z]} material={m.steel}>
            <boxGeometry args={[0.05, 0.85, 0.05]} />
          </mesh>
        )),
      )}

      {/* Tekercses címkenyomtató */}
      <mesh position={[0, 0.98, 0]} material={m.machineDark}>
        <boxGeometry args={[2.3, 0.14, 0.5]} />
      </mesh>
      <group position={[-0.95, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={unwind} material={m.paper} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 0.2, 32]} />
        </mesh>
      </group>
      <group position={[0.95, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={rewind} material={m.paper} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 32]} />
        </mesh>
      </group>
      <mesh position={[0, 1.255, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.strip}>
        <planeGeometry args={[1.9, 0.14]} />
      </mesh>
      <mesh position={[-0.35, 1.34, 0]} material={m.machineDark} castShadow>
        <boxGeometry args={[0.26, 0.16, 0.26]} />
      </mesh>
      <mesh position={[-0.35, 1.34, 0.131]} material={m.yellow}>
        <boxGeometry args={[0.26, 0.03, 0.005]} />
      </mesh>
      <mesh ref={cutter} position={[0.3, 1.36, 0]} material={m.steel}>
        <boxGeometry args={[0.04, 0.14, 0.24]} />
      </mesh>

      {/* Lebegő címkék */}
      {Array.from({ length: FLOATING }, (_, i) => (
        <mesh
          key={i}
          ref={(node) => {
            labels.current[i] = node;
          }}
          material={mats.label}
          visible={false}
        >
          <planeGeometry args={[0.26, 0.16]} />
        </mesh>
      ))}

      {/* Mézesüvegek a kész címkékkel */}
      <group position={[JAR.x, 0.91, JAR.z]}>
        <mesh position={[0, 0.15, 0]} material={mats.jar} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.3, 32]} />
        </mesh>
        <mesh position={[0, 0.325, 0]} material={m.black}>
          <cylinderGeometry args={[0.145, 0.145, 0.05, 32]} />
        </mesh>
        <mesh ref={curved} position={[0, 0.15, 0]} material={mats.curved} scale={0.001}>
          <cylinderGeometry args={[0.143, 0.143, 0.13, 32, 1, true, -0.8, 1.6]} />
        </mesh>
      </group>
      {JARS.map(([x, z]) => (
        <group key={x} position={[x, 0.91, z]}>
          <mesh position={[0, 0.15, 0]} material={mats.jar} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.3, 32]} />
          </mesh>
          <mesh position={[0, 0.325, 0]} material={m.black}>
            <cylinderGeometry args={[0.145, 0.145, 0.05, 32]} />
          </mesh>
          <mesh position={[0, 0.15, 0]} material={mats.curved}>
            <cylinderGeometry args={[0.143, 0.143, 0.13, 32, 1, true, -0.8, 1.6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
