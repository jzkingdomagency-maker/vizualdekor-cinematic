import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Tier } from '../../hooks/useDeviceTier';
import Building from './Building';
import CameraRig from './CameraRig';
import Lights from './Lights';
import CarWrapStation from './stations/CarWrapStation';
import DecorStation from './stations/DecorStation';
import DesignStation from './stations/DesignStation';
import DtfStation from './stations/DtfStation';
import GlassStation from './stations/GlassStation';
import LabelStation from './stations/LabelStation';
import LargeFormatStation from './stations/LargeFormatStation';
import SpaceDecor from './stations/SpaceDecor';
import { useSceneTextures } from './textures';

interface ExperienceProps {
  tier: Tier;
  active: boolean;
  onReady: () => void;
}

/** Visszafogott környezeti fény a fényes felületek (autó, üveg, padló) tükröződéséhez. */
function Reflections() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    (room as unknown as { dispose?: () => void }).dispose?.();
    scene.environment = env;
    scene.environmentIntensity = 0.35;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 2) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

export default function Experience({ tier, active, onReady }: ExperienceProps) {
  const textures = useSceneTextures();
  const dpr: [number, number] = tier === 'high' ? [1, 1.75] : tier === 'mid' ? [1, 1.5] : [1, 1.25];

  return (
    <Canvas
      dpr={dpr}
      shadows={tier === 'high'}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: tier !== 'low', powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ fov: tier === 'low' ? 60 : 45, near: 0.1, far: 140, position: [0, 2.6, 28] }}
      onCreated={({ gl, scene }) => {
        gl.localClippingEnabled = true;
        gl.toneMappingExposure = 1.05;
        scene.background = new THREE.Color('#000000');
        scene.fog = new THREE.Fog('#000000', 30, 95);
      }}
    >
      <Reflections />
      <Lights tier={tier} />
      <CameraRig parallax={tier !== 'low'} />
      {textures ? (
        <>
          <Building tex={textures} />
          <DtfStation tex={textures} />
          <DecorStation tex={textures} />
          <CarWrapStation />
          <GlassStation tex={textures} />
          <LargeFormatStation tex={textures} />
          <LabelStation tex={textures} />
          <DesignStation tex={textures} />
          <SpaceDecor tex={textures} lowDetail={tier === 'low'} />
          <ReadySignal onReady={onReady} />
        </>
      ) : null}
    </Canvas>
  );
}
