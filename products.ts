import type { ArtKind, ImageAsset } from './types';
import type { ServiceId } from './services';

export interface Product {
  id: string;
  name: string;
  description: string;
  serviceId: ServiceId;
  art: ArtKind;
  image: ImageAsset | null;
  imageSlot: string;
}

/**
 * Termékkategóriák a meglévő szolgáltatások alapján. Ár és egyéb
 * termékadat csak akkor kerüljön ide, ha az hivatalosan is elérhető.
 */
export const products: Product[] = [
  {
    id: 'polok',
    name: 'Pólók',
    description: 'Egyedi grafika, logó vagy felirat DTF nyomtatással.',
    serviceId: 'dtf',
    art: 'tshirt',
    image: null,
    imageSlot: '/images/products/polok.jpg',
  },
  {
    id: 'munkaruhazat',
    name: 'Munkaruházat',
    description: 'Céges logó és felirat munkaruhára.',
    serviceId: 'dtf',
    art: 'workwear',
    image: null,
    imageSlot: '/images/products/munkaruhazat.jpg',
  },
  {
    id: 'pulloverek',
    name: 'Pulóverek',
    description: 'Grafika és felirat pulóverekre DTF nyomtatással.',
    serviceId: 'dtf',
    art: 'hoodie',
    image: null,
    imageSlot: '/images/products/pulloverek.jpg',
  },
  {
    id: 'kabatok',
    name: 'Kabátok',
    description: 'Logó és felirat kabátokra.',
    serviceId: 'dtf',
    art: 'jacket',
    image: null,
    imageSlot: '/images/products/kabatok.jpg',
  },
  {
    id: 'taskak',
    name: 'Táskák',
    description: 'Egyedi grafika textiltáskákra.',
    serviceId: 'dtf',
    art: 'bag',
    image: null,
    imageSlot: '/images/products/taskak.jpg',
  },
  {
    id: 'cimkek',
    name: 'Címkék',
    description: 'Egyedi termékcímkék nyomtatással és vágással.',
    serviceId: 'labels',
    art: 'label',
    image: null,
    imageSlot: '/images/products/cimkek.jpg',
  },
  {
    id: 'molinok',
    name: 'Molinók',
    description: 'Nagyformátumú nyomat kültéri és beltéri megjelenéshez.',
    serviceId: 'largeformat',
    art: 'banner',
    image: null,
    imageSlot: '/images/products/molinok.jpg',
  },
  {
    id: 'rollupok',
    name: 'Rollupok',
    description: 'Hordozható, gyorsan felállítható megjelenés rendezvényre és üzletbe.',
    serviceId: 'decor',
    art: 'rollup',
    image: null,
    imageSlot: '/images/products/rollupok.jpg',
  },
  {
    id: 'zaszlok',
    name: 'Zászlók',
    description: 'Egyedi zászlók kültéri és beltéri használatra.',
    serviceId: 'space',
    art: 'flag',
    image: null,
    imageSlot: '/images/products/zaszlok.jpg',
  },
];
