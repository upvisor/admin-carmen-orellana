/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'iframe.mediadelivery.net',
          port: '',
          pathname: '/embed/**'
        }, {
          protocol: 'https',
          hostname: 'web-carmen-orellana.b-cdn.net',
          port: '',
          pathname: '/**'
        }, {
          protocol: 'https',
          hostname: 'web-carmen.b-cdn.net',
          port: '',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'images-upvisor.b-cdn.net',
          port: '',
          pathname: '/**'
        }
      ]
    }
  }

module.exports = nextConfig
