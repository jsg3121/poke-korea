import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonRegionFormLearnableSkillsDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  LearnMethod,
  type GetDetailMovesPokemonInfoQuery,
  type GetDetailMovesPokemonInfoQueryVariables,
  type GetPokemonRegionFormLearnableSkillsQuery,
  type GetPokemonRegionFormLearnableSkillsQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

interface FetchRegionMovesParams {
  pokemonId: string
  activeIndex: number
  versionGroupId?: number
  movesType: 'LEVELUP' | 'MACHINE'
}

/**
 * region 페이지 전용 쿼리 실행
 */
export async function fetchRegionMovesQueries({
  pokemonId,
  activeIndex,
  versionGroupId,
  movesType,
}: FetchRegionMovesParams) {
  const apolloClient = initializeApollo()

  const { data: pokemonInfoData } = await apolloClient.query<
    GetDetailMovesPokemonInfoQuery,
    GetDetailMovesPokemonInfoQueryVariables
  >({
    query: GetDetailMovesPokemonInfoDocument,
    variables: { pokemonId },
    fetchPolicy: 'cache-first',
  })

  if (
    !pokemonInfoData.getPokemonDetail ||
    !pokemonInfoData.getPokemonDetail.isRegionForm
  ) {
    return {
      pokemonInfoData,
      regionFormLearnableSkill: null,
      versionGroup: null,
    }
  }

  const learnMethod =
    movesType === 'LEVELUP' ? LearnMethod['LEVEL_UP'] : LearnMethod['MACHINE']

  const [{ data: regionFormLearnableSkill }, { data: versionGroup }] =
    await Promise.all([
      apolloClient.query<
        GetPokemonRegionFormLearnableSkillsQuery,
        GetPokemonRegionFormLearnableSkillsQueryVariables
      >({
        query: GetPokemonRegionFormLearnableSkillsDocument,
        variables: {
          filter: {
            pokemonId: parseInt(pokemonId, 10),
            formIndex: activeIndex,
            learnMethod,
            ...(versionGroupId && { versionGroupId }),
          },
          pokemonId: parseInt(pokemonId, 10),
        },
        fetchPolicy: 'cache-first',
      }),
      apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>(
        {
          query: GetVersionGroupsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
              activeType: 'REGION',
              activeIndex,
            },
          },
          fetchPolicy: 'cache-first',
        },
      ),
    ])

  return {
    pokemonInfoData,
    regionFormLearnableSkill,
    versionGroup,
  }
}
