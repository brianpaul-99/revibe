import Image from 'next/image';
import styles from './Blog.module.css';

const POSTS = [
  {
    img: '/Article 1.png',
    alt: 'AI and brand strategy',
    date: 'May 2, 2026',
    title: "AI Won't Replace Your Brand Strategy. But It Will Expose If You Don't Have One.",
    excerpt:
      "Every brand now has access to the same AI tools. What separates the ones growing is a point of view the model can't generate for them.",
  },
  {
    img: '/Article 2.png',
    alt: 'Performance analytics overview',
    date: 'Apr 17, 2026',
    title: 'The Brands Winning in 2026 Stopped Chasing Viral',
    excerpt:
      "Consistent positioning and owned distribution are outperforming trend-chasing. Here's what a durable growth model looks like now.",
  },
  {
    img: '/Article 3.png',
    alt: 'Creative brief on a desk',
    date: 'Apr 1, 2026',
    title: 'Why the Best Creative Briefs Are Getting Shorter',
    excerpt:
      'Bloated briefs produce bloated work. The shift toward constraint-driven creative is producing some of the most distinctive brand work in years.',
  },
];

export default function Blog() {
  return (
    <section id="blog" className={styles.section}>
      <div className={styles.headlineRow}>
        <div>
          <h2 className={styles.headline}>Latest Insights</h2>
          <p className={styles.sub}>
            Perspectives on brand, growth, and the digital landscape.
          </p>
        </div>
        <a className={styles.checkMore} href="#">
          → Check Out More
        </a>
      </div>

      <div className={styles.grid}>
        {POSTS.map((post) => (
          <article key={post.title} className={styles.card}>
            <div className={styles.imgWrap}>
              <Image
                src={post.img}
                alt={post.alt}
                fill
                className={styles.img}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className={styles.imgGrid} aria-hidden="true" />
            </div>
            <div className={styles.body}>
              <div className={styles.date}>{post.date}</div>
              <h3 className={styles.title}>{post.title}</h3>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <a className={styles.readMore} href="#">
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
