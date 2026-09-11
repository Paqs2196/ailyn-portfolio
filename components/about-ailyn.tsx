import Image from 'next/image';
import { ChapterLabel } from './scroll-chapters';
import styles from './about-ailyn.module.css';

export function AboutAilyn() {
  return (
    <section id="about" aria-labelledby="about-heading" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <ChapterLabel numeral="V" />
          <p className={styles.lede}>Digital marketing, graphic design, video editing, and content creation.</p>
          <h2 id="about-heading">Ideas with a clear point of view.</h2>
          <div className={styles.body}>
            <p>From striking graphics to engaging content, Ailyn brings brands to life from strategy to screen.</p>
            <p>Let’s bring your brand to life.</p>
          </div>
        </div>
        <figure className={styles.portrait}>
          <Image src="/images/ailyn-portrait.jpg" alt="Ailyn wearing a white blazer against a dark studio background" fill sizes="(max-width: 760px) 100vw, 48vw" data-parallax className={styles.image} />
          <figcaption>Create with <span>Ailyn</span><sup>TM</sup></figcaption>
        </figure>
      </div>
    </section>
  );
}
