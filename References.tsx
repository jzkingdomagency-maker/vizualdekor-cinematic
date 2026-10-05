import { useRef, useState } from 'react';
import { references } from '../data/references';
import ReferenceOverlay from './ReferenceOverlay';
import TiltMedia from './TiltMedia';
import Visual from './Visual';

export default function References() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const close = () => {
    const index = openIndex;
    setOpenIndex(null);
    if (index !== null) requestAnimationFrame(() => triggers.current[index]?.focus());
  };

  return (
    <section id="referenciak" className="section references" tabIndex={-1} aria-labelledby="referenciak-cim">
      <header className="section-head">
        <h2 id="referenciak-cim" className="section-title">
          Referenciák
        </h2>
        <span className="cutline" aria-hidden="true" />
        <p className="section-lead">Elkészült munkák a műhelyből, járműveken, üzletekben és homlokzatokon.</p>
      </header>

      <ol className="ref-list">
        {references.map((ref, i) => (
          <li key={ref.id} className="ref-item" data-side={i % 2 === 0 ? 'start' : 'end'}>
            <article className="ref-card">
              <TiltMedia className="ref-card__media">
                <Visual image={ref.image} art={ref.art} label={ref.title} slot={ref.imageSlot} />
              </TiltMedia>
              <div className="ref-card__body">
                <p className="ref-card__meta">
                  <span>{ref.category}</span>
                  {ref.location ? <span>{ref.location}</span> : null}
                </p>
                <h3 className="ref-card__title">{ref.title}</h3>
                <p className="ref-card__text">{ref.description}</p>
                <button
                  type="button"
                  className="ref-card__cta"
                  ref={(node) => {
                    triggers.current[i] = node;
                  }}
                  onClick={() => setOpenIndex(i)}
                  aria-haspopup="dialog"
                >
                  Megnézem<span className="visually-hidden">: {ref.title}</span>
                </button>
              </div>
            </article>
          </li>
        ))}
      </ol>

      {openIndex !== null ? (
        <ReferenceOverlay index={openIndex} onClose={close} onNavigate={(i) => setOpenIndex(i)} />
      ) : null}
    </section>
  );
}
