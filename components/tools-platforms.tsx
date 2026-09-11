'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import groups from '@/lib/tool-data.json';
import styles from './tools-platforms.module.css';
import { ChapterLabel } from './scroll-chapters';

export function ToolsPlatforms() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!section || preference.matches || !('IntersectionObserver' in window)) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        animations.push(entry.target.animate(
          [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 480, delay: index * 75, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' },
        ));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    const stop = () => {
      if (preference.matches) {
        observer.disconnect();
        animations.forEach(animation => animation.cancel());
      }
    };
    section.querySelectorAll('[data-tool-group]').forEach(group => observer.observe(group));
    preference.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      preference.removeEventListener('change', stop);
    };
  }, []);

  return (
    <section id="tools-platforms" ref={root} aria-labelledby="tools-heading" className={styles.section}>
      <div className={styles.inner}>
        <ChapterLabel numeral="VII" />
        <h2 id="tools-heading">Tools <span>&amp; platforms.</span></h2>
        <div className={styles.groups}>
          {groups.map(group => (
            <div key={group.name} data-tool-group className={styles.group}>
              <h3>{group.name}</h3>
              <ul className={styles.list}>
                {group.items.map(tool => (
                  <li key={tool.id} className={styles.tool}>
                    <span className={styles.icon}><Image src={tool.src} alt="" width={32} height={32} unoptimized /></span>
                    <span>{tool.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
