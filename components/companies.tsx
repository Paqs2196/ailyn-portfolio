import Image from 'next/image';
import companies from '@/lib/company-data.json';
import styles from './companies.module.css';
import { ChapterLabel } from './scroll-chapters';

export function Companies() {
  return (
    <section id="companies" aria-labelledby="companies-heading" className={styles.section}>
      <div className={styles.inner}>
        <ChapterLabel numeral="IV" />
        <h2 id="companies-heading">Companies that<br /><span>have trusted me.</span></h2>
        <ul className={styles.logos} aria-label="Companies Ailyn has worked with">
          {companies.map((company) => {
            const logo = <Image src={company.src} alt={company.name} width={company.width} height={company.height} className={styles.logo} unoptimized />;
            return (
              <li key={company.id} className={`${styles.company} ${company.dark ? styles.dark : ''}`}>
                {company.href ? <a className={styles.link} href={company.href}>{logo}</a> : logo}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
