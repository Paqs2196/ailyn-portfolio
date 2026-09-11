'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESKTOP_SCROLL_QUERY } from '@/lib/scroll-config';
import { chapterRange, navigateToChapter, CHAPTER_MAP_CHANGE, SCENE_UPDATE } from '@/lib/chapter-scroll';
import styles from './scroll-chapters.module.css';

const chapters = [
  { id: 'hero', numeral: 'I', title: 'Hero', built: true },
  { id: 'selected-work', numeral: 'II', title: 'Selected Work', built: true },
  { id: 'analytics-results', numeral: 'III', title: 'Analytics/Results', built: true },
  { id: 'companies', numeral: 'IV', title: 'Companies', built: true },
  { id: 'about', numeral: 'V', title: 'About Ailyn', built: true },
  { id: 'services', numeral: 'VI', title: 'Services', built: true },
  { id: 'tools-platforms', numeral: 'VII', title: 'Tools & Platforms', built: true },
  { id: 'contact', numeral: 'VIII', title: 'Contact', built: true },
];

export function ChapterLabel({ numeral }: { numeral: string }) {
  return <p className={styles.label}>Chapter {numeral}</p>;
}

export function ScrollChapters() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const sections = chapters.filter(chapter => chapter.built)
      .map(chapter => document.getElementById(chapter.id)).filter((section): section is HTMLElement => Boolean(section));
    const sync = () => {
      const scroll = window.scrollY;
      const lastSection = sections.at(-1);
      const pinned = sections.find(section => {
        const range = chapterRange(section.id);
        return range && scroll + 1 >= range.start && (scroll + 1 < range.end || section === lastSection);
      });
      const current = pinned ?? sections.filter(section => {
        const range = chapterRange(section.id);
        return range ? scroll >= range.start : section.getBoundingClientRect().top <= window.innerHeight * .35;
      }).at(-1);
      setActive(current?.id ?? 'hero');
    };
    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let id: string;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      if (!navigateToChapter(id)) return;
      event.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    };
    const onHash = () => {
      if (!location.hash) return;
      try { navigateToChapter(decodeURIComponent(location.hash.slice(1)), true); } catch { /* Invalid external hash. */ }
    };
    document.addEventListener('click', onAnchor);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener(CHAPTER_MAP_CHANGE, sync);
    window.addEventListener(SCENE_UPDATE, sync);
    // Effects in the scene controller must register their label ranges first.
    const arrival = requestAnimationFrame(onHash);
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: DESKTOP_SCROLL_QUERY }, context => {
      if (!context.conditions?.motion) return;
      document.querySelectorAll<HTMLElement>('[data-boundary-reveal]').forEach(boundary => {
        const section = boundary.firstElementChild;
        if (!section || (context.conditions?.desktop && boundary.closest('[data-master-stage]'))) return;
        gsap.fromTo(section, { clipPath: 'inset(0 0 0 100%)' }, {
          clipPath: 'inset(0 0 0 0%)', ease: 'none',
          scrollTrigger: { trigger: boundary, start: 'top bottom', end: 'top 65%', scrub: .35, invalidateOnRefresh: true },
        });
      });
    });
    let frame = 0;
    let previousHeight = 0;
    const resize = new ResizeObserver(entries => {
      const height = entries[0]?.contentRect.height;
      if (height === previousHeight) return;
      previousHeight = height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    const main = document.getElementById('main-content');
    if (main) resize.observe(main);
    ScrollTrigger.addEventListener('refresh', sync);
    ScrollTrigger.refresh();
    sync();
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener('refresh', sync);
      media.revert();
      cancelAnimationFrame(arrival);
      document.removeEventListener('click', onAnchor);
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('scroll', sync);
      window.removeEventListener(CHAPTER_MAP_CHANGE, sync);
      window.removeEventListener(SCENE_UPDATE, sync);
    };
  }, []);

  const current = chapters.find(chapter => chapter.id === active)!;
  return (
    <aside className={styles.rail} aria-label="Portfolio chapters">
      <a className={styles.signature} href="#hero" aria-label="Create with Ailyn — back to hero">Create with <span>Ailyn</span><sup>TM</sup></a>
      <nav aria-label="Chapter navigation">
        <ol className={styles.contents}>
          {chapters.map(chapter => (
            <li key={chapter.id}>
              {chapter.built ? <a href={`#${chapter.id}`} aria-label={`Chapter ${chapter.numeral}: ${chapter.title}`} aria-current={active === chapter.id ? 'location' : undefined} title={chapter.title}>{chapter.numeral}</a>
                : <span className={styles.pending} aria-label={`Chapter ${chapter.numeral}: ${chapter.title}, not yet available`} title={`${chapter.title} — not yet available`}>{chapter.numeral}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <span className={styles.current} aria-hidden="true">Chapter {current.numeral} · {current.title}</span>
    </aside>
  );
}
