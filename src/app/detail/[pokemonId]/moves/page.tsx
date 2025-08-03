import { headers } from 'next/headers'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import {
  GetPokemonLearnableSkillsDocument,
  GetPokemonRegionFormLearnableSkillsDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonLearnableSkillsQuery,
  GetPokemonLearnableSkillsQueryVariables,
  GetPokemonRegionFormLearnableSkillsQuery,
  GetPokemonRegionFormLearnableSkillsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'

export const revalidate = 31536000 // 24시간마다 재생성

interface DetailMovesPageProps {
  params: Promise<{ pokemonId: string }>
  searchParams: Promise<{
    pokemonType?: 'region' | 'normalForm'
    activeIndex?: string
  }>
}

const DetailMovesPage = async ({
  params,
  searchParams,
}: DetailMovesPageProps) => {
  const { pokemonId } = await params
  const { pokemonType } = await searchParams
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const [{ data }, { data: regionFormLearnableSkill }] = await Promise.all([
    pokemonType !== 'region' && pokemonType !== 'normalForm'
      ? apolloClient.query<
          GetPokemonLearnableSkillsQuery,
          GetPokemonLearnableSkillsQueryVariables
        >({
          query: GetPokemonLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonNumber: parseInt(pokemonId, 10),
            },
            pokemonId: pokemonId,
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    pokemonType === 'region'
      ? apolloClient.query<
          GetPokemonRegionFormLearnableSkillsQuery,
          GetPokemonRegionFormLearnableSkillsQueryVariables
        >({
          query: GetPokemonRegionFormLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
            },
            pokemonId: parseInt(pokemonId, 10),
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
  ])
  console.log(
    '🔬 dev-only ~ regionFormLearnableSkill:',
    regionFormLearnableSkill?.getPokemonRegionForm,
  )

  const pokemonLearnableData =
    data?.getPokemonLearnableSkills?.map((learnableData) => {
      return {
        versionGroup: learnableData.versionGroup,
        levelUpSkills: learnableData.levelUpSkills ?? [],
        machineSkills: learnableData.machineSkills ?? [],
      }
    }) ?? []

  const providerProps = {
    pokemonInfo: data?.getPokemonDetail,
    pokemonLearnableData,
  }

  const pokemonName = data?.getPokemonDetail?.name ?? ''

  return (
    <DetailMovesProvider {...providerProps}>
      {isMobile ? (
        <DetailMovesDesktop pokemonName={pokemonName} />
      ) : (
        <DetailMovesDesktop pokemonName={pokemonName} />
      )}
    </DetailMovesProvider>
  )
}

export default DetailMovesPage
