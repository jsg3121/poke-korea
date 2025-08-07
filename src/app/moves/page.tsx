import { Metadata } from 'next'
import { headers } from 'next/headers'
import { MovesProvider } from '~/context/Moves.context'
import { GetPokemonSkillListDocument } from '~/graphql/gqlGenerated'
import {
  PokemonSkillEdge,
  PokemonSkillFilterInput,
  PokemonType,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import MovesDesktop from '~/views/desktop/moves/Moves.desktop'
import MovesMobile from '~/views/mobile/moves/Moves.mobile'

interface MovesPageProps {
  searchParams: Promise<{
    typeFilter: PokemonType
    damageTypeFilter: string
  }>
}

export const generateMetadata = async ({
  searchParams,
}: MovesPageProps): Promise<Metadata> => {
  const { damageTypeFilter, typeFilter } = await searchParams
  const title = `포켓몬 ${damageTypeFilter ? `${damageTypeFilter} 유형` : ''} ${typeFilter ? `${PokemonTypes[typeFilter]} 타입` : ''} 기술 목록 - 포케코리아`
  const description = `포케코리아에서${damageTypeFilter ? ` ${damageTypeFilter} 유형의` : ''}${typeFilter ? ` ${PokemonTypes[typeFilter]} 타입을 가지고 있는` : ''} 포켓몬의 모든 기술을 한눈에 확인하세요. 1세대부터 9세대 까지 모든 기술을 확인하실 수 있습니다.`
  const params = new URLSearchParams()

  if (typeFilter) {
    params.set('typeFilter', typeFilter)
  }
  if (damageTypeFilter) {
    params.set('damageTypeFilter', damageTypeFilter)
  }

  const queryParams = `${typeFilter || damageTypeFilter ? '?' : ''}${params.toString()}`
  const canonicalUrl = `https://poke-korea.com${queryParams}`

  const metadata: Metadata = {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
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
    <MovesProvider
      initialSkills={skillList}
      totalCount={totalCount}
      movesFilter={movesFilter}
    >
      {isMobile ? <MovesMobile /> : <MovesDesktop />}
    </MovesProvider>
  )
}
