import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revibe | SEO, Web Design, and Digital Growth",
  description: "Revibe is a Toronto-based studio for SEO, web design, and digital marketing that turns visibility into qualified leads."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
