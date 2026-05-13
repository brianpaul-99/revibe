'use client';

import { useState } from 'react';
import styles from './Contact.module.css';

const SERVICE_TAGS = ['Website', 'App', 'Branding', 'Design', 'Strategy', 'Content'];
const BUDGET_TAGS = ['$5k–10k', '$10k–25k', '$25k–50k', '$50k–100k', '$100k+'];
const SOURCE_TAGS = ['Google', 'Instagram', 'LinkedIn', 'Referral', 'Podcast', 'Other'];

function TagGroup({
  tags,
  selected,
  onToggle,
}: {
  tags: string[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
}) {
  return (
    <div className={styles.tagGroup}>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className={`${styles.tag} ${selected.has(tag) ? styles.tagActive : ''}`}
          onClick={() => onToggle(tag)}
          aria-pressed={selected.has(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default function Contact() {
  const [services, setServices] = useState<Set<string>>(new Set());
  const [budgets, setBudgets] = useState<Set<string>>(new Set());
  const [sources, setSources] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, tag: string) => {
    const next = new Set(set);
    next.has(tag) ? next.delete(tag) : next.add(tag);
    setter(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get('name') || '').trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || fullName || 'Website';
    const lastName = nameParts.slice(1).join(' ') || 'Inquiry';
    const message = [
      String(data.get('message') || '').trim(),
      '',
      services.size ? `Services: ${[...services].join(', ')}` : '',
      budgets.size ? `Budget: ${[...budgets].join(', ')}` : '',
      sources.size ? `Source: ${[...sources].join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: String(data.get('email') || '').trim(),
          phone: '',
          company: '',
          message,
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || 'The form service rejected the request.');
      }

      setStatus('success');
      setServices(new Set());
      setBudgets(new Set());
      setSources(new Set());
      form.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong while sending your message.'
      );
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.leftCol}>
          <h2 className={styles.headline}>
            Let&apos;s Build
            <br />
            Something
            <br />
            Great
          </h2>
          <p className={styles.sub}>
            Tell us about your project and we&apos;ll get back to you within 24 hours. No
            account managers. Just the people doing the work.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label} htmlFor="contact-name">
            Full Name
          </label>
          <input
            id="contact-name"
            name="name"
            className={styles.input}
            type="text"
            placeholder="Your name"
            required
          />

          <label className={styles.label} htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            className={styles.input}
            type="email"
            placeholder="your@email.com"
            required
          />

          <label className={styles.label} htmlFor="contact-message">
            Tell us about your project
          </label>
          <textarea
            id="contact-message"
            name="message"
            className={styles.textarea}
            placeholder="What are you building?"
            required
          />

          <span className={styles.tagSectionLabel}>How Can We Help You?</span>
          <TagGroup
            tags={SERVICE_TAGS}
            selected={services}
            onToggle={(t) => toggle(services, setServices, t)}
          />

          <span className={styles.tagSectionLabel}>What Is Your Budget?</span>
          <TagGroup
            tags={BUDGET_TAGS}
            selected={budgets}
            onToggle={(t) => toggle(budgets, setBudgets, t)}
          />

          <span className={styles.tagSectionLabel}>Where Did You Hear About Us?</span>
          <TagGroup
            tags={SOURCE_TAGS}
            selected={sources}
            onToggle={(t) => toggle(sources, setSources, t)}
          />

          <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : '→ Send Message'}
          </button>

          <p className={styles.formNote}>
            The form submits to this app&apos;s backend route. No contact email is exposed in the client.
          </p>
          {status === 'success' ? (
            <p className={styles.formSuccess}>Thanks. Your message is on its way.</p>
          ) : null}
          {status === 'error' ? <p className={styles.formError}>{errorMessage}</p> : null}
        </form>
      </div>
    </section>
  );
}
