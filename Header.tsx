import { useEffect, useState, type MouseEvent } from 'react';
import { goToChapter, goToSection, goToTop } from '../lib/navigation';
import { lockScroll } from '../lib/scroll';

interface NavLink {
  label: string;
  href: string;
  go: () => void;
}

const links: NavLink[] = [
  { label: 'Szolgáltatások', href: '#szolgaltatasok', go: () => goToChapter('dtf') },
  { label: 'Referenciák', href: '#referenciak', go: () => goToSection('referenciak') },
  { label: 'Rólunk', href: '#rolunk', go: () => goToSection('rolunk') },
  { label: 'Kapcsolat', href: '#kapcsolat', go: () => goToSection('kapcsolat') },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open]);

  const handle = (link: NavLink) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(link.go);
  };

  return (
    <header className="site-header">
      <a
        className="site-header__brand"
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          setOpen(false);
          goToTop();
        }}
        aria-label="Vizuáldekor – vissza az elejére"
      >
        VIZUÁLDEKOR
      </a>
      <button
        type="button"
        className="site-header__toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Bezárás' : 'Menü'}
      </button>
      <nav id="site-nav" className="site-nav" data-open={open} aria-label="Fő navigáció">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={handle(link)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
