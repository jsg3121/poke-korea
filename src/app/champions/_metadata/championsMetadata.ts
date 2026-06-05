import { Metadata } from 'next'
import { GetChampionsPokemonListDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import {
  CHAMPIONS_DEFAULT_FORMAT_SLUG,
  ChampionsFormatSlug,
  getFormatDescription,
  getFormatShortLabel,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

const fetchChampionsTotalCount = async (
  formatSlug: ChampionsFormatSlug = CHAMPIONS_DEFAULT_FORMAT_SLUG,
): Promise<number> => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetChampionsPokemonListQuery,
    GetChampionsPokemonListQueryVariables
  >({
    query: GetChampionsPokemonListDocument,
    variables: {
      input: {
        format: resolveFormatEnum(formatSlug),
        pagination: { first: 1 },
      },
    },
  })

  return data?.getChampionsPokemonList?.totalCount || 0
}

export const generateChampionsHomeMetadata = async (
  formatSlug: ChampionsFormatSlug = CHAMPIONS_DEFAULT_FORMAT_SLUG,
): Promise<Metadata> => {
  const totalCount = await fetchChampionsTotalCount(formatSlug)
  const formatShort = getFormatShortLabel(formatSlug)
  const formatDesc = getFormatDescription(formatSlug)

  const title = `포켓몬 챔피언스 ${formatShort} 도감 | 포케코리아`
  const description = `${formatDesc} 메타 분석. ${totalCount}종 포켓몬 사용률, 추천 기술/아이템/특성, 인기 팀 조합 정보를 확인하세요.`
  const url = `${SITE_URL}/champions/${formatSlug}`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
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

export const generateChampionsPokedexMetadata = async (
  formatSlug: ChampionsFormatSlug = CHAMPIONS_DEFAULT_FORMAT_SLUG,
): Promise<Metadata> => {
  const totalCount = await fetchChampionsTotalCount(formatSlug)
  const formatShort = getFormatShortLabel(formatSlug)

  const title = `포켓몬 챔피언스 ${formatShort} 포켓몬 목록 | 포케코리아`
  const description = `포켓몬 챔피언스 ${formatShort}에 등장하는 ${totalCount}종 포켓몬 목록. 타입별 필터링, 스탯 정보, 특성 정보를 확인하세요.`
  const url = `${SITE_URL}/champions/${formatSlug}/list`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
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

export const generateChampionsTierMetadata = async (
  formatSlug: ChampionsFormatSlug = CHAMPIONS_DEFAULT_FORMAT_SLUG,
): Promise<Metadata> => {
  const totalCount = await fetchChampionsTotalCount(formatSlug)
  const formatShort = getFormatShortLabel(formatSlug)

  const title = `포켓몬 챔피언스 ${formatShort} 티어 리스트 | 포케코리아`
  const description = `포켓몬 챔피언스 ${formatShort} 티어 리스트. ${totalCount}종 포켓몬의 S/A/B/C/D 티어별 사용률과 메타 분석을 확인하세요.`
  const url = `${SITE_URL}/champions/${formatSlug}/tier`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
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
