/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['local.poke-korea.com'],
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // 메인 페이지 - 기본 캐싱
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=0, s-maxage=86400, stale-while-revalidate=600',
          },
        ],
      },
      {
        // 리스트 페이지 - 장기간 캐싱 (필터는 클라이언트에서 처리)
        source: '/list',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 상세 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 상세 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 상세 페이지 - 장기간 캐싱
        source: '/moves',
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
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    // 브라우저 타겟을 ES2022로 설정하여 불필요한 폴리필 제거
    if (!isServer) {
      config.target = ['web', 'es2022']

      // CSS 파일 분리 설정
      if (process.env.NODE_ENV === 'production') {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            ...config.optimization.splitChunks,
            cacheGroups: {
              ...config.optimization.splitChunks?.cacheGroups,
              // Swiper CSS 분리
              swiperStyles: {
                name: 'swiper',
                test: /[\\/]node_modules[\\/]swiper[\\/].*\.css$/,
                chunks: 'all',
                enforce: true,
                priority: 30,
              },
              // Global CSS 분리
              globalStyles: {
                name: 'global',
                test: /[\\/]src[\\/]styles[\\/]globals\.css$/,
                chunks: 'all',
                enforce: true,
                priority: 25,
              },
              // 기타 CSS 파일들
              styles: {
                name: 'styles',
                test: /\.css$/,
                chunks: 'all',
                enforce: true,
                priority: 20,
              },
            },
          },
        }

        const originalEntry = config.entry
        config.entry = async () => {
          const entries = await originalEntry()

          // 빌드에 포함할 CSS 파일
          const criticalCssFiles = [
            './src/styles/globals.css',
            'swiper/css',
            'swiper/css/navigation',
          ]

          // App Router의 layout 진입점 찾기
          const targetLayoutKey = 'pages/_app'

          Object.keys(entries).forEach((entryKey) => {
            if (
              entryKey.endsWith(targetLayoutKey) &&
              Array.isArray(entries[entryKey])
            ) {
              criticalCssFiles.forEach((cssFile) => {
                if (!entries[entryKey].includes(cssFile)) {
                  entries[entryKey].unshift(cssFile)
                }
              })
            }
          })

          return entries
        }
      }
    }

    return config
  },
}

module.exports = nextConfig
