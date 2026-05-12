'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

const FAQS = [
  {
    q: 'What types of clients do you typically work with?',
    a: "Mostly e-commerce brands, local businesses that want to compete above their weight, and growth-stage companies that have outgrown their current marketing setup. We do our best work with teams that have a clear product and need someone to build the demand engine around it. If you're still figuring out what you're selling, that's a different conversation.",
  },
  {
    q: 'How long does a typical project take from start to finish?',
    a: 'Depends on the scope. A single landing page refresh takes two to three weeks. A full brand identity with site build typically runs six to ten weeks. Retainer work starts with a 30-day onboarding phase where we run discovery, set baselines, and launch the first campaign. No padded timeline. We move when you move.',
  },
  {
    q: 'Do you offer ongoing retainer packages or project-based work?',
    a: 'Both. Our retainer packages (Starter at $1k/mo, Growth at $1.5k/mo, Authority at $2.5k/mo) are designed for brands that want a long-term partner rather than one-off deliverables. For discrete scopes (a rebrand, a campaign build, a site launch), we price project-based. Either way, no account managers between you and the work.',
  },
  {
    q: 'What does your onboarding process look like for new clients?',
    a: "Week one is a full discovery call where we map your brand, audience, and goals. From there we deliver a competitive audit and a prioritized roadmap before any creative begins. You'll know exactly what we're building and why before a single pixel gets moved. We don't start execution until we're aligned.",
  },
  {
    q: 'How do you measure success across campaigns?',
    a: "We track against real business outcomes: qualified leads, ROAS, organic traffic growth, conversion rates. Not vanity metrics. Every client gets monthly reporting with clear before/after numbers and recommendations. We've averaged 5x ROAS across e-commerce clients. That's the bar we hold ourselves to.",
  },
  {
    q: 'Can you work with an existing brand or do you require a full rebrand?',
    a: "We work with existing brands all the time. Not every client needs to start from scratch. Some just need the positioning sharpened, the site tightened, or the campaign layer built on top of what's already there. If we think something in your current brand is holding back performance, we'll say so. But we're not going to push a rebrand you don't need.",
  },
  {
    q: 'What is your minimum project budget?',
    a: "Our Starter retainer starts at $1,000/month. For one-off projects, the minimum is typically $2,500. If you're below that, we're probably not the right fit right now. We'd rather be straight with you than waste both our time.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.leftCol}>
          <h2 className={styles.headline}>FAQ</h2>
          <p className={styles.tagline}>
            Things people usually want to know before reaching out.
          </p>
          <a className={styles.cta} href="#contact">
            → Ask A Question
          </a>
        </div>

        <div className={styles.rows}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`${styles.item} ${openIndex === i ? styles.open : ''}`}
            >
              <button
                className={styles.row}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span className={styles.question}>{faq.q}</span>
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
              </button>
              <div
                className={styles.answer}
                aria-hidden={openIndex !== i}
              >
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
