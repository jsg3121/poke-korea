import { headers } from 'next/headers'
import { MovesProvider } from '~/context/Moves.context'
import { GetPokemonSkillListDocument } from '~/graphql/gqlGenerated'
import { PokemonSkillEdge } from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import MovesDesktop from '~/views/desktop/moves/Moves.desktop'
import MovesMobile from '~/views/mobile/moves/Moves.mobile'

export default async function MovesPage() {
  const client = initializeApollo()
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { data } = await client.query({
    query: GetPokemonSkillListDocument,
    variables: {
      input: {
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
    <MovesProvider initialSkills={skillList} totalCount={totalCount}>
      {isMobile ? <MovesMobile /> : <MovesDesktop />}
    </MovesProvider>
  )
}
