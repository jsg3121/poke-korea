import { Metadata } from 'next'
import { GetChampionsPokemonListDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

const fetchChampionsTotalCount = async (): Promise<number> => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetChampionsPokemonListQuery,
    GetChampionsPokemonListQueryVariables
  >({
    query: GetChampionsPokemonListDocument,
    variables: {
      input: {
        pagination: { first: 1 },
      },
    },
  })

  return data?.getChampionsPokemonList?.totalCount || 0
}

export const generateChampionsHomeMetadata = async (): Promise<Metadata> => {
  const totalCount = await fetchChampionsTotalCount()

  const description = `포켓몬 챔피언스 ${totalCount}종 도감, 티어 리스트, 메타 분석. 인기 포켓몬 사용률, 추천 기술/아이템/특성 정보를 확인하세요.`

  return {
    title: '포켓몬 챔피언스 도감 | 포케코리아',
    description,
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/champions`,
      title: '포켓몬 챔피언스 도감 | 포케코리아',
      locale: 'ko_KR',
      description,
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
      description,
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
}

export const generateChampionsPokedexMetadata = async (): Promise<Metadata> => {
  const totalCount = await fetchChampionsTotalCount()

  const description = `포켓몬 챔피언스에 등장하는 ${totalCount}종 포켓몬 목록. 타입별 필터링, 스탯 정보, 특성 정보를 확인하세요.`

  return {
    title: '포켓몬 챔피언스 포켓몬 목록 | 포케코리아',
    description,
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/champions/list`,
      title: '포켓몬 챔피언스 포켓몬 목록 | 포케코리아',
      locale: 'ko_KR',
      description,
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
      description,
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
}

export const generateChampionsTierMetadata = async (): Promise<Metadata> => {
  const totalCount = await fetchChampionsTotalCount()

  const description = `포켓몬 챔피언스 티어 리스트. ${totalCount}종 포켓몬의 S/A/B/C/D 티어별 사용률과 메타 분석을 확인하세요.`

  return {
    title: '포켓몬 챔피언스 티어 리스트 | 포케코리아',
    description,
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/champions/tier`,
      title: '포켓몬 챔피언스 티어 리스트 | 포케코리아',
      locale: 'ko_KR',
      description,
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
      description,
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
}
