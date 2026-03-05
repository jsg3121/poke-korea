import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import {
  MOVES_TYPE_ITEMLIST_JSON_LD,
  MOVES_WEBPAGE_JSON_LD,
} from '~/constants/movesJsonLd'
import { MovesProvider } from '~/context/Moves.context'
import {
  GetPokemonSkillListDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  PokemonSkillEdge,
  PokemonSkillFilterInput,
  PokemonType,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { getDamageTypeEnglish } from '~/utils/skill.util'
import MovesDesktop from '~/views/desktop/moves/Moves.desktop'
import MovesMobile from '~/views/mobile/moves/Moves.mobile'
import { generateMovesListMetadata } from './_metadata/generateMovesListMetadata'

interface MovesPageProps {
  searchParams: Promise<{
    typeFilter: PokemonType
    damageTypeFilter: string
    search: string
    versionGroupId: string
  }>
}

export const revalidate = 31536000 // 24시간마다 재생성

export const generateMetadata = async ({
  searchParams,
}: MovesPageProps): Promise<Metadata> => {
  const { damageTypeFilter, typeFilter } = await searchParams

  return generateMovesListMetadata({ typeFilter, damageTypeFilter })
}

export default async function MovesPage({ searchParams }: MovesPageProps) {
  const client = initializeApollo()
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)
  const { damageTypeFilter, typeFilter, search, versionGroupId } =
    await searchParams

  const parsedVersionGroupId = parseInt(versionGroupId, 10)
  const movesFilter: PokemonSkillFilterInput = {
    damageType: getDamageTypeEnglish(damageTypeFilter),
    type: typeFilter,
    name: search,
    ...(parsedVersionGroupId && {
      versionGroupId: parsedVersionGroupId,
    }),
  }

  const [{ data }, { data: versionGroupData }] = await Promise.all([
    client.query({
      query: GetPokemonSkillListDocument,
      variables: {
        input: {
          filter: movesFilter,
          pagination: {
            first: 20,
          },
        },
      },
    }),
    client.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      fetchPolicy: 'cache-first',
    }),
  ])

  const skillList =
    data?.getPokemonSkillList?.edges?.map(
      (edge: PokemonSkillEdge) => edge.node,
    ) || []
  const totalCount = data?.getPokemonSkillList?.totalCount || 0
  const versionGroups = versionGroupData?.getVersionGroups ?? []

  return (
    <Fragment>
      <MovesProvider
        initialSkills={skillList}
        totalCount={totalCount}
        movesFilter={movesFilter}
        versionGroups={versionGroups}
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
