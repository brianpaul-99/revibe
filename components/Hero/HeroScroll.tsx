'use client';

import { useEffect, useRef, useState } from 'react';
import { SKULL_FRAMES } from '@/lib/skullFrames';
import styles from './HeroScroll.module.css';

const SERVICES = [
  'UX/UI Design',
  'Web Development',
  'Brand Identity',
  'Content Strategy',
  'Social Management',
];

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = container.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      setFrameIndex(
        Math.min(Math.floor(progress * SKULL_FRAMES.length), SKULL_FRAMES.length - 1)
      );
      setServiceIndex(
        Math.min(Math.floor(progress * SERVICES.length), SERVICES.length - 1)
      );
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className={styles.scrollContainer} id="hero">
      <div className={styles.sticky}>
        <div className={styles.bgText} aria-hidden="true">
          REVIBE
        </div>

        <div className={styles.skullDisplay} aria-hidden="true">
          <div
            className={styles.skullSvgWrap}
            dangerouslySetInnerHTML={{ __html: SKULL_FRAMES[frameIndex] ?? '' }}
          />
        </div>

        <div className={styles.serviceCarousel} aria-hidden="true">
          <div className={styles.carouselTrack}>
            {SERVICES.map((svc, i) => (
              <span
                key={svc}
                className={[
                  styles.svcItem,
                  i === serviceIndex ? styles.svcActive : '',
                  i === serviceIndex - 1 || i === serviceIndex + 1
                    ? styles.svcNear
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {svc}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.heroBottom}>
          <h1 className={styles.heroHeadline}>
            <span className={styles.h1}>Digital</span>
            <span className={styles.h2}>Marketing Agency</span>
          </h1>
          <div className={styles.heroMeta}>
            <span className={styles.heroCopyright}>©2026</span>
            <span className={styles.heroTagline}>
              We build digital systems
              <br />
              that earn demand.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
