import {
  GetPokemonSkillDetailDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  type GetPokemonSkillDetailQuery,
  type GetPokemonSkillDetailQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

interface FetchMoveDetailMetadataParams {
  skillId: number
  versionGroupId?: number
}

/**
 * 기술 상세 메타데이터 쿼리 실행 (스킬 정보만)
 */
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
          GetVersionGroupsQuery,
          GetVersionGroupsQueryVariables
        >({
          query: GetVersionGroupsDocument,
          variables: {
            filter: { skillId },
          },
          fetchPolicy: 'cache-first',
        })
      : null,
  ])

  const versionGroups = versionGroupData?.data?.getVersionGroups ?? null

  return {
    skill: data?.getPokemonSkillDetail ?? null,
    versionGroups,
  }
}
