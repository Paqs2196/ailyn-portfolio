'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ChapterLabel } from './scroll-chapters';
import styles from './services.module.css';

const categories = [
  {
    number: '01',
    title: 'Creative & Content',
    items: ['Graphic design', 'Video editing', 'Content creation'],
  },
  {
    number: '02',
    title: 'Marketing & Growth',
    items: ['Marketing strategy', 'Social media brand boosting', 'SEO', 'Email marketing'],
  },
  {
    number: '03',
    title: 'Social & Customer Relationships',
    items: ['Social media management', 'CRM management', 'Customer relations'],
  },
  {
    number: '04',
    title: 'Web & Ecommerce',
    items: ['Shopify development', 'Website management'],
  },
];

export function Services() {
  const section = useRef<HTMLElement>(null);

  return (
    <section id="services" ref={section} aria-labelledby="services-heading" className={styles.section} data-services-scene>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <ChapterLabel numeral="VI" />
          <p className={styles.eyebrow}>From first idea to final frame</p>
          <h2 id="services-heading">Built to move <span>brands forward.</span></h2>
          <p className={styles.intro}>A focused mix of creative direction, digital growth, and the systems that keep your presence moving.</p>
        </div>
        <div className={styles.viewport} data-services-viewport>
          <div className={styles.cards} data-services-track>
            {categories.map(category => (
              <article key={category.number} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.number}>{category.number}</span>
                  <ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3>{category.title}</h3>
                  <ul>
                    {category.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className={styles.hint} aria-hidden="true">Scroll to explore <span>→</span></p>
      </div>
    </section>
  );
}
