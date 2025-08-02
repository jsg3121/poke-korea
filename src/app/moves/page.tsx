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
import MovesDesktop from '~/views/desktop/moves/Moves.desktop'
import MovesMobile from '~/views/mobile/moves/Moves.mobile'

interface MovesPageProps {
  searchParams: Promise<{
    typeFilter: PokemonType
    damageTypeFilter: string
  }>
}

export default async function MovesPage({ searchParams }: MovesPageProps) {
  console.log('🔬 dev-only ~ MovesPage ~ searchParams:', searchParams)
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
