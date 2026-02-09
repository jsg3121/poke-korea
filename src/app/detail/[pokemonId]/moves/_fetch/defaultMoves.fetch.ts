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

interface FetchDefaultMovesParams {
  pokemonId: string
  learnMethod: LearnMethod
  versionGroupId?: number
}

/**
 * 기본형 4개 페이지 (default, machine, version, versionMachine) 공통 쿼리 실행
 */
export async function fetchDefaultMovesQueries({
  pokemonId,
  learnMethod,
  versionGroupId,
}: FetchDefaultMovesParams) {
  const apolloClient = initializeApollo()

  const [{ data: pokemonInfoData }] = await Promise.all([
    apolloClient.query<
      GetDetailMovesPokemonInfoQuery,
      GetDetailMovesPokemonInfoQueryVariables
    >({
      query: GetDetailMovesPokemonInfoDocument,
      variables: { pokemonId },
      fetchPolicy: 'cache-first',
    }),
  ])

  const isNormalForm = !!pokemonInfoData.getPokemonDetail?.isFormChange

  const [
    { data },
    { data: normalFormLearnableSkill },
    { data: versionGroup },
    { data: normalFormImageList },
  ] = await Promise.all([
    !isNormalForm
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
    isNormalForm
      ? apolloClient.query<
          GetPokemonNormalFormLearnableSkillsQuery,
          GetPokemonNormalFormLearnableSkillsQueryVariables
        >({
          query: GetPokemonNormalFormLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
              ...(versionGroupId && { versionGroupId }),
              formIndex: 0,
              learnMethod,
            },
            pokemonId: parseInt(pokemonId, 10),
            activeIndex: 0,
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          ...(isNormalForm && {
            activeType: 'NORMAL',
            activeIndex: 0,
          }),
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
    isNormalForm,
    data,
    normalFormLearnableSkill,
    versionGroup,
    normalFormImageList,
  }
}
