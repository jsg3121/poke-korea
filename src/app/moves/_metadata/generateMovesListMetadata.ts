import { Metadata } from 'next'
import { createMetadata } from '~/constants/seoMetaData'
import { PokemonType } from '~/graphql/typeGenerated'
import { getRobotsConfig } from '~/module/metadata.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const MOVES_MAIN_META = createMetadata(
  '포켓몬 기술 도감 (1~9세대 전체) | 포케 코리아',
  '1세대부터 9세대까지 900개 이상의 포켓몬 기술을 타입·데미지 유형별로 검색하세요. 위력, 명중률, 배울 수 있는 포켓몬까지 한눈에 확인할 수 있습니다.',
  '/moves',
  '포켓몬 기술 도감 | 포케 코리아',
)

interface MovesListMetadataParams {
  typeFilter?: PokemonType
  damageTypeFilter?: string
}

export const generateMovesListMetadata = ({
  typeFilter,
  damageTypeFilter,
}: MovesListMetadataParams): Metadata => {
  if (!typeFilter && !damageTypeFilter) {
    return MOVES_MAIN_META
  }

  const params = new URLSearchParams()

  if (typeFilter) {
    params.set('typeFilter', typeFilter)
  }
  if (damageTypeFilter) {
    params.set('damageTypeFilter', damageTypeFilter)
  }

  const title = `포켓몬 ${damageTypeFilter ? `${damageTypeFilter} ` : ''}${typeFilter ? `${PokemonTypes[typeFilter]} 타입 ` : ''}기술 목록 | 포케 코리아`
  const description = `${damageTypeFilter ? `${damageTypeFilter} 유형` : ''}${damageTypeFilter && typeFilter ? ' · ' : ''}${typeFilter ? `${PokemonTypes[typeFilter]} 타입` : ''} 포켓몬 기술을 모아보세요. 위력, 명중률, 세대별 변경사항과 배울 수 있는 포켓몬 목록까지 확인할 수 있습니다.`
  const canonicalUrl = `https://poke-korea.com/moves?${params.toString()}`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
}
