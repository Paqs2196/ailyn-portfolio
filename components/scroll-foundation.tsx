'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESKTOP_SCROLL_QUERY, MASTER_SCROLL_ID } from '@/lib/scroll-config';
import { ENTRY_CHANGE, ENTRY_SKIP, SCENE_UPDATE, registerTimelineChapter, setChapterScrollDriver } from '@/lib/chapter-scroll';
import styles from './scroll-foundation.module.css';

/**
 * Desktop-only foundation shell.
 *
 * Desktop-only master owner for migrated scenes. Unmigrated sections remain
 * siblings in native document flow.
 */
const YEARS = Array.from({ length: 8 }, (_, index) => 2019 + index);
const MIGRATED_SCENE_IDS = ['selected-work', 'analytics-results', 'companies', 'about', 'services', 'tools-platforms', 'contact'] as const;
const WIPE_SCENE_IDS = ['selected-work', 'analytics-results', 'companies', 'about', 'tools-platforms', 'contact'] as const;

export function ScrollFoundation({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    const viewport = stage.current;
    if (!root || !viewport) return;

    gsap.registerPlugin(ScrollTrigger);
    const preference = window.matchMedia(DESKTOP_SCROLL_QUERY);
    let teardown: (() => void) | undefined;

    const enterDesktop = () => {
      const lenis = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        lerp: .1,
        prevent: node => Boolean(node.closest('dialog')),
      });
      const tick = () => lenis.raf(performance.now());
      const updateScroll = () => ScrollTrigger.update();
      lenis.on('scroll', updateScroll);
      gsap.ticker.add(tick);
      root.dataset.scrollMode = 'desktop';
      root.dataset.masterState = 'hero-work';
      let intro: gsap.core.Timeline | undefined;
      let introActive = false;
      let removeChapter = () => {};
      const finishEntry = () => {
        if (!introActive) return;
        introActive = false;
        root.dataset.entryState = 'complete';
        window.dispatchEvent(new Event(ENTRY_CHANGE));
      };
      const skipEntry = () => {
        if (!introActive) return;
        intro?.progress(1);
        finishEntry();
      };
      const skipOnScroll = () => skipEntry();
      const skipOnKeydown = () => skipEntry();
      const driverCleanup = setChapterScrollDriver((position, immediate) => {
        lenis.scrollTo(position, { immediate, force: true });
      });

      const context = gsap.context(() => {
        gsap.set(root, { overflowAnchor: 'none' });
        gsap.set(viewport, { height: '100dvh', overflow: 'clip' });
        const track = viewport.querySelector<HTMLElement>('[data-master-track]');
        const hero = viewport.querySelector<HTMLElement>('#hero');
        const scenes = MIGRATED_SCENE_IDS.map(id => viewport.querySelector<HTMLElement>(`#${id}`)).filter((scene): scene is HTMLElement => Boolean(scene));
        if (!track || !hero || scenes.length !== MIGRATED_SCENE_IDS.length) return;
        let boundaries: { id: string; el: HTMLElement; start: number; end: number }[] = [];
        let hold = 0;
        let travel = 1;
        let total = 1;
        const master = gsap.timeline({
          onUpdate: () => {
            const time = master.time();
            const visible = viewport.getBoundingClientRect().bottom > 0 && viewport.getBoundingClientRect().top < innerHeight;
            hero.dataset.sceneVisible = String(visible && time >= 0 && time < (boundaries[0]?.start ?? total));
            boundaries.forEach(boundary => {
              boundary.el.dataset.sceneVisible = String(visible && time >= boundary.start - innerHeight && time <= boundary.end + innerHeight);
            });
            root.dataset.masterProgress = master.progress().toFixed(3);
            window.dispatchEvent(new Event(SCENE_UPDATE));
          },
          scrollTrigger: {
            id: MASTER_SCROLL_ID,
            trigger: root,
            pin: viewport,
            pinSpacing: true,
            start: 'top top',
            end: () => `+=${Math.max(1, total)}`,
            scrub: true,
            refreshPriority: 1,
            invalidateOnRefresh: true,
          },
        });
        const build = () => {
          hold = Math.max(320, innerHeight * .65);
          travel = Math.max(1, track.offsetHeight - innerHeight);
          total = hold + travel;
          const trackTop = track.getBoundingClientRect().top;
          master.clear()
            .addLabel('hero:start', 0)
            .to({}, { duration: hold })
            .addLabel('hero:end', hold);
          boundaries = scenes.map((scene, index) => {
            const localTop = scene.getBoundingClientRect().top - trackTop;
            const start = hold + localTop;
            const end = index === scenes.length - 1 ? total : start + scene.offsetHeight;
            const wipeDuration = innerHeight * .65;
            const id = MIGRATED_SCENE_IDS[index];
            master.addLabel(`${id}:start`, start);
            if ((WIPE_SCENE_IDS as readonly string[]).includes(id)) {
              master.fromTo(scene, { clipPath: 'inset(0 0 0 100%)' }, {
                clipPath: 'inset(0 0 0 0%)',
                duration: wipeDuration,
                ease: 'none',
                immediateRender: false,
              }, Math.max(0, start - innerHeight));
            }
            if (id === 'services') {
              const horizontalTrack = scene.querySelector<HTMLElement>('[data-services-track]');
              const horizontalViewport = scene.querySelector<HTMLElement>('[data-services-viewport]');
              if (horizontalTrack && horizontalViewport) {
                const distance = Math.max(0, horizontalTrack.scrollWidth - horizontalViewport.clientWidth);
                master.fromTo(horizontalTrack, { x: 0 }, {
                  x: -distance,
                  duration: Math.max(1, scene.offsetHeight),
                  ease: 'none',
                  immediateRender: false,
                }, start);
              }
            }
            master.addLabel(`${id}:end`, end);
            scene.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => {
              const frame = element.parentElement;
              if (!frame) return;
              const top = frame.getBoundingClientRect().top - trackTop;
              const pStart = Math.max(hold, hold + top - innerHeight);
              const pEnd = Math.min(total, hold + top + frame.offsetHeight);
              master.fromTo(element, { y: -14 }, {
                y: 14,
                duration: Math.max(1, pEnd - pStart),
                ease: 'none',
                immediateRender: false,
              }, pStart);
            });
            return { id, el: scene, start, end };
          });
          master.fromTo(track, { y: 0 }, { y: -travel, duration: travel, ease: 'none', immediateRender: false }, hold);
          if (master.scrollTrigger) {
            removeChapter();
            removeChapter = () => {};
            const removeHero = registerTimelineChapter('hero', master.scrollTrigger, 'hero:start', 'hero:end');
            const removeScenes = boundaries.map(scene => registerTimelineChapter(scene.id, master.scrollTrigger!, `${scene.id}:start`, `${scene.id}:end`));
            removeChapter = () => { removeHero(); removeScenes.forEach(remove => remove()); };
          }
        };
        build();
        ScrollTrigger.refresh();
        const resize = new ResizeObserver(() => {
          build();
          ScrollTrigger.refresh();
        });
        resize.observe(track);
        resize.observe(hero);
        scenes.forEach(scene => resize.observe(scene));
        const onWorkReflow = () => { build(); ScrollTrigger.refresh(); };
        root.addEventListener('portfolio:work-reflow', onWorkReflow);
        (master as gsap.core.Timeline & { __cleanup?: () => void }).__cleanup = () => {
          resize.disconnect();
          root.removeEventListener('portfolio:work-reflow', onWorkReflow);
        };
      }, root);

      if (!window.location.hash && window.scrollY < 2) {
        const overlay = viewport.querySelector<HTMLElement>('[data-master-entry]');
        const yearStrip = viewport.querySelector<HTMLElement>('[data-year-strip]');
        const hero = viewport.querySelector<HTMLElement>('#hero');
        if (overlay && yearStrip && hero) {
          introActive = true;
          root.dataset.entryState = 'playing';
          hero.inert = true;
          window.dispatchEvent(new Event(ENTRY_CHANGE));
          const name = hero.querySelector<HTMLElement>('[data-hero-name]');
          const rest = hero.querySelectorAll<HTMLElement>('[data-enter]:not([data-hero-name]), [data-photo], header, [data-hero-footer]');
          gsap.set(overlay, { display: 'flex', opacity: 1 });
          gsap.set(overlay, { clipPath: 'inset(0 0 0 0%)' });
          gsap.set(yearStrip, { yPercent: 0 });
          gsap.set([name, ...rest], { opacity: 0, y: 24 });
          intro = gsap.timeline({ onComplete: () => { hero.inert = false; finishEntry(); } });
          for (let index = 1; index < YEARS.length; index += 1) {
            intro.to(yearStrip, { yPercent: -index * 12.5, duration: .22, ease: 'power3.inOut' }, index * .32);
          }
          intro.to(overlay, { clipPath: 'inset(0 0 100% 0)', duration: .65, ease: 'power3.inOut' }, '+=.2')
            .set(overlay, { display: 'none' })
            .to([name, ...rest], { opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=.1');
        }
      }
      window.addEventListener(ENTRY_SKIP, skipEntry);
      window.addEventListener('scroll', skipOnScroll, { passive: true });
      window.addEventListener('keydown', skipOnKeydown);

      return () => {
        window.removeEventListener(ENTRY_SKIP, skipEntry);
        window.removeEventListener('scroll', skipOnScroll);
        window.removeEventListener('keydown', skipOnKeydown);
        intro?.kill();
        const master = ScrollTrigger.getById(MASTER_SCROLL_ID)?.animation as (gsap.core.Timeline & { __cleanup?: () => void }) | undefined;
        master?.__cleanup?.();
        removeChapter();
        driverCleanup();
        context.revert();
        gsap.ticker.remove(tick);
        lenis.off('scroll', updateScroll);
        lenis.destroy();
        delete root.dataset.entryState;
        delete root.dataset.masterProgress;
        const hero = viewport.querySelector<HTMLElement>('#hero');
        if (hero) hero.inert = false;
        delete root.dataset.masterState;
        if (hero) delete hero.dataset.sceneVisible;
        MIGRATED_SCENE_IDS.forEach(id => {
          const scene = viewport.querySelector<HTMLElement>(`#${id}`);
          if (scene) delete scene.dataset.sceneVisible;
        });
        root.dataset.scrollMode = 'native';
      };
    };

    const syncMode = () => {
      if (preference.matches) {
        if (!teardown) teardown = enterDesktop();
      } else {
        teardown?.();
        teardown = undefined;
      }
    };

    preference.addEventListener('change', syncMode);
    syncMode();
    return () => {
      preference.removeEventListener('change', syncMode);
      teardown?.();
    };
  }, []);

  return (
    <div ref={host} className={styles.host} data-scroll-foundation data-scroll-mode="native" data-master-state="inactive">
      <div ref={stage} className={styles.stage} data-master-stage>
        <div data-master-track>{children}</div>
        <div className={styles.entry} data-master-entry>
          <div className={styles.yearWindow} aria-hidden="true">
            <div className={styles.years} data-year-strip>{YEARS.map(year => <span key={year}>{year}</span>)}</div>
          </div>
          <button className={styles.skip} type="button" onClick={() => window.dispatchEvent(new Event(ENTRY_SKIP))}>Skip introduction</button>
        </div>
      </div>
    </div>
  );
}
