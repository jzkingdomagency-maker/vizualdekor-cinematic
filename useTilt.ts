import { useEffect, useRef } from 'react';
import { clamp } from '../lib/math';

interface TiltOptions {
  /** Maximális elfordulás fokban az Y tengely körül. */
  max?: number;
  enabled?: boolean;
}

interface Axis {
  x: number;
  v: number;
  target: number;
}

const STIFFNESS = 150;
const DAMPING = 19;

function stepAxis(a: Axis, dt: number): void {
  const accel = STIFFNESS * (a.target - a.x) - DAMPING * a.v;
  a.v += accel * dt;
  a.x += a.v * dt;
}

function settled(a: Axis): boolean {
  return Math.abs(a.target - a.x) < 0.0005 && Math.abs(a.v) < 0.0005;
}

/**
 * Fizikai kártyaszerű dőlés rugós csillapítással. Az egér helyzete a kártya
 * középpontjához képest mérve fordítja el az elemet (-1 → -max°, +1 → +max°).
 * Érintőképernyőn ujjhúzásra és görgetésre reagál.
 */
export function useTilt<T extends HTMLElement>({ max = 5, enabled = true }: TiltOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const rx: Axis = { x: 0, v: 0, target: 0 };
    const ry: Axis = { x: 0, v: 0, target: 0 };
    const sc: Axis = { x: 1, v: 0, target: 1 };
    const pointer = { x: 0, y: 0, active: false };
    let visible = false;
    let hovering = false;
    let touching = false;
    let frame = 0;
    let last = 0;

    const computeTargets = () => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (touching) {
        const nx = clamp((pointer.x - cx) / (rect.width / 2), -1, 1);
        const ny = clamp((pointer.y - cy) / (rect.height / 2), -1, 1);
        ry.target = nx * max;
        rx.target = -ny * max * 0.5;
      } else if (fine && pointer.active) {
        const nx = clamp((pointer.x - cx) / (window.innerWidth / 2), -1, 1);
        const ny = clamp((pointer.y - cy) / (window.innerHeight / 2), -1, 1);
        ry.target = nx * max;
        rx.target = -ny * max * 0.45;
      } else if (!fine) {
        const ny = clamp((cy - window.innerHeight / 2) / window.innerHeight, -1, 1);
        rx.target = ny * max * 0.5;
        ry.target = 0;
      } else {
        rx.target = 0;
        ry.target = 0;
      }
      sc.target = hovering || touching ? 1.022 : 1;
    };

    const apply = () => {
      el.style.transform = `perspective(1600px) rotateX(${rx.x.toFixed(3)}deg) rotateY(${ry.x.toFixed(3)}deg) scale(${sc.x.toFixed(4)})`;
      el.style.setProperty('--tilt-x', (ry.x / max).toFixed(3));
      el.style.setProperty('--tilt-y', (rx.x / max).toFixed(3));
      el.style.setProperty('--lift', ((sc.x - 1) / 0.022).toFixed(3));
    };

    const tick = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 1 / 30) : 1 / 60;
      last = time;
      computeTargets();
      stepAxis(rx, dt);
      stepAxis(ry, dt);
      stepAxis(sc, dt);
      apply();
      if (visible && (!settled(rx) || !settled(ry) || !settled(sc) || pointer.active || touching)) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        last = 0;
      }
    };

    const kick = () => {
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && !touching) return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = e.pointerType !== 'touch';
      kick();
    };
    const onEnter = () => {
      hovering = true;
      kick();
    };
    const onLeave = () => {
      hovering = false;
      kick();
    };
    const onTouchStart = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      touching = true;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      kick();
    };
    const onTouchEnd = () => {
      touching = false;
      kick();
    };
    const onScroll = () => kick();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      },
      { rootMargin: '80px 0px' },
    );
    io.observe(el);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onTouchStart);
    window.addEventListener('pointerup', onTouchEnd);
    window.addEventListener('pointercancel', onTouchEnd);
    if (!fine) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onTouchStart);
      window.removeEventListener('pointerup', onTouchEnd);
      window.removeEventListener('pointercancel', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      el.style.transform = '';
    };
  }, [max, enabled]);

  return ref;
}
