import type { ArtKind, ImageAsset } from './types';
import type { ServiceId } from './services';

export interface Reference {
  id: string;
  title: string;
  description: string;
  category: string;
  serviceId: ServiceId;
  location: string | null;
  art: ArtKind;
  image: ImageAsset | null;
  imageSlot: string;
}

/**
 * A vizualdekor.hu referencialistája alapján. Új projekt felvételéhez
 * elég egy új elemet hozzáadni ehhez a tömbhöz.
 */
export const references: Reference[] = [
  {
    id: 'motorcsonak-dekor',
    title: 'Motorcsónak dekor fóliázás',
    description: 'Dekor fóliázás vízi járművön, a hajótest formájára szabva.',
    category: 'Járműfóliázás',
    serviceId: 'wrap',
    location: null,
    art: 'boat',
    image: null,
    imageSlot: '/images/references/motorcsonak.jpg',
  },
  {
    id: 'porsche-taycan',
    title: 'Teljes autófóliázás – Porsche Taycan',
    description: 'A teljes karosszéria fóliázása egy elektromos sportautón.',
    category: 'Autófóliázás',
    serviceId: 'wrap',
    location: null,
    art: 'car',
    image: null,
    imageSlot: '/images/references/porsche-taycan.jpg',
  },
  {
    id: 'benda-kebab',
    title: 'Benda Kebab és Grill',
    description: 'Dekoráció egy vendéglátóhely arculatához.',
    category: 'Dekoráció',
    serviceId: 'decor',
    location: null,
    art: 'restaurant',
    image: null,
    imageSlot: '/images/references/benda-kebab.jpg',
  },
  {
    id: 'soho-club',
    title: 'Soho Club Nyíregyháza dekorálása',
    description: 'Egy szórakozóhely dekorálása.',
    category: 'Dekoráció',
    serviceId: 'decor',
    location: 'Nyíregyháza',
    art: 'club',
    image: null,
    imageSlot: '/images/references/soho-club.jpg',
  },
  {
    id: 'terbetuk-ablakfolia',
    title: 'Kültéri dekoráció – térbetűk és ablakfóliázás',
    description: 'Homlokzati térbetűk és ablakfóliázás egy projekten belül.',
    category: 'Kültéri dekoráció',
    serviceId: 'space',
    location: null,
    art: 'letters',
    image: null,
    imageSlot: '/images/references/terbetuk-ablakfolia.jpg',
  },
  {
    id: 'lottozo',
    title: 'Lottózó kül- és beltéri dekoráció',
    description: 'Kül- és beltéri dekoráció egy lottózó számára.',
    category: 'Dekoráció',
    serviceId: 'decor',
    location: null,
    art: 'storefront',
    image: null,
    imageSlot: '/images/references/lottozo.jpg',
  },
  {
    id: 'reformatus-szocialis-kozpont',
    title: 'Református Szociális Központ',
    description: 'Dekorációs kivitelezés intézményi környezetben.',
    category: 'Dekoráció',
    serviceId: 'decor',
    location: null,
    art: 'building',
    image: null,
    imageSlot: '/images/references/reformatus-szocialis-kozpont.jpg',
  },
  {
    id: 'karcher-cegauto',
    title: 'Autófóliázás – Kärcher cégautó',
    description: 'Céges arculat megjelenítése egy flottajárművön.',
    category: 'Járműfóliázás',
    serviceId: 'wrap',
    location: null,
    art: 'van',
    image: null,
    imageSlot: '/images/references/karcher-cegauto.jpg',
  },
  {
    id: 'colorado-steakhouse',
    title: 'Colorado Steakhouse',
    description: 'Dekoráció egy étterem számára.',
    category: 'Dekoráció',
    serviceId: 'decor',
    location: null,
    art: 'restaurant',
    image: null,
    imageSlot: '/images/references/colorado-steakhouse.jpg',
  },
];
