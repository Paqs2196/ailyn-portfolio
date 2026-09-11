'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import rawItems from '@/lib/work-data.json';
import styles from './selected-work.module.css';
import { DESKTOP_SCROLL_QUERY } from '@/lib/scroll-config';
import { SCENE_UPDATE, sceneElementVisible } from '@/lib/chapter-scroll';
import { ChapterLabel } from './scroll-chapters';

type Category = 'Video' | 'Graphic Design' | 'Social';
type Item = { id: string; title: string; category: Category; kind: string; src: string; poster: string | null; width: number; height: number; audio: boolean | null; group: string };
const ITEMS = rawItems as Item[];
const FILTERS = ['All', 'Video', 'Graphic Design', 'Social'] as const;
const FEATURE_IDS = ['p06-02', 'p10-01', 'p14-04'];
const FEATURES = FEATURE_IDS.map(id => ITEMS.find(item => item.id === id)!);
const FEATURE_COPY = [
  { title: '5 SENS', detail: 'Product imagery' },
  { title: 'Linen vs. hemp', detail: 'Video editing' },
  { title: 'Waitlist Golf', detail: 'Social creative' },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync(); query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function FeaturedVideo({ item, suspended, reduced }: { item: Item; suspended: boolean; reduced: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const userPaused = useRef(false);
  const inView = useRef(false);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const desktop = window.matchMedia(DESKTOP_SCROLL_QUERY);
    let pendingPlay = false;
    const sync = () => {
      if (desktop.matches) inView.current = sceneElementVisible(el);
      if (document.hidden || suspended || !inView.current || reduced || userPaused.current) el.pause();
      else if (el.paused && !pendingPlay) {
        if (!el.src) { el.src = item.src; el.load(); }
        pendingPlay = true;
        void el.play().catch(() => setPlaying(false)).finally(() => { pendingPlay = false; });
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!desktop.matches) { inView.current = entry.isIntersecting && entry.intersectionRatio >= .45; sync(); }
    }, {threshold: .45});
    const branch = () => {
      observer.disconnect(); inView.current = false;
      if (!desktop.matches) observer.observe(el);
      sync();
    };
    desktop.addEventListener('change', branch);
    window.addEventListener(SCENE_UPDATE, sync);
    document.addEventListener('visibilitychange', sync); branch();
    return () => { observer.disconnect(); desktop.removeEventListener('change', branch); window.removeEventListener(SCENE_UPDATE, sync); document.removeEventListener('visibilitychange', sync); el.pause(); };
  }, [reduced, suspended]);
  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      if (!el.src) { el.src = item.src; el.load(); }
      void el.play().catch(() => setFailed(true));
    } else { userPaused.current = true; el.pause(); }
  };
  return <>
    <video ref={video} poster={item.poster!} muted={muted} playsInline loop preload="none" aria-label={item.title} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} className={styles.featureVideo} />
    <div className={styles.videoControls}>
      <button type="button" onClick={toggle} aria-label={playing ? 'Pause featured video' : 'Play featured video'}>{playing ? <Pause size={18} /> : <Play size={18} />}<span>{playing ? 'Pause' : 'Play'}</span></button>
      <button type="button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute featured video' : 'Mute featured video'}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
    </div>
    {failed && <p className={styles.mediaError}>Preview unavailable. Open the full video below.</p>}
  </>;
}

function ThumbnailMedia({ item }: { item: Item }) {
  const video = useRef<HTMLVideoElement>(null);
  const preview = () => {
    const element = video.current;
    if (!element) return;
    void element.play().catch(() => undefined);
  };
  const stopPreview = () => {
    const element = video.current;
    if (!element) return;
    element.pause();
    element.currentTime = 0;
  };

  if (item.kind !== 'video') {
    return <Image src={`/work/thumbnails/${item.id}.webp`} alt="" width={item.width} height={item.height} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" className={styles.thumbImage} />;
  }

  return <video
    ref={video}
    src={item.src}
    poster={item.poster ?? undefined}
    muted
    loop
    playsInline
    preload="none"
    aria-hidden="true"
    className={styles.thumbVideo}
    onMouseEnter={preview}
    onMouseLeave={stopPreview}
    onFocus={preview}
    onBlur={stopPreview}
  />;
}

export function SelectedWork() {
  const section = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const lightboxMedia = useRef<HTMLVideoElement>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [limit, setLimit] = useState(12);
  const [selection, setSelection] = useState<{ items: Item[]; index: number } | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const reduced = useReducedMotion();
  const filtered = ITEMS.filter(item => filter === 'All' || item.category === filter);
  const visible = filtered.slice(0, limit);
  const current = selection?.items[selection.index];

  useEffect(() => {
    window.dispatchEvent(new Event('portfolio:work-reflow'));
  }, [filter, limit]);

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ parallax: '(min-width: 800px) and (prefers-reduced-motion: no-preference)', desktop: DESKTOP_SCROLL_QUERY }, context => {
      if (!context.conditions?.parallax || context.conditions?.desktop) return;
      section.current?.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
        gsap.fromTo(el, { y: -14 }, { y: 14, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: .8 } });
      });
    }, section);
    return () => media.revert();
  }, [reduced]);

  useEffect(() => {
    const el = dialog.current;
    if (!selection || !el) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    el.showModal();
    return () => { el.close(); document.body.style.overflow = overflow; opener.current?.focus({preventScroll:true}); };
  }, [Boolean(selection)]);

  useEffect(() => {
    const pause = () => { if (document.hidden) lightboxMedia.current?.pause(); };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);

  function open(items: Item[], index: number, target: HTMLElement) {
    opener.current = target; setMediaError(false); setSelection({items,index});
  }
  function close() { lightboxMedia.current?.pause(); setSelection(null); }
  function move(direction: number) {
    lightboxMedia.current?.pause(); setMediaError(false);
    setSelection(s => s ? {...s,index:(s.index + direction + s.items.length) % s.items.length} : s);
  }

  return <section id="selected-work" ref={section} className={styles.section} aria-labelledby="work-heading">
    <div className={styles.chapter}><ChapterLabel numeral="II" /></div>
    <div className={styles.introduction}>
      <h2 id="work-heading">Selected <span>work.</span></h2>
      <p>From striking graphics to engaging<br className={styles.desktopBreak} /> social media campaigns.</p>
    </div>

    <div className={styles.features}>
      {FEATURES.map((item,index) => <article className={`${styles.feature} ${styles['feature' + index]}`} key={item.id}>
        <div className={styles.featureMedia} style={{ '--media-ratio': `${item.width} / ${item.height}` } as CSSProperties}>
          {item.kind === 'video' ? <FeaturedVideo item={item} reduced={reduced} suspended={Boolean(selection)} /> :
            <button type="button" className={styles.featureOpen} aria-label={`Open ${FEATURE_COPY[index].title}`} onClick={e => open(FEATURES,index,e.currentTarget)}>
              <div className={styles.parallax} data-parallax><Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 90vw, 75vw" className={styles.featureImage} /></div>
              <span className={styles.expand}><Maximize2 size={18} aria-hidden="true" /><span>View image</span></span>
            </button>}
        </div>
        <div className={styles.featureMeta}>
          <div><p>{FEATURE_COPY[index].detail}</p><h3>{FEATURE_COPY[index].title}</h3></div>
          <button type="button" className={styles.featureLink} onClick={e => open(FEATURES,index,e.currentTarget)} aria-label={`Open ${item.kind === 'video' ? 'video' : 'image'}: ${FEATURE_COPY[index].title}`}><span>{item.kind === 'video' ? 'Watch full video' : 'View image'}</span><ArrowUpRight size={24} aria-hidden="true" /></button>
        </div>
      </article>)}
    </div>

    <div className={styles.archive}>
      <div className={styles.archiveHeader}>
        <h3>More to explore</h3>
        <div className={styles.filters} role="group" aria-label="Filter work">
          {FILTERS.map(label => <button key={label} type="button" aria-pressed={filter === label} onClick={() => {setFilter(label);setLimit(12);}}>{label}<span>{label === 'All' ? ITEMS.length : ITEMS.filter(item => item.category === label).length}</span></button>)}
        </div>
      </div>
      <p className={styles.resultCount} role="status" aria-live="polite">Showing {visible.length} of {filtered.length} {filter === 'All' ? 'pieces' : filter.toLowerCase() + ' pieces'}</p>
      <div className={styles.grid}>
        {visible.map((item,index) => <article key={item.id} className={styles.card}>
          <button type="button" className={styles.thumbnail} style={{ '--media-ratio': `${item.width} / ${item.height}` } as CSSProperties} aria-label={`Open ${item.title}`} onClick={e => open(filtered,index,e.currentTarget)}>
            <ThumbnailMedia item={item} />
            <span className={styles.cardAction}>{item.kind === 'video' ? <Play size={21} aria-hidden="true" /> : <ArrowUpRight size={21} aria-hidden="true" />}</span>
          </button>
          <div className={styles.cardMeta}><h4>{item.title}</h4><span>{item.category}</span></div>
        </article>)}
      </div>
      {visible.length < filtered.length && <button type="button" className={styles.loadMore} onClick={() => setLimit(n => n+12)}>Show more work <ArrowDown size={18} aria-hidden="true" /></button>}
    </div>

    <dialog ref={dialog} className={styles.dialog} aria-labelledby="lightbox-title" onCancel={e => {e.preventDefault();close();}} onClick={e => {if (e.target === e.currentTarget) close();}} onKeyDown={e => {
      if ((e.target as HTMLElement).tagName === 'VIDEO') return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowLeft') {e.preventDefault();move(-1);}
      if (e.key === 'ArrowRight') {e.preventDefault();move(1);}
    }}>
      {current && <div className={styles.dialogContent}>
        <header className={styles.dialogHeader}><div><p>{current.category}{current.kind === 'video' && !current.audio ? ' / Silent video' : ''}</p><h3 id="lightbox-title">{current.title}</h3></div><button autoFocus type="button" onClick={close} aria-label="Close media viewer"><X size={24} /></button></header>
        <div className={styles.viewer}>
          {current.kind === 'video' ? <video key={current.id} ref={lightboxMedia} src={current.src} poster={current.poster!} controls playsInline preload="metadata" aria-label={current.title} onError={() => setMediaError(true)} /> : <Image key={current.id} src={current.src} alt={current.title} width={current.width} height={current.height} sizes="95vw" onError={() => setMediaError(true)} />}
          {mediaError && <p role="alert">This file could not load. <a href={current.src} target="_blank" rel="noopener noreferrer">Open the local file directly</a>.</p>}
        </div>
        <footer className={styles.dialogFooter}><button type="button" aria-label="Previous piece" onClick={() => move(-1)}><ChevronLeft size={22} />Previous</button><span aria-live="polite">{selection!.index+1} / {selection!.items.length}</span><button type="button" aria-label="Next piece" onClick={() => move(1)}>Next<ChevronRight size={22} /></button></footer>
      </div>}
    </dialog>
  </section>;
}
