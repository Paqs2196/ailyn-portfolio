import type { ScrollTrigger } from 'gsap/ScrollTrigger';

export const CHAPTER_MAP_CHANGE = 'portfolio:chapter-map';
export const ENTRY_SKIP = 'portfolio:entry-skip';
export const ENTRY_CHANGE = 'portfolio:entry-change';
type ChapterRange = { start: number; end: number };
const ranges = new Map<string, () => ChapterRange>();
let driver: ((position: number, immediate: boolean) => void) | undefined;

/** Read labels live: resize/refresh and later timeline edits never leave stale offsets. */
export function registerTimelineChapter(id: string, trigger: ScrollTrigger, start: string, end: string) {
  const read = () => ({ start: trigger.labelToScroll(start), end: trigger.labelToScroll(end) });
  ranges.set(id, read);
  window.dispatchEvent(new Event(CHAPTER_MAP_CHANGE));
  return () => {
    if (ranges.get(id) === read) ranges.delete(id);
    window.dispatchEvent(new Event(CHAPTER_MAP_CHANGE));
  };
}

export function chapterRange(id: string) { return ranges.get(id)?.(); }

export function setChapterScrollDriver(next: typeof driver) {
  driver = next;
  return () => { if (driver === next) driver = undefined; };
}

export function navigateToChapter(id: string, immediate = false) {
  const target = document.getElementById(id);
  if (!target) return false;
  window.dispatchEvent(new Event(ENTRY_SKIP));
  const position = chapterRange(id)?.start ?? (target.getBoundingClientRect().top + window.scrollY);
  if (driver) driver(position, immediate);
  else window.scrollTo({ top: position, behavior: 'instant' });
  const hadTabIndex = target.hasAttribute('tabindex');
  if (!hadTabIndex) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
  return true;
}

/** Emitted after the master has rendered transforms, and when its ownership changes. */
export const SCENE_UPDATE = 'portfolio:scene-update';
export function sceneElementVisible(element: HTMLElement, minimumRatio = .45) {
  const scene = element.closest<HTMLElement>('[data-scene-visible]');
  if (!scene || scene.dataset.sceneVisible !== 'true') return false;
  const stage = element.closest<HTMLElement>('[data-master-stage]');
  if (!stage) return false;
  const rect = element.getBoundingClientRect();
  const clip = stage.getBoundingClientRect();
  const width = Math.max(0, Math.min(rect.right, clip.right, innerWidth) - Math.max(rect.left, clip.left, 0));
  const height = Math.max(0, Math.min(rect.bottom, clip.bottom, innerHeight) - Math.max(rect.top, clip.top, 0));
  return width * height >= rect.width * rect.height * minimumRatio && rect.width * rect.height > 0;
}
