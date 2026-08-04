import { GetPokemonByAbilityDocument } from '~/graphql/gqlGenerated'
import {
  type GetPokemonByAbilityQuery,
  type GetPokemonByAbilityQueryVariables,
} from '~/graphql/typeGenerated'
import { extractApolloState, initializeApollo } from '~/module/apolloClient'

interface FetchAbilityDetailParams {
  abilityId: number
  first: number
}

/**
 * 특성 상세 페이지 쿼리 실행
 */
export async function fetchAbilityDetailQueries({
  abilityId,
  first,
}: FetchAbilityDetailParams) {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetPokemonByAbilityQuery,
    GetPokemonByAbilityQueryVariables
  >({
    query: GetPokemonByAbilityDocument,
    variables: {
      input: {
        filter: {
          abilityId,
          includeHidden: true,
        },
        pagination: {
          first,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  // SSR 캐시를 클라이언트로 전달해 usePokemonByAbility의 useQuery가 초기 재요청
  // 없이 캐시를 읽도록 한다(metadata 생성 호출에서는 이 값을 사용하지 않는다).
  return { data, initialApolloState: extractApolloState(apolloClient) }
}
