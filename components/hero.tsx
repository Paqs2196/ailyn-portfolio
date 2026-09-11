'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { gsap } from 'gsap';
import styles from './hero.module.css';
import { DESKTOP_SCROLL_QUERY } from '@/lib/scroll-config';
import { ENTRY_CHANGE } from '@/lib/chapter-scroll';
import { ChapterLabel } from './scroll-chapters';

export const ROLES = ['Digital Marketer', 'Graphic Designer', 'Video Editor', 'Content Creator'] as const;
const CONTACT = 'https://www.upwork.com/freelancers/~0181b668887ab39954';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const media = gsap.matchMedia();
    let inView = true;
    const syncPlayback = () => {
      timeline.current?.paused(pausedRef.current || document.hidden || !inView || section.closest('[data-entry-state="playing"]') !== null);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.1 });
    observer.observe(section);
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener(ENTRY_CHANGE, syncPlayback);

    media.add({ desktop: DESKTOP_SCROLL_QUERY, motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
      const prefersReduced = Boolean(context.conditions?.reduced);
      setReduced(prefersReduced);
      if (prefersReduced) return;
      const titles = Array.from(section.querySelectorAll<HTMLElement>('[data-role]'));
      if (!context.conditions?.desktop) {
      gsap.fromTo(section.querySelectorAll('[data-enter]'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'opacity,transform' });
      gsap.fromTo(section.querySelector('[data-photo]'),
        { clipPath: 'inset(8% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.1, ease: 'power3.out', clearProps: 'clipPath,opacity' });
      }
      gsap.set(titles, { autoAlpha: 0, yPercent: 25, filter: 'blur(8px)' });
      gsap.set(titles[0], { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)' });
      const cycle = gsap.timeline({ repeat: -1 });
      titles.forEach((title, index) => {
        const next = (index + 1) % titles.length;
        const at = index * 3.6 + 3;
        cycle.to(title, { autoAlpha: 0, yPercent: -22, filter: 'blur(8px)', duration: 0.45, ease: 'power2.in' }, at)
          .fromTo(titles[next], { autoAlpha: 0, yPercent: 25, filter: 'blur(8px)' },
            { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', immediateRender: false }, at)
          .call(() => setActive(next), [], at + 0.3);
      });
      timeline.current = cycle;
      syncPlayback();
      return () => { timeline.current = null; };
    }, section);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      window.removeEventListener(ENTRY_CHANGE, syncPlayback);
      media.revert();
    };
  }, []);

  function toggleMotion() {
    const next = !paused;
    pausedRef.current = next;
    setPaused(next);
    // Finish the current crossfade so pausing never leaves two blurred titles.
    const cycle = timeline.current;
    if (cycle && next) {
      const phase = cycle.time() % 3.6;
      if (phase >= 3) cycle.time(Math.min(cycle.duration(), cycle.time() + 3.6 - phase));
    }
    cycle?.paused(next);
  }

  return (
    <section id="hero" ref={root} className={styles.hero} aria-labelledby="hero-heading">
      <a className={styles.skip} href="#hero-heading">Skip to introduction</a>
      <header className={styles.header}>
        <a className={styles.wordmark} href="/" aria-label="Create with Ailyn home">Create with <span>Ailyn</span><sup>TM</sup></a>
        <a className={styles.contact} href={CONTACT} target="_blank" rel="noopener noreferrer">Let’s talk <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> on Upwork (opens in a new tab)</span></a>
      </header>

      <div className={styles.stage}>
        <div className={styles.copy}>
          <ChapterLabel numeral="I" />
          <p className={styles.intro} data-enter>Hi there. This is</p>
          <h1 id="hero-heading" tabIndex={-1} className={styles.heading}>
            <span className={styles.name} data-enter data-hero-name>Ailyn<span className={styles.period}>.</span></span>
            <span className="sr-only"> Digital Marketer, Graphic Designer, Video Editor, and Content Creator.</span>
            <span className={styles.roleWindow} aria-hidden="true" data-enter>
              {ROLES.map((role, index) => <span key={role} data-role className={`${styles.role} ${index === 0 ? styles.firstRole : ''}`}>{role}</span>)}
            </span>
          </h1>
          <p className={styles.staticRoles}>Digital marketing · Graphic design<br />Video editing · Content creation</p>
          <p className={styles.tagline} data-enter>Elevating your brand by design, from strategy to screen.</p>
          <p className={styles.description} data-enter>From striking graphics to engaging content.<br />Let’s bring your brand to life.</p>
          <div className={styles.actions} data-enter>
            <a className={styles.primary} href="#selected-work">View selected work <ArrowUpRight size={20} strokeWidth={1.75} aria-hidden="true" /></a>
          </div>
        </div>

        <figure className={styles.portrait} data-photo>
          <Image src="/images/ailyn-portrait.jpg" alt="Ailyn wearing a white blazer against a dark studio background" fill preload sizes="(max-width: 700px) 90vw, 44vw" className={styles.photo} />
          <div className={styles.photoShade} aria-hidden="true" />
          <figcaption className={styles.signature}>Create with <span>Ailyn</span><sup>TM</sup></figcaption>
        </figure>
      </div>

      <div className={styles.footer} data-hero-footer>
        <div className={styles.motionControls}>
          <div className={styles.progress} aria-hidden="true">{ROLES.map((role, index) => <span key={role} className={index === active ? styles.current : ''} />)}</div>
          <button type="button" onClick={toggleMotion} disabled={reduced} aria-pressed={paused} aria-label={reduced ? 'Role animation disabled by reduced-motion preference' : paused ? 'Resume role animation' : 'Pause role animation'} className={styles.pause}>
            {paused || reduced ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            <span>{reduced ? 'Motion reduced' : paused ? 'Resume motion' : 'Pause motion'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
