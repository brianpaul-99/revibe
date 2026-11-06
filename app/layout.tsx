import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';

const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });

const SITE = 'https://www.revibe-labs.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Revibe | SEO, Websites and Outbound Lead Generation, Toronto',
  description:
    'Revibe is a two-person Toronto studio running SEO, website builds and management, and outbound lead generation for service businesses. One team, one pipeline, no account managers.',
  alternates: { canonical: '/' },
  icons: { icon: '/assets/skull.svg' },
  openGraph: {
    type: 'website',
    url: SITE,
    title: 'Revibe | Make the phone ring',
    description:
      'SEO that gets you found, websites that get you chosen, outbound that books the meeting. A lean Toronto studio for service businesses.',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#1C1917', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE}/#studio`,
  name: 'Revibe',
  alternateName: 'Revibe Labs',
  url: `${SITE}/`,
  logo: `${SITE}/assets/skull.svg`,
  slogan: 'Brand momentum for search.',
  description: 'SEO, website builds and management, and outbound lead generation for service businesses.',
  address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressRegion: 'ON', addressCountry: 'CA' },
  areaServed: ['Toronto', 'Greater Toronto Area', 'Canada', 'United States'],
  founder: [
    { '@type': 'Person', name: 'Timothy Limpin', jobTitle: 'Co-founder and CEO' },
    { '@type': 'Person', name: 'Brian Paul', jobTitle: 'Co-founder and CTO' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: [
      'Search engine optimization',
      'Website design, development and management',
      'Outbound lead generation and cold outreach',
    ].map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // the inline script adds `js` before paint so reveal states never flash; React is told to expect it
    <html lang="en" className={`${bebas.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script
          id="mcjs"
          dangerouslySetInnerHTML={{
            __html:
              '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/6deb180605f5cf7299cf390c1/63ab1868d22ece9f27a67ba95.js");',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
