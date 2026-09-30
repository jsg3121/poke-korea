import { Fragment } from 'react'
import { Metadata } from 'next'

import {
  MOVES_TYPE_ITEMLIST_JSON_LD,
  MOVES_WEBPAGE_JSON_LD,
} from '~/constants/movesJsonLd'
import { GetPokemonSkillListDocument } from '~/graphql/gqlGenerated'
import {
  PokemonSkillEdge,
  PokemonSkillFilterInput,
  PokemonType,
} from '~/graphql/typeGenerated'
import { getDamageTypeEnglish } from '~/utils/skill.util'
import {
  extractApolloState,
  initializeApollo,
} from '~/modules/apolloClient.module'
import { MovesProvider } from '~/context/Moves.context'
import MovesList from '~/views/moves/MovesList.view'
import Providers from '~/app/providers'

import { generateMovesListMetadata } from './_metadata/generateMovesListMetadata'

interface MovesPageProps {
  searchParams: Promise<{
    typeFilter: PokemonType
    damageTypeFilter: string
    search: string
    firstGenerationId: string
  }>
}

export const generateMetadata = async ({
  searchParams,
}: MovesPageProps): Promise<Metadata> => {
  const { damageTypeFilter, typeFilter, firstGenerationId } = await searchParams
  const parsedGenId = parseInt(firstGenerationId, 10)

  return generateMovesListMetadata({
    typeFilter,
    damageTypeFilter,
    firstGenerationId: parsedGenId || undefined,
  })
}

export default async function MovesPage({ searchParams }: MovesPageProps) {
  const client = initializeApollo()
  const { damageTypeFilter, typeFilter, search, firstGenerationId } =
    await searchParams

  const parsedGenerationId = parseInt(firstGenerationId, 10)
  const movesFilter: PokemonSkillFilterInput = {
    damageType: getDamageTypeEnglish(damageTypeFilter),
    type: typeFilter,
    name: search,
    ...(parsedGenerationId && {
      generationId: parsedGenerationId,
    }),
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

  const initialApolloState = extractApolloState(client)

  return (
    <Fragment>
      <Providers initialApolloState={initialApolloState}>
        <MovesProvider
          initialSkills={skillList}
          totalCount={totalCount}
          movesFilter={movesFilter}
        >
          <MovesList />
        </MovesProvider>
      </Providers>
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
