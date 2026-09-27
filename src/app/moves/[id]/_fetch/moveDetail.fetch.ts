import {
  GetLearnMethodsDocument,
  GetPokemonsBySkillDocument,
  GetPokemonSkillDetailDocument,
  GetVersionGroupsBySkillDocument,
} from '~/graphql/gqlGenerated'
import {
  type GetLearnMethodsQuery,
  type GetLearnMethodsQueryVariables,
  type GetPokemonsBySkillQuery,
  type GetPokemonsBySkillQueryVariables,
  type GetPokemonSkillDetailQuery,
  type GetPokemonSkillDetailQueryVariables,
  type GetVersionGroupsBySkillQuery,
  type GetVersionGroupsBySkillQueryVariables,
} from '~/graphql/typeGenerated'
import {
  extractApolloState,
  initializeApollo,
} from '~/modules/apolloClient.module'

interface FetchMoveDetailParams {
  skillId: number
  versionGroupId?: number
}

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
    return {
      skill: null,
      pokemonData: null,
      versionGroups: null,
      initialApolloState: null,
    }
  }

  const [{ data: versionGroupData }] = await Promise.all([
    apolloClient.query<
      GetVersionGroupsBySkillQuery,
      GetVersionGroupsBySkillQueryVariables
    >({
      query: GetVersionGroupsBySkillDocument,
      variables: { skillId },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<GetLearnMethodsQuery, GetLearnMethodsQueryVariables>({
      query: GetLearnMethodsDocument,
      fetchPolicy: 'cache-first',
    }),
  ])

  return {
    skill,
    pokemonData,
    versionGroups: versionGroupData?.getVersionGroupsBySkill ?? null,
    initialApolloState: extractApolloState(apolloClient),
  }
}
