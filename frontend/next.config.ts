/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    svgr: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    BASE_BACKEND_API_URL: process.env.BASE_BACKEND_API_URL,
  },
};

export default nextConfig;
