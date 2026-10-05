import * as THREE from 'three';

/** Póló sziluett (méterben), középre igazítva. */
export function shirtShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.17, 0.39);
  s.quadraticCurveTo(0, 0.31, 0.17, 0.39);
  s.lineTo(0.44, 0.27);
  s.lineTo(0.36, 0.1);
  s.lineTo(0.25, 0.15);
  s.lineTo(0.25, -0.39);
  s.lineTo(-0.25, -0.39);
  s.lineTo(-0.25, 0.15);
  s.lineTo(-0.36, 0.1);
  s.lineTo(-0.44, 0.27);
  s.closePath();
  return s;
}

/** Sportautó karosszéria oldalnézete kerékjáratokkal (hossz az X tengelyen, eleje +X). */
export function carBodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-2.3, 0.3);
  s.lineTo(-1.84, 0.3);
  s.absarc(-1.45, 0.34, 0.39, Math.PI, 0, true);
  s.lineTo(1.06, 0.3);
  s.absarc(1.45, 0.34, 0.39, Math.PI, 0, true);
  s.lineTo(2.25, 0.3);
  s.quadraticCurveTo(2.38, 0.36, 2.34, 0.5);
  s.lineTo(2.3, 0.62);
  s.quadraticCurveTo(1.9, 0.72, 1.6, 0.78);
  s.quadraticCurveTo(1.3, 0.86, 1.1, 0.92);
  s.lineTo(-1.6, 0.98);
  s.quadraticCurveTo(-2.05, 0.96, -2.2, 0.88);
  s.quadraticCurveTo(-2.36, 0.8, -2.33, 0.62);
  s.lineTo(-2.3, 0.3);
  return s;
}

/** Az utastér üvegháza. */
export function carCabinShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.62, 0.95);
  s.quadraticCurveTo(-1.1, 1.18, -0.55, 1.3);
  s.lineTo(0.4, 1.31);
  s.quadraticCurveTo(0.8, 1.18, 1.15, 0.95);
  s.closePath();
  return s;
}

/** A tető fényezett héja. */
export function carRoofShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.25, 1.165);
  s.quadraticCurveTo(-0.9, 1.29, -0.55, 1.335);
  s.lineTo(0.4, 1.345);
  s.quadraticCurveTo(0.65, 1.27, 0.86, 1.155);
  s.lineTo(0.8, 1.13);
  s.quadraticCurveTo(0.6, 1.24, 0.38, 1.31);
  s.lineTo(-0.53, 1.3);
  s.quadraticCurveTo(-0.88, 1.255, -1.2, 1.14);
  s.closePath();
  return s;
}

/** V térbetű. */
export function letterV(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1, 2.6);
  s.lineTo(-0.55, 2.6);
  s.lineTo(0, 0.85);
  s.lineTo(0.55, 2.6);
  s.lineTo(1, 2.6);
  s.lineTo(0.28, 0);
  s.lineTo(-0.28, 0);
  s.closePath();
  return s;
}

/** D térbetű belső kivágással. */
export function letterD(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.05, 0);
  s.lineTo(-1.05, 2.6);
  s.lineTo(-0.25, 2.6);
  s.absarc(-0.25, 1.3, 1.3, Math.PI / 2, -Math.PI / 2, true);
  s.lineTo(-1.05, 0);
  const hole = new THREE.Path();
  hole.moveTo(-0.6, 0.45);
  hole.lineTo(-0.25, 0.45);
  hole.absarc(-0.25, 1.3, 0.85, -Math.PI / 2, Math.PI / 2, false);
  hole.lineTo(-0.6, 2.15);
  hole.lineTo(-0.6, 0.45);
  s.holes.push(hole);
  return s;
}
