import { useState } from 'react';

export type Tier = 'high' | 'mid' | 'low';

/**
 * Asztali gépen teljes jelenet árnyékokkal, tableten egyszerűsített
 * fényekkel, mobilon kisebb felbontás és kevesebb fényforrás.
 */
function detectTier(): Tier {
  const width = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (width < 768) return 'low';
  if (width < 1200 || coarse) return 'mid';
  const cores = navigator.hardwareConcurrency ?? 4;
  return cores <= 4 ? 'mid' : 'high';
}

export function useDeviceTier(): Tier {
  const [tier] = useState(detectTier);
  return tier;
}
