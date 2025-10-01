import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import { MOVES_WEBPAGE_JSON_LD } from '~/constants/movesJsonLd'
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
import MovesDesktop from '~/views/desktop/moves/Moves.desktop'
import MovesMobile from '~/views/mobile/moves/Moves.mobile'

interface MovesPageProps {
  searchParams: Promise<{
    typeFilter: PokemonType
    damageTypeFilter: string
  }>
}

export const revalidate = 31536000 // 24시간마다 재생성

export const generateMetadata = async ({
  searchParams,
}: MovesPageProps): Promise<Metadata> => {
  const { damageTypeFilter, typeFilter } = await searchParams
  const params = new URLSearchParams()

  if (typeFilter) {
    params.set('typeFilter', typeFilter)
  }
  if (damageTypeFilter) {
    params.set('damageTypeFilter', damageTypeFilter)
  }

  const queryParams = `${typeFilter || damageTypeFilter ? '?' : ''}${params.toString()}`
  const title =
    !typeFilter && !damageTypeFilter
      ? '포켓몬 기술 도감 - 포케코리아'
      : `포켓몬 ${damageTypeFilter ? `${damageTypeFilter} 유형` : ''} ${typeFilter ? `${PokemonTypes[typeFilter]} 타입` : ''} 기술 목록 - 포케코리아`

  const description =
    !typeFilter && !damageTypeFilter
      ? '900개가 넘는 포켓몬의 모든 기술을 한곳에서 확인하고, 타입과 유형 필터를 이용해 필요한 기술을 한 번에 찾아보세요!'
      : `포케코리아에서${damageTypeFilter ? ` ${damageTypeFilter} 유형의` : ''}${typeFilter ? ` ${PokemonTypes[typeFilter]} 타입을 가지고 있는` : ''} 포켓몬의 모든 기술을 한눈에 확인하세요. 1세대부터 9세대 까지 모든 기술을 확인하실 수 있습니다.`
  const canonicalUrl = `https://poke-korea.com/moves${queryParams}`

  const metadata: Metadata = {
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
  }

  return metadata
}

export default async function MovesPage({ searchParams }: MovesPageProps) {
  const client = initializeApollo()
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)
  const { damageTypeFilter, typeFilter } = await searchParams

  const movesFilter: PokemonSkillFilterInput = {
    damageType: damageTypeFilter,
    type: typeFilter,
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
        id="type-effectiveness-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(MOVES_WEBPAGE_JSON_LD),
        }}
      />
    </Fragment>
  )
}
