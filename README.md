# Képek

A weboldal minden képe adatvezérelt. Amíg egy kép nincs feltöltve, a felület semleges, márkaszínű vonalrajzot mutat a helyén.

Valódi kép hozzáadása:

1. Másold a fájlt a megfelelő mappába (`services/`, `references/`, `products/`), lehetőleg a `src/data/*.ts` fájlban megadott `imageSlot` néven.
2. A hozzá tartozó adatelemnél töltsd ki az `image` mezőt, például:

```ts
image: {
  src: '/images/references/porsche-taycan.jpg',
  srcSet: '/images/references/porsche-taycan-960.jpg 960w, /images/references/porsche-taycan.jpg 1920w',
  width: 1920,
  height: 1200,
  alt: 'Teljes autófóliázás egy Porsche Taycanon a Vizuáldekor műhelyében',
},
```

Javasolt formátum: WebP vagy JPG, 1920 px széles fő kép és egy 960 px széles változat a `srcSet` mezőben.
