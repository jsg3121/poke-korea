const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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
      // 챔피언스 포맷 분리 (Phase 1) — 기존 URL을 더블(기본) 포맷으로 리다이렉트
      {
        source: '/champions',
        destination: '/champions/double',
        permanent: true,
      },
      // 챔피언스 리스트 포맷 분리 (Phase 2) — 기존 URL을 더블(기본) 포맷으로 리다이렉트
      {
        source: '/champions/list',
        destination: '/champions/double/list',
        permanent: true,
      },
      // 챔피언스 티어 포맷 분리 (Phase 3) — 기존 URL을 VGC 기본으로 리다이렉트
      {
        source: '/champions/tier',
        destination: '/champions/double/tier',
        permanent: true,
      },
      // 챔피언스 상세 포맷 분리 (Phase 4) — 기존 URL을 더블(기본) 포맷으로 리다이렉트
      {
        source: '/champions/list/:pokemonId',
        destination: '/champions/double/list/:pokemonId',
        permanent: true,
      },
      // 포맷 슬러그 변경 (vgc/bss → double/single). 기존 색인 URL을 301로 보존한다.
      // :path* 로 하위 경로(/list, /tier, /list/:id/... )까지 전부 매핑한다.
      {
        source: '/champions/vgc/:path*',
        destination: '/champions/double/:path*',
        permanent: true,
      },
      {
        source: '/champions/bss/:path*',
        destination: '/champions/single/:path*',
        permanent: true,
      },
      // 하위 경로 없는 포맷 홈(/champions/vgc, /champions/bss) 자체도 매핑
      {
        source: '/champions/vgc',
        destination: '/champions/double',
        permanent: true,
      },
      {
        source: '/champions/bss',
        destination: '/champions/single',
        permanent: true,
      },
    ]
  },
  async headers() {
    // 페이지 HTML의 s-maxage 상한은 1일(86400)로 통일한다.
    //
    // 도감 데이터 자체는 배포 전까지 바뀌지 않지만, 캐싱 대상은 데이터가 아니라
    // HTML 문서다. HTML에는 배포마다 해시가 바뀌는 JS 청크 파일명이 박혀 있어,
    // CDN이 옛 HTML을 들고 있으면 참조하는 청크가 404가 되고 hydration이 실패해
    // 페이지 전체가 클릭 불가 상태가 된다(1.58.2 배포 장애).
    //
    // 즉 캐시 수명을 결정하는 건 콘텐츠 갱신 주기가 아니라 배포 주기다.
    // 이전 값이던 1년(31536000)은 무효화가 한 번이라도 실패하면 자연 복구
    // 경로가 없어, 누군가 장애를 발견하고 수동 개입할 때까지 방치된다.
    // 배포 시 무효화는 deploy.sh가 자동 수행하므로 이 값은 그것이 실패했을
    // 때만 쓰이는 안전망이다. 안전망은 짧을수록 좋다.
    //
    // stale-while-revalidate는 붙이지 않는다. CloudFront가 이 지시자를
    // 지원하지 않고(엣지의 stale 서빙은 Error Caching Minimum TTL 기반의
    // 오류 응답에 한정), 브라우저 쪽은 max-age가 이미 커버한다.
    return [
      {
        // 메인 페이지 - 기본 캐싱
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400',
          },
        ],
      },
      {
        // 리스트 페이지 - 장기간 캐싱 (필터는 클라이언트에서 처리)
        source: '/list',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 상세 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 메가진화 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/mega',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 메가진화 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/mega/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 리전폼 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/region',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 리전폼 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/region/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 기본폼 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/form',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 기본폼 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/form/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 리전폼 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/region',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 리전폼 기술 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/moves/region/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 기본폼 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/form',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 기본폼 기술 페이지 (인덱스) - 장기간 캐싱
        source: '/detail/:pokemonId/moves/form/:formIndex',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 머신 습득 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/machine',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 버전별 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/version/:versionGroupId',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 버전별 머신 기술 페이지 - 장기간 캐싱
        source: '/detail/:pokemonId/moves/version/:versionGroupId/machine',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
          },
        ],
      },
      {
        // 기술 도감 페이지 - 장기간 캐싱
        source: '/moves',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
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
        // 파비콘 - 브라우저 1일 / CloudFront 1년 캐싱
        // URL에 해시가 없는 고정 경로라 immutable은 붙이지 않는다.
        // 브라우저가 하루마다 재검증할 여지를 남겨야 교체분이 반영된다.
        // CloudFront는 /favicon.ico 전용 동작으로 분리돼 있으며,
        // 파비콘 교체 시 해당 경로를 수동 무효화한다.
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=31536000',
          },
        ],
      },
      {
        // 타입 상성 계산기 - CDN 장기 캐싱 + 브라우저 단기 캐싱
        source: '/type-effectiveness',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800, s-maxage=86400',
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

module.exports = withBundleAnalyzer(nextConfig)
