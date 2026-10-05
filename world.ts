export type StationId = 'dtf' | 'decor' | 'wrap' | 'glass' | 'largeformat' | 'labels' | 'design';

export interface StationPose {
  position: [number, number, number];
  /** Elforgatás az Y tengely körül; a munkaállomás helyi +Z iránya néz a közlekedősáv felé. */
  rotation: number;
}

/** A műhely alaprajza (méterben). A bejárat a z = 0 síkon van, a csarnok a -Z irányba nyúlik. */
export const HALL = { width: 36, depth: 44, height: 9, doorWidth: 5, doorHeight: 5.5, exitWidth: 8, exitHeight: 6 } as const;

export const STATIONS: Record<StationId, StationPose> = {
  dtf: { position: [-11, 0, -7], rotation: Math.PI / 2 },
  decor: { position: [11, 0, -9], rotation: -Math.PI / 2 },
  wrap: { position: [0, 0, -19], rotation: 0.35 },
  glass: { position: [-11, 0, -27], rotation: Math.PI / 2 },
  largeformat: { position: [11, 0, -28], rotation: -Math.PI / 2 },
  labels: { position: [-10, 0, -38], rotation: Math.PI / 4 },
  design: { position: [10, 0, -38], rotation: -Math.PI / 4 },
};
