import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import {
  MOVES_TYPE_ITEMLIST_JSON_LD,
  MOVES_WEBPAGE_JSON_LD,
} from '~/constants/movesJsonLd'
import { MOVES_MAIN_META } from '~/constants/seoMetaData'
import { MovesProvider } from '~/context/Moves.context'
import { GetPokemonSkillListDocument } from '~/graphql/gqlGenerated'
import {
  PokemonSkillEdge,
  PokemonSkillFilterInput,
  PokemonType,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeEnglish } from '~/utils/skill.util'
import MovesDesktop from '~/views/desktop/moves/Moves.desktop'
import MovesMobile from '~/views/mobile/moves/Moves.mobile'

interface MovesPageProps {
  searchParams: Promise<{
    typeFilter: PokemonType
    damageTypeFilter: string
    search: string
    generationId: string
  }>
}

export const revalidate = 31536000 // 24시간마다 재생성

export const generateMetadata = async ({
  searchParams,
}: MovesPageProps): Promise<Metadata> => {
  const { damageTypeFilter, typeFilter } = await searchParams

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

export default async function MovesPage({ searchParams }: MovesPageProps) {
  const client = initializeApollo()
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)
  const { damageTypeFilter, typeFilter, search, generationId } =
    await searchParams

  const movesFilter: PokemonSkillFilterInput = {
    damageType: getDamageTypeEnglish(damageTypeFilter),
    type: typeFilter,
    name: search,
    generationId: parseInt(generationId, 10),
  }

  const { data } = await client.query({
    query: GetPokemonSkillListDocument,
    variables: {
      input: {
        filter: movesFilter,
        pagination: {
          first: 20,
        },
      },
    },
  })

  const skillList =
    data?.getPokemonSkillList?.edges?.map(
      (edge: PokemonSkillEdge) => edge.node,
    ) || []
  const totalCount = data?.getPokemonSkillList?.totalCount || 0

  return (
    <Fragment>
      <MovesProvider
        initialSkills={skillList}
        totalCount={totalCount}
        movesFilter={movesFilter}
      >
        {isMobile ? <MovesMobile /> : <MovesDesktop />}
      </MovesProvider>
      <script
        id="moves-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(MOVES_WEBPAGE_JSON_LD),
        }}
      />
      <script
        id="moves-type-itemlist-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(MOVES_TYPE_ITEMLIST_JSON_LD),
        }}
      />
    </Fragment>
  )
}
