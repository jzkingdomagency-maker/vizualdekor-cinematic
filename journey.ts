import type { ServiceId } from './services';

export type ChapterId = 'intro' | ServiceId | 'exit';

export interface Chapter {
  id: ChapterId;
  /** Globális előrehaladás (0–1), ahol a jelenet kezdődik. */
  start: number;
  end: number;
  /** A jelenet helyi előrehaladása, ahová a navigáció a kamerát viszi. */
  focus: number;
}

export const chapters: Chapter[] = [
  { id: 'intro', start: 0, end: 0.12, focus: 0 },
  { id: 'dtf', start: 0.12, end: 0.22, focus: 0.5 },
  { id: 'decor', start: 0.22, end: 0.32, focus: 0.55 },
  { id: 'wrap', start: 0.32, end: 0.44, focus: 0.45 },
  { id: 'glass', start: 0.44, end: 0.54, focus: 0.55 },
  { id: 'largeformat', start: 0.54, end: 0.64, focus: 0.4 },
  { id: 'labels', start: 0.64, end: 0.73, focus: 0.55 },
  { id: 'design', start: 0.73, end: 0.83, focus: 0.5 },
  { id: 'space', start: 0.83, end: 0.92, focus: 0.5 },
  { id: 'exit', start: 0.92, end: 1, focus: 0 },
];

export function chapterById(id: ChapterId): Chapter {
  const chapter = chapters.find((c) => c.id === id);
  if (!chapter) throw new Error(`Ismeretlen jelenet: ${id}`);
  return chapter;
}

export function chapterProgress(chapter: Chapter, p: number): number {
  const t = (p - chapter.start) / (chapter.end - chapter.start);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}
