import { Metadata } from 'next'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

export const HOME_META: Metadata = {
  title: '빠르고 정확한 포켓몬 도감 - 포케코리아',
  description:
    '1025마리 포켓몬 도감, 타입 상성 계산기, 800개 이상 기술 정보, 300개 이상 특성 정보, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.',
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/`,
    title: '빠르고 정확한 포켓몬 도감 - 포케코리아',
    locale: 'ko_KR',
    description:
      '1025마리 포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: '빠르고 정확한 포켓몬 도감 - 포케코리아',
        type: 'image/png',
      },
    ],
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  twitter: {
    card: 'summary_large_image',
    title: '빠르고 정확한 포켓몬 도감 - 포케코리아',
    description:
      '1025마리 포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.',
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}
