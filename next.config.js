/** @type {import('next-pwa').PWAConfig} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextPWA = require('next-pwa');

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 다른 Next.js 설정들
};

module.exports = withPWA(nextConfig);
