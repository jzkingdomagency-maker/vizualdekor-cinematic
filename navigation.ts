import { chapterById, type ChapterId } from '../data/journey';
import { hasJourney, journeyScrollY } from './journeyStore';
import { scrollToElement, scrollToY } from './scroll';

/** Ugrás egy szolgáltatás jelenetére. A filmszerű nézetben a kamera repül oda, statikus nézetben a szakaszhoz görget. */
export function goToChapter(id: ChapterId): void {
  if (hasJourney()) {
    const chapter = chapterById(id);
    scrollToY(journeyScrollY(chapter.start + (chapter.end - chapter.start) * chapter.focus));
    return;
  }
  const el = document.getElementById(id === 'intro' || id === 'exit' ? 'szolgaltatasok' : `szolgaltatas-${id}`);
  if (el) scrollToElement(el);
}

export function goToSection(id: string, instant = false): void {
  const el = document.getElementById(id);
  if (el) scrollToElement(el, instant);
}

export function goToTop(): void {
  scrollToY(0);
}
