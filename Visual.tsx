import type { ArtKind, ImageAsset } from '../data/types';
import PlaceholderArt from './PlaceholderArt';

interface VisualProps {
  image: ImageAsset | null;
  art: ArtKind;
  label: string;
  slot: string;
  sizes?: string;
  eager?: boolean;
}

/** Valódi kép, ha van; egyébként semleges, könnyen cserélhető vonalrajz. */
export default function Visual({ image, art, label, slot, sizes = '(min-width: 900px) 60vw, 100vw', eager = false }: VisualProps) {
  if (!image) return <PlaceholderArt kind={art} label={label} slot={slot} />;
  return (
    <img
      className="visual-img"
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
