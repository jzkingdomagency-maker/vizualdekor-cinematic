import { company } from '../data/company';

export default function About() {
  const { about } = company;
  return (
    <section id="rolunk" className="section about" tabIndex={-1} aria-labelledby="rolunk-cim">
      <div className="about__grid">
        <header className="about__head">
          <h2 id="rolunk-cim" className="section-title">
            {about.title}
          </h2>
          <span className="cutline" aria-hidden="true" />
        </header>
        <div className="about__body">
          <p className="about__lead">{about.lead}</p>
          {about.paragraphs.map((text) => (
            <p key={text} className="about__text">
              {text}
            </p>
          ))}
          <ol className="about__process" aria-label="Így dolgozunk">
            {about.process.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
