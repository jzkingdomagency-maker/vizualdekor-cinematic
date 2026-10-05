import { products } from '../data/products';
import { getService } from '../data/services';
import { goToChapter } from '../lib/navigation';
import TiltMedia from './TiltMedia';
import Visual from './Visual';

export default function Products() {
  return (
    <section id="termekek" className="section products" tabIndex={-1} aria-labelledby="termekek-cim">
      <header className="section-head">
        <h2 id="termekek-cim" className="section-title">
          Termékek és munkák
        </h2>
        <span className="cutline" aria-hidden="true" />
        <p className="section-lead">Amit textilre, címkére, molinóra és zászlóra készítünk.</p>
      </header>
      <ul className="product-list">
        {products.map((product, i) => {
          const service = getService(product.serviceId);
          return (
            <li key={product.id} className="product" data-side={i % 2 === 0 ? 'start' : 'end'}>
              <TiltMedia className="product__media">
                <Visual image={product.image} art={product.art} label={product.name} slot={product.imageSlot} />
              </TiltMedia>
              <div className="product__body">
                <h3 className="product__name">{product.name}</h3>
                <p className="product__text">{product.description}</p>
                <button type="button" className="text-button" onClick={() => goToChapter(product.serviceId)}>
                  {service.title} a műhelyben
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
