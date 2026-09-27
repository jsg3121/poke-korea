import { GetPokemonByAbilityDocument } from '~/graphql/gqlGenerated'
import {
  type GetPokemonByAbilityQuery,
  type GetPokemonByAbilityQueryVariables,
} from '~/graphql/typeGenerated'
import {
  extractApolloState,
  initializeApollo,
} from '~/modules/apolloClient.module'

interface FetchAbilityDetailParams {
  abilityId: number
  first: number
}

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

  return { data, initialApolloState: extractApolloState(apolloClient) }
}
