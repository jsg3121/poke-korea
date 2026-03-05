import { GetPokemonSkillDetailDocument } from '~/graphql/gqlGenerated'
import {
  type GetPokemonSkillDetailQuery,
  type GetPokemonSkillDetailQueryVariables,
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

  const { data } = await apolloClient.query<
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
  })

  return {
    skill: data?.getPokemonSkillDetail ?? null,
  }
}
