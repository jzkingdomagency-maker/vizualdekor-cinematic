import { useEffect } from 'react';
import Lenis from 'lenis';
import { measureJourney, updateJourney } from '../lib/journeyStore';
import { scrollState } from '../lib/scroll';

export function useSmoothScroll(enabled: boolean): void {
  useEffect(() => {
    scrollState.reducedMotion = !enabled;
    const onResize = () => measureJourney();
    window.addEventListener('resize', onResize);

    if (!enabled) {
      const onScroll = () => updateJourney();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    }

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    scrollState.lenis = lenis;
    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      updateJourney();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      scrollState.lenis = null;
      window.removeEventListener('resize', onResize);
    };
  }, [enabled]);
}
