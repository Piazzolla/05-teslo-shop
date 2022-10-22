/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 100,
  experimental: {
    modularizeImports: {
      // '@mui/material/?(((\\w*)?/?)*)': {
      //   transform: '@mui/material/{{ matches.[1] }}/{{member}}'
      // },
      '@mui/icons-material/?(((\\w*)?/?)*)': {
        transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}'
      }
    }
  },
}

module.exports = nextConfig
