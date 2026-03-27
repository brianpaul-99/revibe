# Revibe

Marketing site for Revibe built with Next.js, React, and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contact form setup

The contact section works without a backend.

- If `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` is not set, the form falls back to the default mail app.
- If you connect a hosted form provider like Formspree, set the endpoint in `.env.local`.

Start from [.env.example](./.env.example):

```bash
NEXT_PUBLIC_CONTACT_EMAIL=hello@revibe.ca
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=
```
