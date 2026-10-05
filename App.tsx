import type { MouseEvent } from 'react';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Header from './components/Header';
import Products from './components/Products';
import References from './components/References';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import Journey from './journey/Journey';
import { goToSection } from './lib/navigation';

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  useSmoothScroll(!reducedMotion);

  const skip = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goToSection('referenciak', true);
  };

  return (
    <>
      <a className="skip-link" href="#referenciak" onClick={skip}>
        Ugrás a referenciákhoz
      </a>
      <Header />
      <main id="top">
        <Journey reducedMotion={reducedMotion} />
        <References />
        <Products />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
