import { headers } from 'next/headers'
import { initializeApollo } from '~/module/apolloClient'
import { GetPokemonSkillListDocument } from '~/graphql/gqlGenerated'
import { MovesProvider } from '~/context/Moves.context'
import MovesDesktop from '~/views/desktop/moves/Moves.desktop'
import MovesMobile from '~/views/mobile/moves/Moves.mobile'
import { detectUserAgent } from '~/module/device.module'

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
    data?.getPokemonSkillList?.edges?.map((edge: any) => edge.node) || []
  const hasNextPage = data?.getPokemonSkillList?.pageInfo?.hasNextPage || false
  const endCursor = data?.getPokemonSkillList?.pageInfo?.endCursor
  const totalCount = data?.getPokemonSkillList?.totalCount || 0

  return (
    <MovesProvider
      initialSkills={skillList}
      hasNextPage={hasNextPage}
      endCursor={endCursor}
      totalCount={totalCount}
    >
      {isMobile ? <MovesMobile /> : <MovesDesktop />}
    </MovesProvider>
  )
}
