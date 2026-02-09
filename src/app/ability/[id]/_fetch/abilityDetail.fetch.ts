import { GetPokemonByAbilityDocument } from '~/graphql/gqlGenerated'
import {
  type GetPokemonByAbilityQuery,
  type GetPokemonByAbilityQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

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

  return { data }
}
