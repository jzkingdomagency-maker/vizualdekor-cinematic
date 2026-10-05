export interface ImageAsset {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
}

export type ArtKind =
  | 'tshirt'
  | 'hoodie'
  | 'jacket'
  | 'workwear'
  | 'bag'
  | 'label'
  | 'banner'
  | 'rollup'
  | 'flag'
  | 'boat'
  | 'car'
  | 'van'
  | 'restaurant'
  | 'club'
  | 'letters'
  | 'storefront'
  | 'building'
  | 'glass'
  | 'printer'
  | 'design';
