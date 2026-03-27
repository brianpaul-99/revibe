import ContactForm from "@/components/ContactForm";
import styles from "./page.module.css";

export default function HomePage() {
  const pricingTiers = [
    {
      name: "Starter",
      description: "For local businesses that need a stronger search foundation and a site that feels current.",
      price: "$1,000",
      features: ["Technical SEO cleanup", "1 landing page refresh", "Google Business Profile support"]
    },
    {
      name: "Growth",
      description: "For brands ready to scale traffic, sharpen messaging, and turn clicks into real leads.",
      price: "$1,500",
      features: ["SEO content plan", "Conversion-focused page design", "Monthly reporting and strategy"]
    },
    {
      name: "Authority",
      description: "For ambitious teams that want a full-funnel partner across search, site, and lifecycle marketing.",
      price: "$2,500",
      features: ["Multi-page growth roadmap", "Custom campaign landing pages", "Email funnel and optimization"]
    }
  ];

  const services = [
    {
      title: "Specialized SEO Marketing",
      description: "Keyword strategy, local SEO, technical audits, and content systems built to grow the right traffic."
    },
    {
      title: "Web Development",
      description: "Fast, conversion-ready websites that make your brand feel sharper and easier to trust."
    },
    {
      title: "Email Marketing",
      description: "Lifecycle campaigns and nurturing flows that keep your leads warm long after the first click."
    }
  ];

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className="container">
          <div className={styles.navInner}>
            <a className={styles.brand} href="#home" aria-label="Revibe home">
              <span>Revibe</span>
            </a>

            <nav className={styles.navLinks} aria-label="Section navigation">
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero} id="home">
          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <div className={styles.eyebrow}>Toronto SEO and digital growth studio</div>
                <h1 className={styles.heroTitle}>
                  Brand
                  <br />
                  momentum
                  <br />
                  <span className={styles.heroTitleAccent}>for search.</span>
                </h1>
                <p className={styles.heroText}>
                  Revibe helps service businesses get found, look sharper online, and convert more of the traffic they already
                  deserve. The aesthetic follows your mockup, but the layout is tuned to feel more modern and intentional.
                </p>
                <div className={styles.heroActions}>
                  <a className={styles.primaryButton} href="#contact">
                    Get in touch
                  </a>
                  <a className={styles.secondaryButton} href="#pricing">
                    View pricing
                  </a>
                </div>
              </div>

              <div className={styles.heroMeta}>
                <div className={styles.heroCard}>
                  <p className={styles.heroCardLabel}>SEO agency</p>
                  <h2 className={styles.heroCardTitle}>Company Name</h2>
                  <p className={styles.heroServices}>
                    SEO specialization
                    <br />
                    Web design
                    <br />
                    Digital marketing
                  </p>
                </div>

                <p className={styles.heroLocation}>Based in Toronto</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="about">
          <div className="container">
            <h2 className={styles.sectionHeading}>About us</h2>
            <p className={styles.sectionLead}>
              We build SEO systems that do more than chase rankings. The goal is steady demand, clearer messaging, and a site
              experience that makes people want to reach out.
            </p>

            <div className={styles.aboutGrid}>
              <div className={`${styles.aboutCard} ${styles.aboutCopy}`}>
                <p>
                  Revibe is built for businesses that want a lean, strategic partner instead of a bloated agency process. We
                  combine organic search strategy, conversion-minded design, and practical campaign support so your marketing
                  actually moves together.
                </p>
                <a className={styles.smallButton} href="#contact">
                  Meet the team
                </a>
              </div>

              <div className={styles.aboutVisual} aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className={styles.servicesWrap} id="services">
          <div className="container">
            <div className={styles.servicesHeader}>
              <h2 className={styles.servicesTitle}>
                <span className={styles.servicesTitleAccent}>Specialized SEO marketing</span>
                <br />
                Web development
                <br />
                Email marketing
              </h2>
              <a className={styles.secondaryButton} href="#contact">
                Get in touch
              </a>
            </div>

            <div className={styles.serviceList}>
              {services.map((service) => (
                <article className={styles.serviceItem} key={service.title}>
                  <strong>{service.title}</strong>
                  <span>{service.description}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} id="pricing">
          <div className="container">
            <div className={styles.pricingHeader}>
              <div>
                <h2 className={styles.sectionHeading}>Pricing</h2>
                <p className={styles.sectionLead}>
                  I kept this flexible on purpose so you can refine packaging later, but the layout is ready for real offers.
                </p>
              </div>
            </div>

            <div className={styles.pricingGrid}>
              {pricingTiers.map((tier) => (
                <article className={styles.pricingCard} key={tier.name}>
                  <div>
                    <p className={styles.pricingLabel}>Package</p>
                    <h3 className={styles.pricingTier}>{tier.name}</h3>
                  </div>

                  <p className={styles.pricingDescription}>{tier.description}</p>

                  <p className={styles.price}>
                    {tier.price}
                    <span>/mo</span>
                  </p>

                  <div className={styles.featureList}>
                    {tier.features.map((feature) => (
                      <p className={styles.featureItem} key={feature}>
                        <span className={styles.featureDot}>✓</span>
                        {feature}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} id="contact">
          <div className="container">
            <div className={styles.contactGrid}>
              <aside className={styles.contactDetails}>
                <div>
                  <p className={styles.pricingLabel}>Contact</p>
                  <h3>Looking to Revibe?</h3>
                </div>

                <p className={styles.sectionLead}>
                  Tell us a bit about your business, what you want to grow, and where the current friction is.
                </p>

                <div className={styles.contactMeta}>
                  <p>Email: hello@revibe.ca</p>
                  <p>Instagram: @revibe.studio</p>
                  <p>LinkedIn: Revibe Studio</p>
                </div>
              </aside>

              <div className={styles.contactPanel}>
                <div className={styles.contactPanelHeader}>
                  <div>
                    <p className={styles.pricingLabel}>Get in touch</p>
                    <p>
                      This form works without a backend. Add a hosted form endpoint later and it will send directly through your
                      email service.
                    </p>
                  </div>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <p>Revibe Studio</p>
            <p>SEO, web design, and digital marketing for growth-focused brands.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
