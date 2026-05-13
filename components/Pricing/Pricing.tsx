import styles from './Pricing.module.css';

const SMALL_PACKAGES = [
  {
    pill: 'Starter',
    price: '$1,000',
    desc: 'For local businesses that need a stronger search foundation and a site that feels current.',
    features: ['Technical SEO cleanup', '1 landing page refresh', 'Google Business Profile support'],
    cta: '→ Get Started',
    ctaStyle: 'primary',
  },
  {
    pill: 'Growth',
    price: '$1,500',
    desc: 'For brands ready to scale traffic, sharpen messaging, and turn clicks into real leads.',
    features: ['SEO content plan', 'Conversion-focused page design', 'Monthly reporting and strategy'],
    cta: '→ Get Started',
    ctaStyle: 'primary',
  },
  {
    pill: 'Custom',
    price: "Let's Talk",
    desc: "Not sure which fits? Tell us what you're building and we'll scope something that makes sense.",
    features: ['Tailored scope and deliverables', 'One-off or ongoing', 'No overhead, no middlemen'],
    cta: '→ Get in Touch',
    ctaStyle: 'outline',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <span className={styles.sectionTag}>Pricing</span>
      <h2 className={styles.headline}>Simple Packages.</h2>
      <p className={styles.sub}>
        Flexible by design. Pick a starting point — we&apos;ll shape it to fit.
      </p>

      {/* Featured card */}
      <div className={`${styles.featuredCard} ${styles.pricingCard}`}>
        <div className={styles.cardNoise} aria-hidden="true" />
        <div className={styles.cardGridLines} aria-hidden="true" />
        <div className={`${styles.cardInner} ${styles.featuredInner}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardPill}>Most Popular</span>
            <span className={styles.priceTag}>
              $2,500
              <span className={styles.priceUnit}>/mo</span>
            </span>
          </div>
          <div className={styles.pricingFeatures}>
            <div className={styles.packageName}>Authority</div>
            <p className={styles.pricingDesc}>
              For ambitious teams that want a full-funnel partner across search, site, and
              lifecycle marketing.
            </p>
            <ul className={styles.pricingList}>
              <li>Multi-page growth roadmap</li>
              <li>Custom campaign landing pages</li>
              <li>Email funnel and optimization</li>
            </ul>
          </div>
          <div className={styles.cardBottom}>
            <a className={styles.ctaBtn} href="#contact">
              → Get Started
            </a>
            <span className={styles.cardArrow} aria-hidden="true">
              ↗
            </span>
          </div>
        </div>
      </div>

      {/* Small cards */}
      <div className={styles.smallCards}>
        {SMALL_PACKAGES.map((pkg) => (
          <div
            key={pkg.pill}
            className={`${styles.smallCard} ${styles.pricingCard} ${
              pkg.pill === 'Custom' ? styles.customCard : ''
            }`}
          >
            <div className={styles.cardGridLines} aria-hidden="true" />
            <div className={styles.cardInner}>
              <div className={styles.cardTop}>
                <span
                  className={`${styles.cardPill} ${
                    pkg.pill === 'Custom' ? styles.cardPillYellow : ''
                  }`}
                >
                  {pkg.pill}
                </span>
                <span
                  className={`${styles.priceTagSm} ${
                    pkg.pill === 'Custom' ? styles.priceTagSmMuted : ''
                  }`}
                >
                  {pkg.price}
                  {pkg.pill !== 'Custom' && (
                    <span className={styles.priceUnit}>/mo</span>
                  )}
                </span>
              </div>
              <div className={`${styles.pricingFeatures} ${styles.pricingFeaturesSmall}`}>
                <p className={styles.pricingDescSmall}>{pkg.desc}</p>
                <ul className={`${styles.pricingList} ${styles.pricingListSmall}`}>
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.cardBottom}>
                <a
                  className={`${styles.ctaBtnSm} ${
                    pkg.ctaStyle === 'outline' ? styles.ctaBtnOutline : ''
                  }`}
                  href="#contact"
                >
                  {pkg.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
