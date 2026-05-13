import styles from './Process.module.css';

const STEPS = [
  {
    num: '01',
    title: 'Discovery & Strategy',
    desc: 'Deep dive into your brand, audience, and goals. We map the competitive landscape and define KPIs before any creative begins.',
  },
  {
    num: '02',
    title: 'Creative Concepting',
    desc: 'Mood boards, creative territories, and concept decks. We present multiple directions before committing to execution.',
  },
  {
    num: '03',
    title: 'Content & Design',
    desc: 'Copywriting, visual design, motion, and production. Built to spec across every channel and deliverable.',
  },
  {
    num: '04',
    title: 'Launch & Activation',
    desc: 'Go-live coordination, QA, paid activation, and distribution across owned and earned channels.',
  },
  {
    num: '05',
    title: 'Analyze & Optimize',
    desc: 'Weekly reporting, A/B testing, and iterative improvement cycles. The work never stops after launch.',
  },
];

export default function Process() {
  return (
    <section id="process" className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.leftCol}>
          <h2 className={styles.headline}>
            Our
            <br />
            Process
          </h2>
          <p className={styles.sub}>
            A proven five-step framework that takes your idea from zero to launch — and
            beyond.
          </p>
          <a className={styles.ctaPill} href="#contact">
            → Schedule a consultation
          </a>
        </div>

        <ol className={styles.accordionList}>
          {STEPS.map((step) => (
            <li key={step.num} className={styles.accordionItem}>
              <div className={styles.accordionHeader}>
                <div className={styles.accNum} aria-hidden="true">
                  {step.num}
                </div>
                <div>
                  <div className={styles.accTitle}>{step.title}</div>
                  <div className={styles.accDesc}>{step.desc}</div>
                </div>
              </div>
              <span className={styles.accArrow} aria-hidden="true">
                ↗
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
