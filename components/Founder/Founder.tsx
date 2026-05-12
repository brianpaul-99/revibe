import styles from './Founder.module.css';

type BarCls = 'b1'|'b2'|'b3'|'b4'|'b5'|'b6'|'b7'|'b8'|'b9'|'g1'|'g2'|'g3'|'g4';

const BARS: { type: 'bar' | 'gap'; cls: BarCls }[] = [
  { type: 'bar', cls: 'b1' },
  { type: 'gap', cls: 'g1' },
  { type: 'bar', cls: 'b2' },
  { type: 'bar', cls: 'b3' },
  { type: 'gap', cls: 'g2' },
  { type: 'bar', cls: 'b4' },
  { type: 'gap', cls: 'g3' },
  { type: 'bar', cls: 'b5' },
  { type: 'bar', cls: 'b6' },
  { type: 'bar', cls: 'b7' },
  { type: 'gap', cls: 'g4' },
  { type: 'bar', cls: 'b8' },
  { type: 'bar', cls: 'b9' },
];

export default function Founder() {
  return (
    <section id="founder" className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.barsCol} aria-hidden="true">
          {BARS.map((b, i) => (
            <div
              key={i}
              className={`${b.type === 'bar' ? styles.bar : styles.barGap} ${styles[b.cls]}`}
            />
          ))}
        </div>

        <div className={styles.right}>
          <blockquote className={styles.pullquote}>
            <span className={styles.hl}>&ldquo;</span>The work either{' '}
            <span className={styles.hl}>moves the needle</span> or{' '}
            <span className={styles.hl}>it doesn&apos;t.</span> Everything else is a
            report.<span className={styles.hl}>&rdquo;</span>
          </blockquote>
          <p className={styles.body}>
            Revibe is a two-person studio. We build SEO systems, fix the digital
            infrastructure, and do the web work for service businesses that are actually
            good at what they do and just need the search presence to prove it. No account
            managers. No layers between you and the people building. You get the work, not
            the process around it.
          </p>
          <div className={styles.attribution}>
            <div className={styles.person}>
              <div className={styles.name}>Timothy Limpin</div>
              <div className={styles.title}>Co-Founder & CEO</div>
            </div>
            <div className={styles.person}>
              <div className={styles.name}>Brian Paul</div>
              <div className={styles.title}>Co-Founder & CTO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
