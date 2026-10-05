import type { ArtKind, ImageAsset } from './types';

export type ServiceId = 'dtf' | 'decor' | 'wrap' | 'glass' | 'largeformat' | 'labels' | 'design' | 'space';

export interface ServiceStep {
  label: string;
  /** A jelenet helyi előrehaladása (0–1), amikor a lépés aktívvá válik. */
  at: number;
}

export interface Service {
  id: ServiceId;
  short: string;
  title: string;
  tagline: string;
  items: string[];
  steps: ServiceStep[];
  facts: string[];
  footerLabel: string;
  art: ArtKind;
  image: ImageAsset | null;
  imageSlot: string;
}

/**
 * Árak egy helyen. A `visible: false` elrejti az árat a felületen,
 * az összeg és az egység itt módosítható.
 */
export const pricing = {
  dtf: {
    amount: 3500,
    currency: 'Ft',
    unit: '+ ÁFA / m²',
    label: 'Irányár',
    visible: true,
  },
} as const;

export const services: Service[] = [
  {
    id: 'dtf',
    short: 'DTF',
    title: 'DTF nyomtatás',
    tagline: 'Logó, felirat és egyedi grafika textilre.',
    items: ['Kabátok', 'Pulóverek', 'Pólók', 'Nadrágok', 'Táskák', 'Egyéb textíliák'],
    steps: [
      { label: 'Grafika', at: 0.1 },
      { label: 'Nyomtatás filmre', at: 0.2 },
      { label: 'Kész film', at: 0.5 },
      { label: 'Préselés textilre', at: 0.7 },
    ],
    facts: [],
    footerLabel: 'DTF',
    art: 'tshirt',
    image: null,
    imageSlot: '/images/services/dtf.jpg',
  },
  {
    id: 'decor',
    short: 'Dekor',
    title: 'Dekoráció',
    tagline: 'Kül- és beltéri dekoráció egyedi igényekre.',
    items: ['Kirakatfóliázás', 'Öntapadós fólia', 'Rollup', 'Mesh háló', 'Beltéri dekoráció', 'Kültéri dekoráció', 'Felhelyezés'],
    steps: [
      { label: 'Pozicionálás', at: 0.18 },
      { label: 'Felhelyezés', at: 0.32 },
      { label: 'Rollup', at: 0.55 },
      { label: 'Kész kirakat', at: 0.8 },
    ],
    facts: [],
    footerLabel: 'Dekoráció',
    art: 'storefront',
    image: null,
    imageSlot: '/images/services/dekoracio.jpg',
  },
  {
    id: 'wrap',
    short: 'Autófólia',
    title: 'Autófóliázás',
    tagline: 'Autók, motorok és egyéb járművek fóliázása és dekorálása.',
    items: ['Teljes autófóliázás', 'Céges járműdekor', 'Motorok', 'Vízi járművek'],
    steps: [
      { label: 'Előkészítés', at: 0.14 },
      { label: 'Felhelyezés', at: 0.35 },
      { label: 'Simítás', at: 0.55 },
      { label: 'Szélek kidolgozása', at: 0.78 },
      { label: 'Kész', at: 0.92 },
    ],
    facts: [],
    footerLabel: 'Autófóliázás',
    art: 'car',
    image: null,
    imageSlot: '/images/services/autofoliazas.jpg',
  },
  {
    id: 'glass',
    short: 'Üvegfólia',
    title: 'Épületüveg fóliázás',
    tagline: 'Belátásvédelem, hővédelem és biztonság üvegfelületekre.',
    items: ['Belátásvédelem', 'Hővédelem', 'Biztonság'],
    steps: [
      { label: 'Tisztítás', at: 0.12 },
      { label: 'Pozicionálás', at: 0.28 },
      { label: 'Felhelyezés', at: 0.38 },
      { label: 'Buborékmentesítés', at: 0.72 },
      { label: 'Kész felület', at: 0.86 },
    ],
    facts: [],
    footerLabel: 'Üvegfóliázás',
    art: 'glass',
    image: null,
    imageSlot: '/images/services/uvegfoliazas.jpg',
  },
  {
    id: 'largeformat',
    short: 'Bérnyomtatás',
    title: 'Bérnyomtatás',
    tagline: 'Nagyformátumú nyomtatás akár 160 cm szélességben.',
    items: ['Hozott anyag nyomtatása', 'Molinó', 'Poszter', 'Dekorációs nyomatok'],
    steps: [
      { label: 'Nyomtatás', at: 0.14 },
      { label: 'Kész nyomat', at: 0.46 },
      { label: 'Kihelyezés', at: 0.55 },
      { label: 'Reklámfelület', at: 0.84 },
    ],
    facts: ['Akár 160 cm nyomtatási szélesség'],
    footerLabel: 'Bérnyomtatás',
    art: 'printer',
    image: null,
    imageSlot: '/images/services/bernyomtatas.jpg',
  },
  {
    id: 'labels',
    short: 'Címke',
    title: 'Címke nyomtatás',
    tagline: 'Egyedi címkék a grafikától a kész darabig.',
    items: ['Tekercses címkék', 'Termékcímkék', 'Nyomtatás és vágás'],
    steps: [
      { label: 'Grafika', at: 0.1 },
      { label: 'Nyomtatás', at: 0.2 },
      { label: 'Vágás', at: 0.32 },
      { label: 'A terméken', at: 0.78 },
    ],
    facts: [],
    footerLabel: 'Címke',
    art: 'label',
    image: null,
    imageSlot: '/images/services/cimke.jpg',
  },
  {
    id: 'design',
    short: 'Grafika',
    title: 'Grafikai tervezés',
    tagline: 'Arculat, kiadvány és logótervezés a tervezéstől a kivitelezésig.',
    items: ['Logótervezés', 'Arculat', 'Kiadvány'],
    steps: [
      { label: 'Logó', at: 0.3 },
      { label: 'Grafika', at: 0.42 },
      { label: 'Nyomtatás', at: 0.5 },
      { label: 'Fólia', at: 0.6 },
      { label: 'Valódi felület', at: 0.86 },
    ],
    facts: [],
    footerLabel: 'Grafika',
    art: 'design',
    image: null,
    imageSlot: '/images/services/grafika.jpg',
  },
  {
    id: 'space',
    short: 'Térdekor',
    title: 'Zászló és térdekoráció',
    tagline: 'Zászlók, molinók, rollupok és térbetűk a térben.',
    items: ['Zászlókészítés', 'Molinó', 'Rollup', 'Belógatós dekoráció', 'Poszter', 'Térbetűk'],
    steps: [
      { label: 'Belógatós dekoráció', at: 0.2 },
      { label: 'Zászlók', at: 0.45 },
      { label: 'Térbetűk', at: 0.72 },
    ],
    facts: [],
    footerLabel: 'Térdekoráció',
    art: 'flag',
    image: null,
    imageSlot: '/images/services/terdekoracio.jpg',
  },
];

export function getService(id: ServiceId): Service {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`Ismeretlen szolgáltatás: ${id}`);
  return service;
}

export function formatPrice(amount: number, currency: string): string {
  return `${new Intl.NumberFormat('hu-HU').format(amount)} ${currency}`;
}
