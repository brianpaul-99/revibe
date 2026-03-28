# Revibe

Marketing site for Revibe built with Next.js, React, and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contact form setup

The contact section now posts to an in-project Next.js API route at `/api/contact`.

- If `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` are configured, the backend sends email through Resend.
- If those server env vars are missing, the form will return a server-side configuration error instead of exposing an email address in the client.

Start from [.env.example](./.env.example):

```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=Revibe Contact <onboarding@resend.dev>
```

## Vercel setup

Add these environment variables in your Vercel project settings:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
