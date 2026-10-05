import type Lenis from 'lenis';
import { clamp, easeInOutCubic } from './math';

export const scrollState: { lenis: Lenis | null; reducedMotion: boolean } = {
  lenis: null,
  reducedMotion: false,
};

/** Görgetés egy pozícióra. Lenis mellett a hossz a távolsággal arányos, így a kamera filmszerűen repül át a jeleneteken. */
export function scrollToY(y: number, onDone?: () => void, instant = false): void {
  const target = Math.max(0, y);
  const lenis = scrollState.lenis;
  if (lenis && instant) {
    lenis.scrollTo(target, { immediate: true, force: true });
    onDone?.();
    return;
  }
  if (lenis && !scrollState.reducedMotion) {
    const distance = Math.abs(target - window.scrollY) / Math.max(1, window.innerHeight);
    const duration = clamp(0.9 + distance * 0.22, 1.1, 4.8);
    lenis.scrollTo(target, {
      duration,
      easing: easeInOutCubic,
      onComplete: () => onDone?.(),
    });
    return;
  }
  window.scrollTo({ top: target, behavior: 'auto' });
  onDone?.();
}

export function scrollToElement(el: HTMLElement, instant = false): void {
  const y = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(y, () => el.focus({ preventScroll: true }), instant);
}

export function lockScroll(locked: boolean): void {
  const lenis = scrollState.lenis;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
