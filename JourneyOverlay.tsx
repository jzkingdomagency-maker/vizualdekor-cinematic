import { useEffect, useRef, useState } from 'react';
import ServiceCopy from '../components/ServiceCopy';
import { company } from '../data/company';
import { chapterById, chapterProgress, type Chapter } from '../data/journey';
import { services } from '../data/services';
import { subscribeJourney } from '../lib/journeyStore';
import { pad2, range } from '../lib/math';
import { goToChapter, goToSection } from '../lib/navigation';

const serviceChapters: Chapter[] = services.map((s) => chapterById(s.id));
const PROGRESS_START = serviceChapters[0].start;
const PROGRESS_END = serviceChapters[serviceChapters.length - 1].end;

export default function JourneyOverlay() {
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const stepRefs = useRef<(HTMLOListElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(
    () =>
      subscribeJourney((p) => {
        const intro = introRef.current;
        if (intro) {
          const o = 1 - range(p, 0.022, 0.05);
          intro.style.opacity = o.toFixed(3);
          intro.style.transform = `translate3d(0, ${((1 - o) * -24).toFixed(1)}px, 0)`;
          intro.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
        }

        serviceChapters.forEach((chapter, i) => {
          const el = chapterRefs.current[i];
          if (!el) return;
          const l = chapterProgress(chapter, p);
          const o = range(l, 0.16, 0.3) * (1 - range(l, 0.86, 0.97));
          el.style.opacity = o.toFixed(3);
          el.style.transform = `translate3d(0, ${((1 - o) * 28).toFixed(1)}px, 0)`;
          el.dataset.visible = o > 0.5 ? 'true' : 'false';
          const steps = stepRefs.current[i];
          if (steps) {
            Array.from(steps.children).forEach((child) => {
              const item = child as HTMLElement;
              item.dataset.done = l >= Number(item.dataset.at) ? 'true' : 'false';
            });
          }
        });

        const outro = outroRef.current;
        if (outro) {
          const o = range(p, 0.925, 0.95) * (1 - range(p, 0.975, 0.995));
          outro.style.opacity = o.toFixed(3);
          outro.dataset.visible = o > 0.5 ? 'true' : 'false';
        }

        const fade = fadeRef.current;
        if (fade) fade.style.opacity = range(p, 0.965, 0.998).toFixed(3);

        const bar = barRef.current;
        if (bar) bar.style.transform = `scaleY(${range(p, PROGRESS_START, PROGRESS_END).toFixed(4)})`;

        const index = serviceChapters.findIndex((c) => p >= c.start && p < c.end);
        setActive(index);
      }),
    [],
  );

  const current = active >= 0 ? services[active] : null;

  return (
    <div className="journey__overlay">
      <div className="journey-intro" ref={introRef}>
        <h1 className="journey-intro__title">
          <span className="journey-intro__brand">VIZUÁLDEKOR</span>
          <span className="journey-intro__tag">{company.tagline}</span>
        </h1>
        <p className="journey-intro__hint">Görgess, és lépj be a műhelybe.</p>
        <span className="journey-intro__cue" aria-hidden="true" />
      </div>

      {services.map((service, i) => (
        <section
          key={service.id}
          className="chapter"
          id={`jelenet-${service.id}`}
          ref={(node) => {
            chapterRefs.current[i] = node;
          }}
          data-visible="false"
          aria-label={service.title}
          onFocus={(e) => {
            if (e.currentTarget.dataset.visible !== 'true') goToChapter(service.id);
          }}
        >
          <ServiceCopy
            service={service}
            index={i}
            total={services.length}
            ref={(node) => {
              stepRefs.current[i] = node;
            }}
          />
          <button type="button" className="chapter__cta" onClick={() => goToSection('kapcsolat')}>
            Ajánlatot kérek
          </button>
        </section>
      ))}

      <div className="journey-outro" ref={outroRef} data-visible="false">
        <p className="journey-outro__text">A munkáink kint folytatódnak.</p>
        <button type="button" className="text-button" onClick={() => goToSection('referenciak')}>
          Referenciák megnyitása
        </button>
      </div>

      <nav className="journey-progress" aria-label="Szolgáltatások a műhelyben" data-visible={active >= 0}>
        <p className="journey-progress__count" aria-hidden="true">
          {pad2(Math.max(active, 0) + 1)} / {pad2(services.length)}
        </p>
        <p className="journey-progress__label" aria-hidden="true">
          {current ? current.short : ''}
        </p>
        <div className="journey-progress__track">
          <span className="journey-progress__fill" ref={barRef} />
          <ol>
            {services.map((service, i) => (
              <li key={service.id}>
                <button
                  type="button"
                  aria-label={`${pad2(i + 1)}: ${service.title}`}
                  aria-current={i === active ? 'step' : undefined}
                  onClick={() => goToChapter(service.id)}
                >
                  <span />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="journey__fade" ref={fadeRef} aria-hidden="true" />
    </div>
  );
}
