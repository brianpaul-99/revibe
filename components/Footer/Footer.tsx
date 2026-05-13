import styles from './Footer.module.css';

const LogoSvg = () => (
  <svg
    className={styles.marqueeLogo}
    viewBox="0 0 174.24 58.44"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <polygon fill="#F4F4F2" points="92.16 8.33 98.52 8.32 94.22 56.89 63.98 56.71 69.07 29.19 70.32 6.28 79.6 5.76 78.35 33.01 84.77 34.12 92.16 8.33" />
    <path fill="#F4F4F2" d="M163.09,39l10.6-3.14.55,13.2-29.43,4.69,1.36-26.71c.15-2.91-.73-5.13-3.15-6.94l.12-12.31,27.55-3.14-.96,8.69c-3.71,1.18-5.61,2.62-5.73,5.62l8.85.5.42,9.72-9.96,3.27-.22,6.55Z" />
    <path fill="#F4F4F2" d="M55.14,40.72l7.13.43.48,10.96c-7.15-1.03-12.96,3.54-23.24,2.72l-2.95-17.73,7.75-9.97.43-17.96c.03-1.44,1.91-4.4,3.37-4.49l14.19-.84,1.19,17.37-6.28.43c-.8.05-.71,3.18.19,3.21l7.97.29-.82,10.71-9.29.46-.12,4.41Z" />
    <polygon fill="#F4F4F2" points="114.49 52.61 96.8 53.77 104.63 12.27 112.41 12.21 114.49 52.61" />
    <path fill="#F4F4F2" d="M41.39.36L4.22,7.59,0,51.94l17.17,4.88.33-8.61,3.1-.04.92,10.27,14.95-1.02-3.72-21.4,7.93-11.71.71-23.95ZM17.66,25.55l-.66-9.02,9.89-2.37c.43-.11,1.26,1.36,1.75,2.32l-10.98,9.07Z" />
    <path fill="#F4F4F2" d="M139.67,23.64l-.17-23.64-22.82,8.03.48,47.44,24.96-3.5.49-25.1-2.94-3.23ZM134.59,30.14l-7.98,11.88-3.48-8.8,10.79-6.66c.47.56,1.06,3,.67,3.58Z" />
  </svg>
);

const MARQUEE_ITEMS = Array.from({ length: 12 });

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.marqueeWrapper} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {MARQUEE_ITEMS.flatMap((_, i) => [
            <LogoSvg key={`logo-${i}`} />,
            <span key={`dot-${i}`} className={styles.marqueeDot} />,
          ])}
          {/* Duplicate set for seamless loop */}
          {MARQUEE_ITEMS.flatMap((_, i) => [
            <LogoSvg key={`logo-dup-${i}`} />,
            <span key={`dot-dup-${i}`} className={styles.marqueeDot} />,
          ])}
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copy}>© 2026 Revibe</span>
        <div className={styles.socialIcons}>
          <a
            href="#"
            className={styles.socialIcon}
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href="#"
            className={styles.socialIcon}
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="#"
            className={styles.socialIcon}
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
