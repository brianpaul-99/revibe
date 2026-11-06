/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // a stray package-lock.json in the home folder confuses root detection
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
