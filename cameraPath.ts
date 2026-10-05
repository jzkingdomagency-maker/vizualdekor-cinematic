import * as THREE from 'three';

type V3 = [number, number, number];
interface Key {
  t: number;
  pos: V3;
  look: V3;
}

/**
 * A kamera útvonala a műhelyen át. `t` a globális görgetési előrehaladás.
 * A pontokon centripetális Catmull-Rom görbe fut végig, így a mozgás
 * folyamatos, a munkaállomásoknál sűrűbb pontok lassítják a kamerát.
 */
const KEYS: Key[] = [
  // Kívül: közelítés az épülethez, majd be az ajtón.
  { t: 0, pos: [0, 2.6, 28], look: [0, 4.4, 0] },
  { t: 0.04, pos: [0, 2.3, 15], look: [0, 3.6, 0] },
  { t: 0.075, pos: [0, 2.1, 5], look: [0, 2.3, -8] },
  { t: 0.11, pos: [0, 2.0, -3], look: [0, 2.0, -18] },
  // DTF nyomtatás
  { t: 0.15, pos: [-4.6, 2.2, -5], look: [-10.6, 1.2, -7.2] },
  { t: 0.185, pos: [-7.3, 1.65, -6.5], look: [-10.6, 1.05, -7.0] },
  { t: 0.212, pos: [-6.9, 1.75, -8.9], look: [-10.6, 0.95, -9.4] },
  // Dekoráció
  { t: 0.25, pos: [3.6, 2.3, -7.6], look: [11, 2.0, -9.0] },
  { t: 0.285, pos: [6.4, 1.9, -8.4], look: [11, 1.8, -9.0] },
  { t: 0.312, pos: [7.2, 1.8, -6.4], look: [10.6, 1.4, -5.6] },
  // Autófóliázás: körbejárás az autó körül
  { t: 0.345, pos: [4.77, 2.4, -13.88], look: [0, 0.75, -19] },
  { t: 0.372, pos: [6.0, 1.6, -18.88], look: [0, 0.7, -19] },
  { t: 0.397, pos: [3.98, 1.25, -22.94], look: [0, 0.7, -19] },
  { t: 0.42, pos: [-0.05, 2.0, -25.2], look: [0, 0.75, -19] },
  { t: 0.438, pos: [-4.68, 2.7, -23.94], look: [-1, 0.8, -20] },
  // Épületüveg fóliázás, a végén az üveg mögül
  { t: 0.465, pos: [-4.2, 2.2, -25.5], look: [-11, 2.2, -27] },
  { t: 0.5, pos: [-6.6, 2.0, -27.6], look: [-11, 2.0, -27.2] },
  { t: 0.522, pos: [-8.2, 1.9, -31.6], look: [-12, 2.0, -27] },
  { t: 0.537, pos: [-12.6, 1.9, -32.4], look: [-11, 2.0, -27] },
  // Bérnyomtatás: a nyomat követése a reklámfelületig
  { t: 0.565, pos: [4.6, 1.9, -30.2], look: [11, 1.2, -28] },
  { t: 0.595, pos: [7.0, 1.35, -27.0], look: [10.4, 0.8, -28] },
  { t: 0.628, pos: [4.2, 2.4, -28.6], look: [15.9, 4.3, -28] },
  // Címkenyomtatás
  { t: 0.665, pos: [-5.6, 2.3, -33.8], look: [-10, 1.2, -38] },
  { t: 0.7, pos: [-6.9, 1.75, -35.3], look: [-9.4, 1.4, -37.6] },
  { t: 0.725, pos: [-6.6, 1.55, -36.9], look: [-8.6, 1.1, -39.1] },
  // Grafikai tervezés
  { t: 0.755, pos: [5.4, 2.2, -33.6], look: [10.1, 1.4, -38.2] },
  { t: 0.787, pos: [8.25, 1.5, -36.4], look: [10.2, 1.25, -38.2] },
  { t: 0.818, pos: [6.4, 2.2, -34.4], look: [11.6, 3.3, -39.6] },
  // Zászló és térdekoráció
  { t: 0.85, pos: [2.0, 1.8, -30.5], look: [0, 5.2, -37] },
  { t: 0.885, pos: [0, 1.5, -32.5], look: [0, 6.2, -39] },
  { t: 0.912, pos: [0, 2.1, -35.5], look: [0, 2.6, -46] },
  // Kilépés a hátsó kapun
  { t: 0.95, pos: [0, 2.2, -40], look: [0, 2.6, -52] },
  { t: 0.98, pos: [0, 2.4, -46.5], look: [0, 2.6, -60] },
  { t: 1, pos: [0, 2.5, -49], look: [0, 2.6, -60] },
];

const posCurve = new THREE.CatmullRomCurve3(
  KEYS.map((k) => new THREE.Vector3(...k.pos)),
  false,
  'centripetal',
);
const lookCurve = new THREE.CatmullRomCurve3(
  KEYS.map((k) => new THREE.Vector3(...k.look)),
  false,
  'centripetal',
);
const last = KEYS.length - 1;

export function sampleCamera(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3): void {
  let i = 0;
  while (i < last - 1 && p >= KEYS[i + 1].t) i += 1;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const u = Math.min(1, Math.max(0, (p - a.t) / (b.t - a.t)));
  const s = (i + u) / last;
  posCurve.getPoint(s, outPos);
  lookCurve.getPoint(s, outLook);
}
