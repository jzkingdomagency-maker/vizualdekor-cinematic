import type { ReactNode } from 'react';
import { useTilt } from '../hooks/useTilt';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface TiltMediaProps {
  children: ReactNode;
  max?: number;
  className?: string;
}

/** Lebegő, kurzorra dőlő képkeret árnyékkal és finom fényvisszaverődéssel. */
export default function TiltMedia({ children, max = 5, className = '' }: TiltMediaProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useTilt<HTMLDivElement>({ max, enabled: !reduced });
  return (
    <div className={`tilt ${className}`}>
      <div ref={ref} className="tilt__card">
        <span className="tilt__shadow" aria-hidden="true" />
        <div className="tilt__frame">
          {children}
          <span className="tilt__sheen" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
