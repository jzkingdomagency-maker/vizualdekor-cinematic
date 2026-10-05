import { clamp } from './math';

type Listener = (progress: number) => void;

const listeners = new Set<Listener>();
let element: HTMLElement | null = null;
let top = 0;
let span = 1;

/** A filmszerű bejárás globális előrehaladása (0–1). A 3D jelenet minden képkockán innen olvas. */
export const journey = { progress: 0 };

export function setJourneyElement(node: HTMLElement | null): void {
  element = node;
  measureJourney();
}

export function measureJourney(): void {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  top = rect.top + window.scrollY;
  span = Math.max(1, element.offsetHeight - window.innerHeight);
  updateJourney(true);
}

export function updateJourney(force = false): void {
  if (!element) return;
  const p = clamp((window.scrollY - top) / span);
  if (!force && Math.abs(p - journey.progress) < 1e-5) return;
  journey.progress = p;
  listeners.forEach((listener) => listener(p));
}

export function subscribeJourney(listener: Listener): () => void {
  listeners.add(listener);
  listener(journey.progress);
  return () => {
    listeners.delete(listener);
  };
}

export function hasJourney(): boolean {
  return element !== null;
}

export function journeyScrollY(p: number): number {
  return top + clamp(p) * span;
}
