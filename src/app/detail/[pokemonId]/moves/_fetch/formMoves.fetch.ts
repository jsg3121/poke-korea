import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonLearnableSkillsDocument,
  GetPokemonNormalFormImageListDocument,
  GetPokemonNormalFormLearnableSkillsDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonNormalFormImageListQuery,
  GetPokemonNormalFormImageListQueryVariables,
  LearnMethod,
  type GetDetailMovesPokemonInfoQuery,
  type GetDetailMovesPokemonInfoQueryVariables,
  type GetPokemonLearnableSkillsQuery,
  type GetPokemonLearnableSkillsQueryVariables,
  type GetPokemonNormalFormLearnableSkillsQuery,
  type GetPokemonNormalFormLearnableSkillsQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

interface FetchFormMovesParams {
  pokemonId: string
  activeIndex: number
  versionGroupId?: number
  movesType: 'LEVELUP' | 'MACHINE'
}

/**
 * form 페이지 전용 쿼리 실행
 * activeIndex에 따라 일반/NormalForm 쿼리 분기
 */
export async function fetchFormMovesQueries({
  pokemonId,
  activeIndex,
  versionGroupId,
  movesType,
}: FetchFormMovesParams) {
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
    !pokemonInfoData.getPokemonDetail.isFormChange
  ) {
    return { pokemonInfoData }
  }

  const learnMethod =
    movesType === 'LEVELUP' ? LearnMethod['LEVEL_UP'] : LearnMethod['MACHINE']

  const [
    { data },
    { data: normalFormLearnableSkill },
    { data: versionGroup },
    { data: normalFormImageList },
  ] = await Promise.all([
    activeIndex === 0
      ? apolloClient.query<
          GetPokemonLearnableSkillsQuery,
          GetPokemonLearnableSkillsQueryVariables
        >({
          query: GetPokemonLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
              ...(versionGroupId && { versionGroupId }),
              learnMethod,
            },
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    activeIndex > 0
      ? apolloClient.query<
          GetPokemonNormalFormLearnableSkillsQuery,
          GetPokemonNormalFormLearnableSkillsQueryVariables
        >({
          query: GetPokemonNormalFormLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
              ...(versionGroupId && { versionGroupId }),
              formIndex: activeIndex,
              learnMethod,
            },
            pokemonId: parseInt(pokemonId, 10),
            activeIndex,
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          activeType: 'NORMAL',
          activeIndex,
        },
      },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<
      GetPokemonNormalFormImageListQuery,
      GetPokemonNormalFormImageListQueryVariables
    >({
      query: GetPokemonNormalFormImageListDocument,
      variables: {
        pokemonId: parseInt(pokemonId, 10),
      },
      fetchPolicy: 'cache-first',
    }),
  ])

  return {
    pokemonInfoData,
    data,
    normalFormLearnableSkill,
    versionGroup,
    normalFormImageList,
  }
}
