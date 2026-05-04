/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['local.poke-korea.com'],
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async redirects() {
    return [
      // 기존 쿼리 파라미터 URL → 새 Path URL (메가진화)
      {
        source: '/detail/:pokemonId',
        has: [
          { type: 'query', key: 'activeType', value: 'mega' },
          { type: 'query', key: 'activeIndex' },
        ],
        destination: '/detail/:pokemonId/mega/:activeIndex',
        permanent: true,
      },
      {
        source: '/detail/:pokemonId',
        has: [{ type: 'query', key: 'activeType', value: 'mega' }],
        missing: [{ type: 'query', key: 'activeIndex' }],
        destination: '/detail/:pokemonId/mega',
        permanent: true,
      },
      // 기존 쿼리 파라미터 URL → 새 Path URL (리전폼)
      {
        source: '/detail/:pokemonId',
        has: [
          { type: 'query', key: 'activeType', value: 'region' },
          { type: 'query', key: 'activeIndex' },
        ],
        destination: '/detail/:pokemonId/region/:activeIndex',
        permanent: true,
      },
      {
        source: '/detail/:pokemonId',
        has: [{ type: 'query', key: 'activeType', value: 'region' }],
        missing: [{ type: 'query', key: 'activeIndex' }],
        destination: '/detail/:pokemonId/region',
        permanent: true,
      },
      // 기존 쿼리 파라미터 URL → 새 Path URL (기술 페이지 리전폼)
      {
        source: '/detail/:pokemonId/moves',
        has: [
          { type: 'query', key: 'activeType', value: 'region' },
          { type: 'query', key: 'activeIndex' },
        ],
        destination: '/detail/:pokemonId/moves/region/:activeIndex',
        permanent: true,
      },
      {
        source: '/detail/:pokemonId/moves',
        has: [{ type: 'query', key: 'activeType', value: 'region' }],
        missing: [{ type: 'query', key: 'activeIndex' }],
        destination: '/detail/:pokemonId/moves/region',
        permanent: true,
      },
      // 기존 쿼리 파라미터 URL → 새 Path URL (기본폼 - normalForm)
      {
        source: '/detail/:pokemonId',
        has: [{ type: 'query', key: 'activeIndex' }],
        missing: [{ type: 'query', key: 'activeType' }],
        destination: '/detail/:pokemonId/form/:activeIndex',
        permanent: true,
      },
      // 기존 쿼리 파라미터 URL → 새 Path URL (기술 페이지 기본폼 - normalForm)
      {
        source: '/detail/:pokemonId/moves',
        has: [{ type: 'query', key: 'activeIndex' }],
        missing: [{ type: 'query', key: 'activeType' }],
        destination: '/detail/:pokemonId/moves/form/:activeIndex',
        permanent: true,
      },
      // 기존 세대별 기술 URL → 버전별 기술 URL 리다이렉트
      {
        source: '/moves/:id/generation/:generationId',
        destination: '/moves/:id',
        permanent: true,
      },
      // 기존 쿼리 파라미터 URL → 새 Path URL (기술 페이지 버전 선택 + MACHINE)
      {
        source: '/detail/:pokemonId/moves',
        has: [
          { type: 'query', key: 'selectVersion' },
          { type: 'query', key: 'movesType', value: 'MACHINE' },
        ],
        destination: '/detail/:pokemonId/moves/version/:selectVersion/machine',
        permanent: true,
      },
      // 기존 쿼리 파라미터 URL → 새 Path URL (기술 페이지 버전 선택)
      {
        source: '/detail/:pokemonId/moves',
        has: [{ type: 'query', key: 'selectVersion' }],
        missing: [{ type: 'query', key: 'movesType' }],
        destination: '/detail/:pokemonId/moves/version/:selectVersion',
        permanent: true,
      },
      // 기존 쿼리 파라미터 URL → 새 Path URL (기술 페이지 MACHINE만)
      {
        source: '/detail/:pokemonId/moves',
        has: [{ type: 'query', key: 'movesType', value: 'MACHINE' }],
        missing: [{ type: 'query', key: 'selectVersion' }],
        destination: '/detail/:pokemonId/moves/machine',
        permanent: true,
      },
    ]
  },
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
        // 메가진화 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/mega',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 메가진화 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/mega/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 리전폼 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/region',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 리전폼 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/region/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 기본폼 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/form',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 기본폼 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/form/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 리전폼 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/region',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 리전폼 기술 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/moves/region/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 기본폼 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/form',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 기본폼 기술 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/moves/form/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 머신 습득 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/machine',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 버전별 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/version/:versionGroupId',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 버전별 머신 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/version/:versionGroupId/machine',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
      {
        // 기술 도감 페이지 - 장기간 캐싱
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
          const criticalCssFiles = ['./src/styles/globals.css']

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
