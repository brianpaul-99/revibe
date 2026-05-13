import styles from './About.module.css';

const STATS = [
  {
    num: '10+',
    name: 'Campaigns Launched',
    desc: 'Full-funnel campaigns from strategy to execution.',
  },
  {
    num: '50M+',
    name: 'Users Reached',
    desc: 'Across paid, organic, and earned channels combined.',
  },
  {
    num: '5x+',
    name: 'Average ROAS',
    desc: 'Median return across e-commerce client campaigns.',
  },
  {
    num: '98%',
    name: 'Client Retention Rate',
    desc: 'Clients who come once tend to stay for the long run.',
  },
];

export default function About() {
  return (
    <section id="stats" className={styles.section}>
      <span className={styles.sectionTag}>About</span>

      <div className={styles.layout}>
        <div className={styles.left}>
          <h2 className={styles.headline}>
            We Sell
            <br />
            Outcomes.
          </h2>
          <div className={styles.location}>
            <span className={styles.locLabel}>Based in</span>
            <span className={styles.locCity}>Toronto, ON</span>
            <span className={styles.locReach}>North America + Beyond</span>
          </div>
          <a className={styles.letsTalk} href="#contact">
            → Let&apos;s Talk
          </a>
        </div>
        <div className={styles.right}>
          <p className={styles.lead}>
            We&apos;re a lean digital studio based in Toronto, working with brands across
            North America and beyond.
          </p>
          <p className={styles.body}>
            Revibe was built around one idea: most agencies sell process. We sell
            outcomes. No account managers between you and the work. No bloated retainers
            covering overhead you never asked for. Just sharp strategy, clean execution,
            and numbers you can actually read.
          </p>
          <p className={styles.body}>
            Revibe was co-founded by Timothy Limpin and Brian Paul. The conviction behind
            it is simple: attention has to be earned. In a space crowded with studios
            chasing aesthetics over results, we build digital systems that drive real
            demand. Search, brand, content, paid media. Everything we do is connected and
            measured against what actually matters to your business.
          </p>
          <p className={styles.body}>
            Whether you&apos;re a growth-stage brand ready to scale or a local business
            that wants to compete above its weight, we&apos;re built to move with you.
            Toronto is home. Everywhere else is fair game.
          </p>
        </div>
      </div>

      <div className={styles.statGrid}>
        {STATS.map((s) => (
          <div key={s.name} className={styles.statCell}>
            <div className={styles.bigNum}>{s.num}</div>
            <div className={styles.statDivider} />
            <div className={styles.statName}>{s.name}</div>
            <div className={styles.statDesc}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
