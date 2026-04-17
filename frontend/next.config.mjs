/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@tankcheck/shared'],
};

export default nextConfig;
