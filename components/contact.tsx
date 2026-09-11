import { ArrowUpRight } from 'lucide-react';
import { ChapterLabel } from './scroll-chapters';
import styles from './contact.module.css';

const CONTACT = 'https://www.upwork.com/freelancers/~0181b668887ab39954';

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className={styles.section}>
      <div className={styles.inner}>
        <ChapterLabel numeral="VIII" />
        <p className={styles.eyebrow}>Have a project in mind?</p>
        <h2 id="contact-heading">Let’s make<br /><span>something move.</span></h2>
        <a className={styles.cta} href={CONTACT} target="_blank" rel="noopener noreferrer">
          Start a conversation <ArrowUpRight size={22} strokeWidth={1.6} aria-hidden="true" />
          <span className="sr-only"> on Upwork (opens in a new tab)</span>
        </a>
        <div className={styles.footer}>
          <p className={styles.signature}>Create with <span>Ailyn</span><sup>TM</sup></p>
          <p className={styles.note}>Digital marketing · Graphic design · Video editing · Content creation</p>
        </div>
      </div>
    </section>
  );
}
