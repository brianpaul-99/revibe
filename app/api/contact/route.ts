import { NextResponse } from 'next/server';

/*
  Contact form handler. Sends the enquiry by email through Resend (https://resend.com) using its REST API,
  so there is no extra dependency. Needs, in .env.local or your host's env settings:
    RESEND_API_KEY      your Resend API key
    CONTACT_TO_EMAIL    where enquiries go (comma-separate for both founders)
    CONTACT_FROM_EMAIL  optional, a sender on a domain you verified in Resend, e.g. "Revibe site <site@revibe-labs.com>"
  Without the first two it answers 503, and the form tells the visitor it didn't send.
*/

const LIMITS: Record<string, number> = { name: 120, email: 200, website: 300, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  // spam trap: a hidden field people never fill in. Pretend it worked so bots move on.
  if (String(form.get('company_url') ?? '').trim()) return NextResponse.json({ ok: true });

  const field = (k: string) => String(form.get(k) ?? '').trim().slice(0, LIMITS[k] ?? 200);
  const name = field('name');
  const email = field('email');
  const website = field('website');
  const message = field('message');
  const budget = field('budget');
  const needs = form.getAll('need').map(v => String(v).slice(0, 60)).slice(0, 10);

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Name and a valid email are required' }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.warn('[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set; enquiry not sent');
    return NextResponse.json({ error: 'Contact form is not configured' }, { status: 503 });
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Website: ${website || 'none given'}`,
    `Needs: ${needs.length ? needs.join(', ') : 'not specified'}`,
    `Budget: ${budget || 'not specified'}`,
    '',
    message || '(no message)',
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'Revibe site <onboarding@resend.dev>',
      to: to.split(',').map(s => s.trim()).filter(Boolean),
      reply_to: email,
      subject: `New enquiry: ${name}${needs.length ? ` (${needs.join(', ')})` : ''}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error('[contact] Resend error', res.status, await res.text().catch(() => ''));
    return NextResponse.json({ error: 'Send failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
