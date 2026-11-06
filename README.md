# Revibe website (2026)

Next.js 16 (App Router) + React 19. One page, prerendered as static HTML, plus one server route for the contact form.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

- `app/page.tsx` is all the page markup. Copy edits happen here.
- `app/globals.css` holds the brand tokens (palette, Bebas Neue + Inter via `next/font`, motion timings) and every section's styles.
- `components/SiteMotion.tsx` is the only client component. It starts the two runtimes below and tears them down on unmount.
- `lib/fluid.ts` is the hero: a WebGL2 fluid sim printed through a halftone screen. Falls back to a static hero without WebGL2.
- `lib/motion.ts` covers scroll reveals, starbursts, the three service animations, the Truchet field, the FAQ, the form, and the 3D skull.
- `lib/skull3d.ts` is the faceted 3D skull, copied from `Branding/Motion/src/skull3d.js`.
- `lib/skullFrames.ts` is not used by the site, but is retained for compatibility with the existing branding build workflow.
- `public/brian-cartoon.png` and `public/timothy-cartoon.png` are the founder portraits shown in the studio section.
- `app/layout.tsx` retains the existing Mailchimp connected-site script alongside the site's metadata.

## Contact form

`app/api/contact/route.ts` emails each enquiry through [Resend](https://resend.com). Copy `.env.example` to `.env.local` (or set the same variables on your host):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (comma-separate to send to both founders)
- `CONTACT_FROM_EMAIL` (optional; a sender on a domain verified in Resend)

Without them the route answers 503 and the visitor sees "That didn't send", never a false success.
