import {
  GetPokemonSkillDetailDocument,
  GetVersionGroupsBySkillDocument,
} from '~/graphql/gqlGenerated'
import {
  type GetPokemonSkillDetailQuery,
  type GetPokemonSkillDetailQueryVariables,
  type GetVersionGroupsBySkillQuery,
  type GetVersionGroupsBySkillQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/modules/apolloClient.module'

interface FetchMoveDetailMetadataParams {
  skillId: number
  versionGroupId?: number
}

export async function fetchMoveDetailMetadata({
  skillId,
  versionGroupId,
}: FetchMoveDetailMetadataParams) {
  const apolloClient = initializeApollo()

  const [{ data }, versionGroupData] = await Promise.all([
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
    versionGroupId
      ? apolloClient.query<
          GetVersionGroupsBySkillQuery,
          GetVersionGroupsBySkillQueryVariables
        >({
          query: GetVersionGroupsBySkillDocument,
          variables: { skillId },
          fetchPolicy: 'cache-first',
        })
      : null,
  ])

  const versionGroups = versionGroupData?.data?.getVersionGroupsBySkill ?? null

  return {
    skill: data?.getPokemonSkillDetail ?? null,
    versionGroups,
  }
}
