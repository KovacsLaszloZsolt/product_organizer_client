// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const withTM = require('next-transpile-modules')([
//   '@mui/material',
//   '@mui/system'
//   '@mui/icons-material' // If @mui/icons-material is being used
// ]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mui/material', '@mui/icons-material'],
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com']
  },
  i18n
};

module.exports = nextConfig;
