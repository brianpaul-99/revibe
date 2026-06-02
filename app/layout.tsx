import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revibe | SEO, Web Design, and Digital Growth",
  description: "Revibe is a Toronto-based studio for SEO, web design, and digital marketing that turns visibility into qualified leads."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          id="mcjs"
          dangerouslySetInnerHTML={{
            __html:
              '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/6deb180605f5cf7299cf390c1/63ab1868d22ece9f27a67ba95.js");'
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
