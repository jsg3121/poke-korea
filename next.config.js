/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    https: true,
    httpsKey: './local.poke-korea.com-key.pem',
    httpsCert: './local.poke-korea.com.pem',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [new URL('https://image.poke-korea.com/image/*')],
  },
  allowedDevOrigins: ['local.poke-korea.com'],
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // 메인 페이지 - 기본 캐싱 (필터는 클라이언트에서 처리)
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 상세 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        source: '/assets/:all*\\.(svg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // 타입 상성 계산기 - 장기간 캐싱
        source: '/type-effectiveness',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig
