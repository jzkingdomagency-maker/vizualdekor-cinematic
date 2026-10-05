export const clamp = (v: number, min = 0, max = 1): number => (v < min ? min : v > max ? max : v);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** A `v` érték helye az [a, b] tartományban, 0–1 közé szorítva. */
export const range = (v: number, a: number, b: number): number => clamp((v - a) / (b - a));

export const smoother = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10);

/** `range` és `smoother` egyben. */
export const ease = (v: number, a: number, b: number): number => smoother(range(v, a, b));

export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const pad2 = (n: number): string => String(n).padStart(2, '0');
