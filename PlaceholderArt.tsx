import type { ArtKind } from '../data/types';

interface Glyph {
  line: string;
  accent: string;
}

/** Egyszerű vonalrajzok a még fel nem töltött fotók helyére. */
const glyphs: Record<ArtKind, Glyph> = {
  tshirt: {
    line: 'M72 28 50 36 28 58l16 13 12-9v54h88V62l12 9 16-13-22-22-22-8c-6 9-16 13-28 13S78 37 72 28Z',
    accent: 'M86 70h28v22H86z',
  },
  hoodie: {
    line: 'M70 32 46 42 30 112h16l10-48v56h88V64l10 48h16L154 42l-24-10c0 14-13 24-30 24S70 46 70 32Zm0 0c4-12 16-18 30-18s26 6 30 18',
    accent: 'M84 76h32v18H84z',
  },
  jacket: {
    line: 'M72 26 46 38 30 116h18l8-52v58h88V64l8 52h18L154 38l-26-12-14 14-14-6-14 6Zm28 8v88',
    accent: 'M108 62h22v10h-22z',
  },
  workwear: {
    line: 'M72 28 50 36 28 58l16 13 12-9v54h88V62l12 9 16-13-22-22-22-8c-6 9-16 13-28 13S78 37 72 28Zm-16 70h88',
    accent: 'M56 90h88v6H56zm52-30h22v14h-22z',
  },
  bag: {
    line: 'M58 52h84l-8 72H66Zm18 0c0-18 8-28 24-28s24 10 24 28',
    accent: 'M84 78h32v24H84z',
  },
  label: {
    line: 'M30 70a28 28 0 1 0 56 0 28 28 0 1 0-56 0m18 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0M58 42h116v56H58',
    accent: 'M100 56h28v28h-28zm40 0h28v28h-28z',
  },
  banner: {
    line: 'M24 36h152v68H24Zm8 8h0m136 0h0M32 96h0m136 0h0',
    accent: 'M44 58h76v8H44zm0 16h48v8H44z',
  },
  rollup: {
    line: 'M70 22h60v96H70Zm-8 96h76v10H62Z',
    accent: 'M80 70h40v8H80zm0 14h28v8H80z',
  },
  flag: {
    line: 'M50 18v110M50 24c20-8 36 8 56 0s36-8 50 0v44c-14-8-30-8-50 0s-36-8-56 0',
    accent: 'M78 40h40v16H78z',
  },
  boat: {
    line: 'M16 86h168l-20 22H38Zm56 0V68h46l18 18',
    accent: 'M40 92h112v6H40z',
  },
  car: {
    line: 'M18 96l10-16c22-6 42-14 58-24 14-8 40-8 58-2 14 5 24 14 34 24l6 18Zm37 0a13 13 0 1 0 26 0m70 0a13 13 0 1 0 26 0',
    accent: 'M60 80h96v6H60z',
  },
  van: {
    line: 'M20 100V48q0-8 8-8h102l30 22 22 8v30Zm30 0a12 12 0 1 0 24 0m76 0a12 12 0 1 0 24 0M134 42v28h46',
    accent: 'M34 62h80v16H34z',
  },
  restaurant: {
    line: 'M30 122V54h140v68M24 54l14-22h124l14 22M88 122V86h24v36',
    accent: 'M58 38h84v10H58zm-14 34h28v18H44zm84 0h28v18h-28z',
  },
  club: {
    line: 'M100 30v12m-46 80 34-70m58 70-34-70M20 122h160',
    accent: 'M92 50a8 8 0 1 0 16 0 8 8 0 1 0-16 0',
  },
  letters: {
    line: 'M30 104V44h28l14 30 14-30h28v60m20 0V44h34v60M30 104l8 8h84l-8-8m20 0 8 8h34l-8-8',
    accent: 'M30 104h84v4H30zm104 0h34v4h-34z',
  },
  storefront: {
    line: 'M30 124V44h140v80M24 44l10-16h132l10 16M44 62h64v44H44Zm78 0h34v62h-34',
    accent: 'M44 92h64v14H44z',
  },
  building: {
    line: 'M38 124V58l62-34 62 34v66M58 70h16v16H58Zm34 0h16v16H92Zm34 0h16v16h-16ZM88 124V98h24v26',
    accent: 'M62 52h76v6H62z',
  },
  glass: {
    line: 'M34 20h132v104H34Zm44 0v104m44-104v104',
    accent: 'M34 52h132v30H34z',
  },
  printer: {
    line: 'M26 46h148v32H26Zm10 32v40m128-40v40M48 78h104l8 30H40Z',
    accent: 'M48 84h104v8H48z',
  },
  design: {
    line: 'M34 26h132v80H34Zm52 80-6 18h40l-6-18m-32 18h60',
    accent: 'M84 46h32v32H84z',
  },
};

interface PlaceholderArtProps {
  kind: ArtKind;
  label: string;
  slot?: string;
}

export default function PlaceholderArt({ kind, label, slot }: PlaceholderArtProps) {
  const glyph = glyphs[kind];
  return (
    <div className="placeholder" role="img" aria-label={label}>
      <svg className="placeholder__art" viewBox="0 0 200 140" aria-hidden="true" focusable="false">
        <path d={glyph.accent} className="placeholder__accent" />
        <path d={glyph.line} className="placeholder__line" />
      </svg>
      <span className="placeholder__marks" aria-hidden="true" />
      {import.meta.env.DEV && slot ? <span className="placeholder__slot">{slot}</span> : null}
    </div>
  );
}
