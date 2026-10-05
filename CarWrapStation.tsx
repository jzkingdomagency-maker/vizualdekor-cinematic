import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { chapterById, chapterProgress } from '../../../data/journey';
import { journey } from '../../../lib/journeyStore';
import { ease, lerp } from '../../../lib/math';
import { getMaterials } from '../materials';
import { ClipPlane } from '../parts';
import { YELLOW } from '../textures';
import { STATIONS } from '../world';
import { carBodyShape, carCabinShape, carRoofShape } from './shapes';

const chapter = chapterById('wrap');
const CAR_START = -2.45;
const CAR_END = 2.5;
const WHEELS: [number, number][] = [
  [-1.45, 1],
  [-1.45, -1],
  [1.45, 1],
  [1.45, -1],
];

/** Autófóliázás: előkészítés, a fólia végigfut a karosszérián, majd a szélek kidolgozása. */
export default function CarWrapStation() {
  const m = getMaterials();
  const pose = STATIONS.wrap;
  const car = useRef<THREE.Group>(null);
  const line = useRef<THREE.Mesh>(null);
  const tools = useRef<THREE.Group>(null);
  const roll = useRef<THREE.Mesh>(null);
  const sheet = useRef<THREE.Mesh>(null);
  const edges = useRef<THREE.Group>(null);
  const clip = useMemo(() => new ClipPlane(), []);

  const geo = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(carBodyShape(), {
      depth: 1.86,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 5,
      curveSegments: 28,
    });
    body.translate(0, 0, -0.93);
    const cabin = new THREE.ExtrudeGeometry(carCabinShape(), {
      depth: 1.42,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 20,
    });
    cabin.translate(0, 0, -0.71);
    const roof = new THREE.ExtrudeGeometry(carRoofShape(), {
      depth: 1.34,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 20,
    });
    roof.translate(0, 0, -0.67);
    const sheetPlane = new THREE.PlaneGeometry(1, 1.9);
    sheetPlane.translate(0.5, 0, 0);
    sheetPlane.rotateX(-Math.PI / 2);
    return { body, cabin, roof, sheetPlane };
  }, []);

  const mats = useMemo(
    () => ({
      wrap: new THREE.MeshPhysicalMaterial({
        color: YELLOW,
        roughness: 0.42,
        metalness: 0.08,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        clippingPlanes: [clip.world],
      }),
      line: new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.6, toneMapped: false }),
      sheet: new THREE.MeshStandardMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 0.85,
        roughness: 0.35,
        side: THREE.DoubleSide,
      }),
      edge: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, toneMapped: false }),
      ring: new THREE.MeshBasicMaterial({ color: YELLOW, toneMapped: false }),
      tail: new THREE.MeshBasicMaterial({ color: '#d0021b', toneMapped: false }),
    }),
    [clip],
  );

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mats).forEach((mat) => mat.dispose());
    },
    [geo, mats],
  );

  useFrame(({ clock }) => {
    const group = car.current;
    if (!group) return;
    const l = chapterProgress(chapter, journey.progress);
    const t = clock.elapsedTime;

    const prep = ease(l, 0.14, 0.34);
    const apply = ease(l, 0.35, 0.78);
    const finish = ease(l, 0.78, 0.92);
    const c = lerp(CAR_START, CAR_END, apply);
    clip.update(group, -1, 0, 0, c);

    const applying = apply > 0.001 && apply < 0.999;
    if (line.current) {
      line.current.visible = applying;
      line.current.position.x = c;
    }
    if (tools.current) {
      tools.current.visible = applying;
      tools.current.position.set(c + 0.02, 0.62 + Math.sin(t * 8) * 0.22, 0);
    }
    if (roll.current) roll.current.rotation.y = prep * 9 + apply * 14;
    if (sheet.current) {
      sheet.current.scale.x = Math.max(0.001, prep * 0.85);
      mats.sheet.opacity = 0.85 * (1 - ease(l, 0.36, 0.44));
      sheet.current.visible = mats.sheet.opacity > 0.01 && prep > 0.001;
    }
    if (edges.current) {
      edges.current.visible = finish > 0.001 && l < 0.97;
      edges.current.scale.x = Math.max(0.001, finish);
      mats.edge.opacity = 0.9 * (1 - ease(l, 0.92, 0.97));
    }
  });

  return (
    <group position={pose.position}>
      <mesh position={[0, 0.05, 0]} material={m.platform} receiveShadow>
        <cylinderGeometry args={[3.4, 3.4, 0.1, 64]} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.ring}>
        <torusGeometry args={[3.4, 0.02, 8, 120]} />
      </mesh>

      <group ref={car} position={[0, 0.1, 0]} rotation={[0, pose.rotation, 0]}>
        {/* Eredeti fényezés */}
        <mesh geometry={geo.body} material={m.carPaint} castShadow receiveShadow />
        <mesh geometry={geo.roof} material={m.carPaint} castShadow />
        <mesh geometry={geo.cabin} material={m.darkGlass} castShadow />

        {/* Fólia réteg, a vágósík mögött jelenik meg */}
        <mesh geometry={geo.body} material={mats.wrap} scale={1.004} />
        <mesh geometry={geo.roof} material={mats.wrap} scale={1.006} />

        {WHEELS.map(([x, side]) => (
          <group key={`${x}:${side}`} position={[x, 0.33, side * 0.87]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={m.tire} castShadow>
              <cylinderGeometry args={[0.33, 0.33, 0.25, 32]} />
            </mesh>
            <mesh position={[0, side * -0.01, 0]} material={m.rim}>
              <cylinderGeometry args={[0.22, 0.22, 0.262, 24]} />
            </mesh>
            <mesh position={[0.12, side * -0.06, -0.08]} material={m.yellow}>
              <boxGeometry args={[0.12, 0.05, 0.12]} />
            </mesh>
          </group>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[2.37, 0.64, s * 0.66]} rotation={[0, 0.3 * s, 0]} material={m.whiteLight}>
            <boxGeometry args={[0.06, 0.05, 0.34]} />
          </mesh>
        ))}
        <mesh position={[-2.43, 0.8, 0]} material={mats.tail}>
          <boxGeometry args={[0.03, 0.04, 1.6]} />
        </mesh>

        {/* Felhelyezési vonal és simítók */}
        <mesh ref={line} material={mats.line} position={[CAR_START, 0.82, 0]} visible={false}>
          <boxGeometry args={[0.015, 1.15, 2.1]} />
        </mesh>
        <group ref={tools} visible={false}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0, 0, s * 1.08]} material={m.yellow}>
              <boxGeometry args={[0.1, 0.16, 0.03]} />
            </mesh>
          ))}
        </group>

        {/* Előkészítés: fóliatekercs és kihúzott fólia */}
        <group position={[-3.3, 0, 0]}>
          {[-1.05, 1.05].map((z) => (
            <mesh key={z} position={[0, 0.5, z]} material={m.steel}>
              <boxGeometry args={[0.06, 1.0, 0.06]} />
            </mesh>
          ))}
          <mesh ref={roll} position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.yellow} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 2.0, 32]} />
          </mesh>
          <mesh ref={sheet} geometry={geo.sheetPlane} material={mats.sheet} position={[0.12, 1.0, 0]} visible={false} />
        </group>

        {/* Szélek kidolgozása a küszöb mentén */}
        <group ref={edges} position={[CAR_START, 0.27, 0]} visible={false}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[(CAR_END - CAR_START) / 2, 0, s * 1.01]} material={mats.edge}>
              <boxGeometry args={[CAR_END - CAR_START, 0.012, 0.012]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
