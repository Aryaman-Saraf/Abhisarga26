/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Force the root to be the current project directory
    root: process.cwd(),
  },
}

export default nextConfig