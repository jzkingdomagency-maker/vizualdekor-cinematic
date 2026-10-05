import type { MouseEvent } from 'react';
import { company, fullAddress } from '../data/company';
import { getService, type ServiceId } from '../data/services';
import { goToChapter, goToSection } from '../lib/navigation';

const footerServices: ServiceId[] = ['decor', 'largeformat', 'glass', 'dtf', 'labels', 'design'];

export default function Footer() {
  const go = (fn: () => void) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    fn();
  };

  return (
    <footer className="site-footer">
      <p className="site-footer__brand">VIZUÁLDEKOR</p>
      <nav aria-label="Lábléc">
        <ul className="site-footer__links">
          {footerServices.map((id) => (
            <li key={id}>
              <a href={`#szolgaltatas-${id}`} onClick={go(() => goToChapter(id))}>
                {getService(id).footerLabel}
              </a>
            </li>
          ))}
          <li>
            <a href="#referenciak" onClick={go(() => goToSection('referenciak'))}>
              Referenciák
            </a>
          </li>
          <li>
            <a href="#kapcsolat" onClick={go(() => goToSection('kapcsolat'))}>
              Kapcsolat
            </a>
          </li>
        </ul>
      </nav>
      <address className="site-footer__contact">
        <a href={company.phone.href}>{company.phone.display}</a>
        <a href={`mailto:${company.email}`}>{company.email}</a>
        <span>{fullAddress}</span>
      </address>
      <p className="site-footer__legal">
        © {new Date().getFullYear()} {company.legalName}
      </p>
    </footer>
  );
}
