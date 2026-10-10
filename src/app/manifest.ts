import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '포케 코리아 - 포켓몬의 모든 정보',
    short_name: '포케 코리아',
    description:
      '한국어 포켓몬 도감과 타입 상성 계산기, 기술·특성 도구를 무료로 제공하는 포켓몬 백과사전.',
    start_url: '/',
    display: 'browser',
    background_color: '#27374D',
    theme_color: '#27374D',
    lang: 'ko',
    icons: [
      {
        src: '/assets/icons/app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/icons/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/assets/icons/app-icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
