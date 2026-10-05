import * as THREE from 'three';
import { YELLOW } from './textures';

export interface Materials {
  facade: THREE.MeshStandardMaterial;
  interior: THREE.MeshStandardMaterial;
  roof: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
  ground: THREE.MeshStandardMaterial;
  concrete: THREE.MeshStandardMaterial;
  black: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  yellow: THREE.MeshStandardMaterial;
  yellowLight: THREE.MeshBasicMaterial;
  whiteLight: THREE.MeshBasicMaterial;
  line: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  darkGlass: THREE.MeshStandardMaterial;
  windowGlow: THREE.MeshStandardMaterial;
  machineLight: THREE.MeshStandardMaterial;
  machineDark: THREE.MeshStandardMaterial;
  fabric: THREE.MeshStandardMaterial;
  fabricLight: THREE.MeshStandardMaterial;
  tire: THREE.MeshStandardMaterial;
  rim: THREE.MeshStandardMaterial;
  carPaint: THREE.MeshPhysicalMaterial;
  platform: THREE.MeshStandardMaterial;
  shopWall: THREE.MeshStandardMaterial;
  paper: THREE.MeshStandardMaterial;
  filmRoll: THREE.MeshStandardMaterial;
  plant: THREE.MeshStandardMaterial;
}

let cache: Materials | null = null;

/** Közös anyagok egyetlen példányban, hogy a GPU ne fordítson feleslegesen shadereket. */
export function getMaterials(): Materials {
  if (cache) return cache;
  const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
  cache = {
    facade: std({ color: '#ecebe8', roughness: 0.82 }),
    interior: std({ color: '#141414', roughness: 0.92 }),
    roof: std({ color: '#1e1e1e', roughness: 0.9 }),
    floor: std({ color: '#1b1b1b', roughness: 0.36, metalness: 0.25 }),
    ground: std({ color: '#0b0b0b', roughness: 0.96 }),
    concrete: std({ color: '#2a2a2a', roughness: 0.9 }),
    black: std({ color: '#0f0f0f', roughness: 0.55, metalness: 0.2 }),
    steel: std({ color: '#9a9ea3', roughness: 0.32, metalness: 0.85 }),
    yellow: std({ color: YELLOW, roughness: 0.42, metalness: 0.05 }),
    yellowLight: new THREE.MeshBasicMaterial({ color: YELLOW, toneMapped: false }),
    whiteLight: new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
    line: std({ color: YELLOW, roughness: 0.7 }),
    glass: std({
      color: '#a9c1cc',
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    darkGlass: std({ color: '#0b0e11', roughness: 0.08, metalness: 0.9 }),
    windowGlow: std({ color: '#0d0d0d', roughness: 0.15, metalness: 0.8, emissive: YELLOW, emissiveIntensity: 0.07 }),
    machineLight: std({ color: '#e7e7e4', roughness: 0.45, metalness: 0.1 }),
    machineDark: std({ color: '#202020', roughness: 0.6, metalness: 0.2 }),
    fabric: std({ color: '#141414', roughness: 0.98 }),
    fabricLight: std({ color: '#e9e9e6', roughness: 0.98 }),
    tire: std({ color: '#111111', roughness: 0.85 }),
    rim: std({ color: '#2d2f33', roughness: 0.25, metalness: 0.9 }),
    carPaint: new THREE.MeshPhysicalMaterial({
      color: '#c8ccd2',
      roughness: 0.28,
      metalness: 0.55,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    platform: std({ color: '#151515', roughness: 0.25, metalness: 0.6 }),
    shopWall: std({ color: '#d9d7d2', roughness: 0.9, emissive: '#3a3833', emissiveIntensity: 0.6 }),
    paper: std({ color: '#f4f4f2', roughness: 0.75, side: THREE.DoubleSide }),
    filmRoll: std({ color: '#dfe7ea', roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.9 }),
    plant: std({ color: '#1f3a24', roughness: 0.9 }),
  };
  return cache;
}
