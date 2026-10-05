import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { useDeviceTier } from '../hooks/useDeviceTier';
import { measureJourney, setJourneyElement } from '../lib/journeyStore';
import { supportsWebGL } from '../lib/webgl';
import JourneyOverlay from './JourneyOverlay';
import StaticJourney from './StaticJourney';

const Experience = lazy(() => import('./scene/Experience'));

interface JourneyProps {
  reducedMotion: boolean;
}

export default function Journey({ reducedMotion }: JourneyProps) {
  const [webgl] = useState(supportsWebGL);
  const [failed, setFailed] = useState(false);

  if (reducedMotion || !webgl || failed) return <StaticJourney />;
  return <CinematicJourney onFail={() => setFailed(true)} />;
}

function CinematicJourney({ onFail }: { onFail: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setJourneyElement(el);
    const ro = new ResizeObserver(() => measureJourney());
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '240px 0px' });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      setJourneyElement(null);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="szolgaltatasok"
      className="journey"
      data-tier={tier}
      data-ready={ready}
      tabIndex={-1}
      aria-label="Szolgáltatásaink – virtuális üzemlátogatás a Vizuáldekor műhelyében"
    >
      <div className="journey__stage">
        <div className="journey__canvas" aria-hidden="true">
          <ErrorBoundary onError={onFail}>
            <Suspense fallback={null}>
              <Experience tier={tier} active={active} onReady={() => setReady(true)} />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="journey__loader" aria-hidden="true">
          <span className="journey__loader-bar" />
        </div>
        <JourneyOverlay />
      </div>
    </section>
  );
}
