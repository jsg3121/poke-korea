import { Metadata } from 'next'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

export const CHAMPIONS_META: Metadata = {
  title: '포켓몬 챔피언스 도감 | 포케코리아',
  description:
    '포켓몬 챔피언스 186종 도감, 티어 리스트, 메타 분석. 인기 포켓몬 사용률, 추천 기술/아이템/특성 정보를 확인하세요.',
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/champions`,
    title: '포켓몬 챔피언스 도감 | 포케코리아',
    locale: 'ko_KR',
    description:
      '포켓몬 챔피언스 186종 도감, 티어 리스트, 메타 분석. 인기 포켓몬 사용률, 추천 기술/아이템/특성 정보를 확인하세요.',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: '포켓몬 챔피언스 도감 | 포케코리아',
        type: 'image/png',
      },
    ],
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/champions`,
  },
  twitter: {
    card: 'summary_large_image',
    title: '포켓몬 챔피언스 도감 | 포케코리아',
    description:
      '포켓몬 챔피언스 186종 도감, 티어 리스트, 메타 분석. 인기 포켓몬 사용률, 추천 기술/아이템/특성 정보를 확인하세요.',
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

export const CHAMPIONS_POKEDEX_META: Metadata = {
  title: '포켓몬 챔피언스 포켓몬 목록 | 포케코리아',
  description:
    '포켓몬 챔피언스에 등장하는 186종 포켓몬 목록. 타입별 필터링, 스탯 정보, 특성 정보를 확인하세요.',
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/champions/list`,
    title: '포켓몬 챔피언스 포켓몬 목록 | 포케코리아',
    locale: 'ko_KR',
    description:
      '포켓몬 챔피언스에 등장하는 186종 포켓몬 목록. 타입별 필터링, 스탯 정보, 특성 정보를 확인하세요.',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: '포켓몬 챔피언스 포켓몬 목록 | 포케코리아',
        type: 'image/png',
      },
    ],
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/champions/list`,
  },
  twitter: {
    card: 'summary_large_image',
    title: '포켓몬 챔피언스 포켓몬 목록 | 포케코리아',
    description:
      '포켓몬 챔피언스에 등장하는 186종 포켓몬 목록. 타입별 필터링, 스탯 정보, 특성 정보를 확인하세요.',
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

export const CHAMPIONS_TIER_META: Metadata = {
  title: '포켓몬 챔피언스 티어 리스트 | 포케코리아',
  description:
    '포켓몬 챔피언스 티어 리스트. S/A/B/C/D 티어별 포켓몬 사용률과 메타 분석을 확인하세요.',
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/champions/tier`,
    title: '포켓몬 챔피언스 티어 리스트 | 포케코리아',
    locale: 'ko_KR',
    description:
      '포켓몬 챔피언스 티어 리스트. S/A/B/C/D 티어별 포켓몬 사용률과 메타 분석을 확인하세요.',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: '포켓몬 챔피언스 티어 리스트 | 포케코리아',
        type: 'image/png',
      },
    ],
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/champions/tier`,
  },
  twitter: {
    card: 'summary_large_image',
    title: '포켓몬 챔피언스 티어 리스트 | 포케코리아',
    description:
      '포켓몬 챔피언스 티어 리스트. S/A/B/C/D 티어별 포켓몬 사용률과 메타 분석을 확인하세요.',
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
