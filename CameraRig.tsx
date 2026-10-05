import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { journey } from '../../lib/journeyStore';
import { sampleCamera } from './cameraPath';

/** A görgetés vezérli a kamerát; csillapítással követi az útvonalat, egérrel enyhe parallaxis. */
export default function CameraRig({ parallax }: { parallax: boolean }) {
  const camera = useThree((s) => s.camera);
  const state = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      currentLook: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      pointer: new THREE.Vector2(),
      smoothPointer: new THREE.Vector2(),
      initialised: false,
    }),
    [],
  );

  useEffect(() => {
    if (!parallax) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      state.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [parallax, state]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    sampleCamera(journey.progress, state.pos, state.look);
    state.smoothPointer.lerp(state.pointer, 1 - Math.exp(-dt * 3));
    state.forward.subVectors(state.look, state.pos).normalize();
    state.right.crossVectors(state.forward, state.up).normalize();
    state.pos.addScaledVector(state.right, state.smoothPointer.x * 0.16).addScaledVector(state.up, state.smoothPointer.y * 0.08);

    if (!state.initialised) {
      camera.position.copy(state.pos);
      state.currentLook.copy(state.look);
      state.initialised = true;
    }
    const k = 1 - Math.exp(-dt * 4.5);
    camera.position.lerp(state.pos, k);
    state.currentLook.lerp(state.look, k);
    camera.lookAt(state.currentLook);
  });

  return null;
}
