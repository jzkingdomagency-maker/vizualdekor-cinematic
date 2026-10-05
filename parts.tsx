import { useEffect, useLayoutEffect, useMemo, useRef, type Ref } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getMaterials } from './materials';

type V3 = [number, number, number];

/** Sárga padlójelölés a munkaállomás köré. */
export function FloorFrame({ position, size, width = 0.08 }: { position: V3; size: [number, number]; width?: number }) {
  const m = getMaterials();
  const [w, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, 0.006, d / 2]} rotation={[-Math.PI / 2, 0, 0]} material={m.line}>
        <planeGeometry args={[w, width]} />
      </mesh>
      <mesh position={[0, 0.006, -d / 2]} rotation={[-Math.PI / 2, 0, 0]} material={m.line}>
        <planeGeometry args={[w, width]} />
      </mesh>
      <mesh position={[w / 2, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.line}>
        <planeGeometry args={[width, d]} />
      </mesh>
      <mesh position={[-w / 2, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.line}>
        <planeGeometry args={[width, d]} />
      </mesh>
    </group>
  );
}

interface AimedSpotProps {
  position: V3;
  target: V3;
  color?: string;
  intensity: number;
  angle?: number;
  penumbra?: number;
  distance?: number;
  decay?: number;
  castShadow?: boolean;
  shadowSize?: number;
}

/** Célpontra irányított spotlámpa; a cél mátrixát egyszer frissítjük. */
export function AimedSpot({
  position,
  target,
  color = '#ffffff',
  intensity,
  angle = 0.5,
  penumbra = 0.7,
  distance = 0,
  decay = 2,
  castShadow = false,
  shadowSize = 1024,
}: AimedSpotProps) {
  const ref = useRef<THREE.SpotLight>(null);
  const [tx, ty, tz] = target;
  useLayoutEffect(() => {
    const light = ref.current;
    if (!light) return;
    light.target.position.set(tx, ty, tz);
    light.target.updateMatrixWorld();
    light.shadow.mapSize.set(shadowSize, shadowSize);
    light.shadow.bias = -0.0005;
  }, [tx, ty, tz, shadowSize]);
  return (
    <spotLight
      ref={ref}
      position={position}
      color={color}
      intensity={intensity}
      angle={angle}
      penumbra={penumbra}
      distance={distance}
      decay={decay}
      castShadow={castShadow}
    />
  );
}

/** Szélben lobogó zászló egyszerű csúcspont-animációval. */
export function Flag({
  position,
  map,
  height = 6,
  size = [1.6, 1],
  flip = false,
}: {
  position: V3;
  map: THREE.Texture;
  height?: number;
  size?: [number, number];
  flip?: boolean;
}) {
  const m = getMaterials();
  const [fw, fh] = size;
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(fw, fh, 16, 8);
    g.translate(fw / 2, 0, 0);
    return g;
  }, [fw, fh]);
  const base = useMemo(() => Float32Array.from(geometry.attributes.position.array as ArrayLike<number>), [geometry]);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ map, side: THREE.DoubleSide, roughness: 0.85 }),
    [map],
  );
  const phase = position[0] * 0.7 + position[2] * 0.3;

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i += 1) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const k = x / fw;
      pos.setZ(i, (Math.sin(x * 3.1 - t * 3.3 + y) * 0.085 + Math.sin(x * 5.3 - t * 2.1) * 0.03) * k);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group position={position} rotation={[0, flip ? Math.PI : 0, 0]}>
      <mesh position={[0, height / 2, 0]} material={m.steel}>
        <cylinderGeometry args={[0.035, 0.045, height, 10]} />
      </mesh>
      <mesh position={[0, height + 0.05, 0]} material={m.steel}>
        <sphereGeometry args={[0.06, 12, 8]} />
      </mesh>
      <mesh geometry={geometry} material={material} position={[0.04, height - fh / 2 - 0.12, 0]} />
    </group>
  );
}

/** Rollup állvány. A `panelRef` csoport függőleges skálázása húzza ki a vásznat a talpból. */
export function Rollup({ map, position, rotation = 0, panelRef }: { map: THREE.Texture; position: V3; rotation?: number; panelRef?: Ref<THREE.Group> }) {
  const m = getMaterials();
  const material = useMemo(() => new THREE.MeshStandardMaterial({ map, roughness: 0.7 }), [map]);
  useEffect(() => () => material.dispose(), [material]);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.05, 0]} material={m.steel} castShadow>
        <boxGeometry args={[0.9, 0.1, 0.26]} />
      </mesh>
      <mesh position={[0.36, 1.1, -0.06]} material={m.steel}>
        <cylinderGeometry args={[0.012, 0.012, 2.1, 6]} />
      </mesh>
      <group ref={panelRef} position={[0, 0.1, 0.02]}>
        <mesh position={[0, 1, 0]} material={material}>
          <planeGeometry args={[0.85, 2]} />
        </mesh>
      </group>
    </group>
  );
}

/** Vágósík: helyi koordinátában megadott síkból számolja ki a világkoordinátás változatot. */
export class ClipPlane {
  readonly world = new THREE.Plane();
  private readonly local = new THREE.Plane();

  update(object: THREE.Object3D, nx: number, ny: number, nz: number, constant: number): void {
    object.updateWorldMatrix(true, false);
    this.local.normal.set(nx, ny, nz);
    this.local.constant = constant;
    this.world.copy(this.local).applyMatrix4(object.matrixWorld);
  }
}
