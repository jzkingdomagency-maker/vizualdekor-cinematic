import { forwardRef } from 'react';
import { formatPrice, pricing, type Service } from '../data/services';
import { pad2 } from '../lib/math';

interface ServiceCopyProps {
  service: Service;
  index: number;
  total: number;
}

const ServiceCopy = forwardRef<HTMLOListElement, ServiceCopyProps>(function ServiceCopy({ service, index, total }, stepsRef) {
  const price = service.id === 'dtf' && pricing.dtf.visible ? pricing.dtf : null;
  return (
    <div className="service-copy">
      <p className="service-copy__index">
        <span className="service-copy__current">{pad2(index + 1)}</span>
        <span className="visually-hidden"> / </span>
        <span className="service-copy__total" aria-hidden="true">/ {pad2(total)}</span>
      </p>
      <h2 className="service-copy__title">{service.title}</h2>
      <span className="cutline" aria-hidden="true" />
      <p className="service-copy__tagline">{service.tagline}</p>
      <ol className="service-copy__steps" ref={stepsRef} aria-label="A folyamat lépései">
        {service.steps.map((step) => (
          <li key={step.label} data-at={step.at}>
            {step.label}
          </li>
        ))}
      </ol>
      <ul className="service-copy__items">
        {service.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
        {service.facts.map((fact) => (
          <li key={fact} className="is-fact">
            {fact}
          </li>
        ))}
      </ul>
      {price ? (
        <p className="service-copy__price">
          <span>{price.label}</span>
          <strong>
            {formatPrice(price.amount, price.currency)} {price.unit}
          </strong>
        </p>
      ) : null}
    </div>
  );
});

export default ServiceCopy;
