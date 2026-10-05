import { useEffect, useRef } from 'react';
import { references } from '../data/references';
import { getService } from '../data/services';
import { goToSection } from '../lib/navigation';
import { lockScroll } from '../lib/scroll';
import TiltMedia from './TiltMedia';
import Visual from './Visual';

interface ReferenceOverlayProps {
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ReferenceOverlay({ index, onClose, onNavigate }: ReferenceOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reference = references[index];
  const service = getService(reference.serviceId);
  const prev = (index - 1 + references.length) % references.length;
  const next = (index + 1) % references.length;

  useEffect(() => {
    lockScroll(true);
    closeRef.current?.focus();
    return () => lockScroll(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') onNavigate(next);
      if (e.key === 'ArrowLeft') onNavigate(prev);
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, a[href]');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate, next, prev]);

  return (
    <div
      className="ref-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ref-overlay-title"
      ref={dialogRef}
      data-lenis-prevent
    >
      <div className="ref-overlay__inner" key={reference.id}>
        <button type="button" className="ref-overlay__close" onClick={onClose} ref={closeRef}>
          Bezárás
        </button>
        <TiltMedia className="ref-overlay__media" max={4}>
          <Visual
            image={reference.image}
            art={reference.art}
            label={reference.title}
            slot={reference.imageSlot}
            sizes="100vw"
            eager
          />
        </TiltMedia>
        <div className="ref-overlay__body">
          <p className="ref-card__meta">
            <span>{reference.category}</span>
            {reference.location ? <span>{reference.location}</span> : null}
          </p>
          <h3 id="ref-overlay-title" className="ref-overlay__title">
            {reference.title}
          </h3>
          <p className="ref-overlay__text">{reference.description}</p>
          <p className="ref-overlay__service">Szolgáltatás: {service.title}</p>
          <div className="ref-overlay__actions">
            <button type="button" className="text-button" onClick={() => onNavigate(prev)}>
              Előző projekt
            </button>
            <button type="button" className="text-button" onClick={() => onNavigate(next)}>
              Következő projekt
            </button>
            <button
              type="button"
              className="button-primary"
              onClick={() => {
                onClose();
                requestAnimationFrame(() => goToSection('kapcsolat'));
              }}
            >
              Ajánlatot kérek
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
