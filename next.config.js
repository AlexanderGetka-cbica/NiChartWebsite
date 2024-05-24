/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'standalone',
  // Optional: Add a trailing slash to all paths `/about` -> `/about/`
  trailingSlash: true,
  // Optional: Change the output directory `out` -> `dist`
  distDir: 'dist',
  webpack(config) {
    config.experiments = {...config.experiments, topLevelAwait: true}
    return config;
  }
}
 
module.exports = nextConfig