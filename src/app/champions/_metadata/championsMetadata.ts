import { Metadata } from 'next'

import { OG_IMAGE_URL, SITE_NAME, SITE_URL } from '~/constants/seo.constant'
import { GetChampionsPokemonListDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables,
} from '~/graphql/typeGenerated'
import {
  CHAMPIONS_DEFAULT_FORMAT_SLUG,
  ChampionsFormatSlug,
  getFormatDescription,
  getFormatShortLabel,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import { initializeApollo } from '~/modules/apolloClient.module'

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

  const title = `포켓몬 챔피언스 ${formatShort} 도감`
  const description = `${formatDesc} 분석. ${totalCount}종 포켓몬 채택 순위와 티어, 인기 기술/도구/특성, 팀 조합 정보를 확인하세요.`
  const url = `${SITE_URL}/champions/${formatSlug}`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title: `${title} - 포케 코리아`,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${title} - 포케 코리아`,
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
      title: `${title} - 포케 코리아`,
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

  const title = `포켓몬 챔피언스 ${formatShort} 포켓몬 목록`
  const description = `포켓몬 챔피언스 ${formatShort}에 등장하는 ${totalCount}종 포켓몬 목록. 타입별 필터링, 스탯 정보, 특성 정보를 확인하세요.`
  const url = `${SITE_URL}/champions/${formatSlug}/list`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title: `${title} - 포케 코리아`,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${title} - 포케 코리아`,
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
      title: `${title} - 포케 코리아`,
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

  const isDefaultFormat = formatSlug === CHAMPIONS_DEFAULT_FORMAT_SLUG

  const title = isDefaultFormat
    ? `포켓몬 챔피언스 티어 리스트 (${formatShort})`
    : `포켓몬 챔피언스 ${formatShort} 티어 리스트`
  const description = isDefaultFormat
    ? `포켓몬 챔피언스 티어 리스트. ${formatShort} 더블 기준 ${totalCount}종 포켓몬의 S/A/B/C/D 티어와 채택 순위 기반 메타 분석을 확인하세요.`
    : `포켓몬 챔피언스 ${formatShort} 티어 리스트. ${totalCount}종 포켓몬의 S/A/B/C/D 티어와 채택 순위 기반 메타 분석을 확인하세요.`
  const url = `${SITE_URL}/champions/${formatSlug}/tier`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title: `${title} - 포케 코리아`,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${title} - 포케 코리아`,
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
      title: `${title} - 포케 코리아`,
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
