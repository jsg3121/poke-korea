import {
  GetPokemonSkillDetailDocument,
  GetPokemonsBySkillDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  type GetPokemonSkillDetailQuery,
  type GetPokemonSkillDetailQueryVariables,
  type GetPokemonsBySkillQuery,
  type GetPokemonsBySkillQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

interface FetchMoveDetailParams {
  skillId: number
  versionGroupId?: number
}

/**
 * 기술 상세 페이지 공통 쿼리 실행
 */
export async function fetchMoveDetailQueries({
  skillId,
  versionGroupId,
}: FetchMoveDetailParams) {
  const apolloClient = initializeApollo()

  const [{ data: skillData }, { data: pokemonData }] = await Promise.all([
    apolloClient.query<
      GetPokemonSkillDetailQuery,
      GetPokemonSkillDetailQueryVariables
    >({
      query: GetPokemonSkillDetailDocument,
      variables: {
        filter: {
          skillId,
          versionGroupId,
        },
      },
      fetchPolicy: 'network-only',
    }),
    apolloClient.query<
      GetPokemonsBySkillQuery,
      GetPokemonsBySkillQueryVariables
    >({
      query: GetPokemonsBySkillDocument,
      variables: {
        input: {
          filter: {
            skillId,
            versionGroupId,
          },
          pagination: {
            first: 30,
          },
        },
      },
      fetchPolicy: 'network-only',
    }),
  ])

  const skill = skillData?.getPokemonSkillDetail

  if (!skill) {
    return { skill: null, pokemonData: null, versionGroups: null }
  }

  const versionGroupIds = skill.generations.map((gen) => gen.versionGroupId)

  const { data: versionGroupData } = await apolloClient.query<
    GetVersionGroupsQuery,
    GetVersionGroupsQueryVariables
  >({
    query: GetVersionGroupsDocument,
    variables: {
      filter: {
        versionGroupIds,
      },
    },
    fetchPolicy: 'cache-first',
  })

  return {
    skill,
    pokemonData,
    versionGroups: versionGroupData?.getVersionGroups ?? null,
  }
}
