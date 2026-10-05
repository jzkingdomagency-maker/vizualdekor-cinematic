export const company = {
  legalName: 'Vizuáldekor Kft.',
  brand: 'VIZUÁLDEKOR',
  tagline: 'Dekoráció, nyomtatás és fóliázás Nyíregyházán',
  phone: {
    display: '+36 70 249 3072',
    href: 'tel:+36702493072',
  },
  email: 'info@vizualdekor.hu',
  address: {
    postalCode: '4400',
    city: 'Nyíregyháza',
    street: 'Derkovits utca 132.',
  },
  website: 'https://vizualdekor.hu/',
  about: {
    title: 'Rólunk',
    lead: 'A Vizuáldekor Kft. komplex dekorációs kivitelezéssel és nyomtatással foglalkozik.',
    paragraphs: [
      'Több mint egy évtizede dolgozunk a régió vállalkozásainak, intézményeinek és magánügyfeleinek.',
      'Egy kézben tartjuk a teljes folyamatot: a grafikai tervtől a nyomtatáson és a fóliázáson át a helyszíni felhelyezésig.',
    ],
    process: ['Terv', 'Nyomat', 'Fólia', 'Felhelyezés'],
  },
} as const;

export const fullAddress = `${company.address.postalCode} ${company.address.city}, ${company.address.street}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${company.address.postalCode} ${company.address.city} ${company.address.street}`,
)}`;
