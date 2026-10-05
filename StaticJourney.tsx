import ServiceCopy from '../components/ServiceCopy';
import TiltMedia from '../components/TiltMedia';
import Visual from '../components/Visual';
import { company } from '../data/company';
import { services } from '../data/services';
import { goToSection } from '../lib/navigation';

/** Mozgáscsökkentett vagy WebGL nélküli nézet: ugyanaz a történet, kameramozgás nélkül. */
export default function StaticJourney() {
  return (
    <section id="szolgaltatasok" className="static-journey" tabIndex={-1} aria-labelledby="static-cim">
      <header className="static-intro">
        <h1 id="static-cim" className="journey-intro__title">
          <span className="journey-intro__brand">VIZUÁLDEKOR</span>
          <span className="journey-intro__tag">{company.tagline}</span>
        </h1>
        <p className="static-intro__lead">
          Egy műhely, nyolc szakterület. Végigvezetünk a nyomtatástól a fóliázáson át a kész felületig.
        </p>
      </header>
      <ol className="static-list">
        {services.map((service, i) => (
          <li key={service.id} id={`szolgaltatas-${service.id}`} tabIndex={-1} className="static-service">
            <TiltMedia className="static-service__media">
              <Visual image={service.image} art={service.art} label={service.title} slot={service.imageSlot} />
            </TiltMedia>
            <div className="static-service__copy">
              <ServiceCopy service={service} index={i} total={services.length} />
              <button type="button" className="chapter__cta" onClick={() => goToSection('kapcsolat')}>
                Ajánlatot kérek
              </button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
