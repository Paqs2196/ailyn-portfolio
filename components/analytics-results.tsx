'use client';

import { useEffect, useId, useRef } from 'react';
import { gsap } from 'gsap';
import { ChapterLabel } from './scroll-chapters';
import styles from './analytics-results.module.css';

const results = [
  { title: 'Views', total: 2860730, change: '+871.2%', percent: 871.2 },
  { title: 'Visits', total: 19962, change: '+205.7%', percent: 205.7 },
  { title: 'Content interactions', total: 5852, change: '+1.6K%', percent: 1600 },
  { title: 'Link clicks', total: 32020, change: '+998.8%', percent: 998.8 },
  { title: 'Reach', total: 510658, change: '+645.5%', percent: 645.5 },
];
const format = (value: number) => Math.round(value).toLocaleString('en-US');

function Trend({ percent }: { percent: number }) {
  const gradient = useId();
  // This is a comparison illustration, not a reconstructed time series.
  // Printed percentages are rounded, so the inferred baseline is approximate.
  const ratio = 1 / (1 + percent / 100);
  const start = 160 - ratio * 136;
  const line = `M 8 ${start} C 116 ${start}, 230 24, 392 24`;
  return <svg className={styles.chart} viewBox="0 0 400 180" aria-hidden="true" focusable="false">
    <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d94b16" stopOpacity=".2" /><stop offset="100%" stopColor="#d94b16" stopOpacity="0" /></linearGradient></defs>
    <path d="M 8 160 H 392" stroke="#e4d8cd" fill="none" />
    <path data-trend-fill d={`${line} L 392 160 L 8 160 Z`} fill={`url(#${gradient})`} />
    <path data-trend-line d={line} pathLength="1" stroke="#a8320a" strokeWidth="3" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
    <circle cx="392" cy="24" r="4" fill="#a8320a" />
  </svg>;
}

export function AnalyticsResults() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const observer = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
          const card = entry.target as HTMLElement;
          const delay = index * .075;
          const timeline = gsap.timeline({ defaults: { duration: .48, ease: 'power3.out' }, delay });
          timeline.fromTo(card, { opacity: 0, y: 14 }, { opacity: 1, y: 0, clearProps: 'opacity,transform' }, 0);
          const line = card.querySelector('[data-trend-line]');
          const fill = card.querySelector('[data-trend-fill]');
          if (line) timeline.fromTo(line, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 0);
          if (fill) timeline.fromTo(fill, { opacity: 0 }, { opacity: 1 }, 0);
          card.querySelectorAll<HTMLElement>('[data-count]').forEach(number => {
            const end = Number(number.dataset.count);
            const counter = { value: 0 };
            timeline.to(counter, { value: end, onUpdate: () => {
              number.textContent = number.hasAttribute('data-short') ? `${counter.value.toFixed(1)}K` : format(counter.value);
            }, onComplete: () => { number.textContent = number.dataset.final!; } }, 0);
          });
          animations.push(timeline);
          observer.unobserve(card);
        });
      }, { threshold: .2 });
      const animations: gsap.core.Timeline[] = [];
      section.querySelectorAll('[data-result-card]').forEach(card => observer.observe(card));
      return () => {
        observer.disconnect();
        animations.forEach(animation => animation.revert());
        section.querySelectorAll<HTMLElement>('[data-count]').forEach(number => { number.textContent = number.dataset.final!; });
      };
    });
    return () => media.revert();
  }, []);

  return <section ref={root} id="analytics-results" aria-labelledby="results-heading" className={styles.section}>
    <div className={styles.inner}>
      <ChapterLabel numeral="III" />
      <h2 id="results-heading">Analytics <span>&amp; results.</span></h2>
      <div className={styles.grid}>
        {results.map(result => <article key={result.title} data-result-card className={styles.card}>
          <h3>{result.title}</h3>
          <div className={styles.metric}>
            <span className="sr-only">{format(result.total)}</span>
            <span className={styles.total} data-count={result.total} data-final={format(result.total)} aria-hidden="true">{format(result.total)}</span>
            <span className={styles.change}>{result.change}</span>
          </div>
          <Trend percent={result.percent} />
        </article>)}
        <article data-result-card className={`${styles.card} ${styles.weekly}`}>
          <h3>Weekly insights</h3>
          <dl className={styles.summary}>
            <div><dt>Facebook reach</dt><dd><span className="sr-only">7.8K</span><span aria-hidden="true" data-count="7.8" data-short data-final="7.8K">7.8K</span></dd></div>
            <div><dt>Instagram reach</dt><dd><span className="sr-only">1.2K</span><span aria-hidden="true" data-count="1.2" data-short data-final="1.2K">1.2K</span></dd></div>
          </dl>
        </article>
      </div>
      <p className={styles.note}>Reported totals and changes. Trend lines are illustrative; starting levels are estimated from the displayed percentage changes.</p>
    </div>
  </section>;
}
