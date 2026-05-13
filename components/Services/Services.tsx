import styles from './Services.module.css';

const LogoSvg = () => (
  <svg
    className={styles.logoWatermark}
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

const SERVICES = [
  { num: '01', name: 'UX/UI Design', desc: 'Interfaces built for clarity and conversion. Designed to work on every screen, not just look good in a mockup.' },
  { num: '02', name: 'Web Development', desc: 'Fast, clean builds on modern stacks. No bloat, no mystery code, no page-speed surprises.' },
  { num: '03', name: 'Brand Identity', desc: 'Visual systems that hold — from logo to full brand lockup. Built to last past the first refresh.' },
  { num: '04', name: 'Content Strategy', desc: "Content built around what your customers are actually searching for — not what sounds good in a deck." },
  { num: '05', name: 'Social Management', desc: 'Consistent presence on the channels that matter to your audience. No filler posts, no ghost months.' },
  { num: '06', name: 'Paid Media', desc: "We manage ad budgets like they're our own — tight targeting, real attribution, no wasted spend." },
];

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <div className={styles.top}>
        <div className={styles.label}>
          <span className={styles.yellowBracket}>[</span>
          What We Do
          <span className={styles.yellowBracket}>]</span>
        </div>
        <LogoSvg />
      </div>

      <h2 className={styles.headline}>Our Services</h2>
      <p className={styles.sub}>
        From concept to launch — everything your brand needs to compete and convert in the
        digital space.
      </p>

      <div className={styles.layout}>
        {SERVICES.map((svc) => (
          <div key={svc.num} className={styles.card}>
            <div className={styles.numBadge}>{svc.num}</div>
            <div className={styles.name}>{svc.name}</div>
            <div className={styles.desc}>{svc.desc}</div>
          </div>
        ))}

        {/* Featured: Analytics & SEO */}
        <div className={`${styles.card} ${styles.featuredCard}`}>
          <div className={styles.cardGridLines} aria-hidden="true" />
          <div className={styles.featuredInner}>
            <div className={styles.numBadge}>07</div>
            <div>
              <div className={`${styles.name} ${styles.nameLarge}`}>Analytics &amp; SEO</div>
              <div className={`${styles.desc} ${styles.descLarge}`}>
                Search is where most of your clients find you — or don&apos;t. We audit
                your technical foundation, fix what&apos;s broken, build the content
                infrastructure that ranks, and track everything that matters. No vanity
                metrics. Just the numbers that tell you what&apos;s actually working.
              </div>
            </div>
            <div className={styles.featuredTag}>Main Offer</div>
          </div>
        </div>
      </div>
    </section>
  );
}
