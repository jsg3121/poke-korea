import { GetChampionsPokemonDetailDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/modules/apolloClient.module'

interface FetchArgs {
  pokemonId: number
  format: ChampionsFormat
  formCode?: string | null
}

export const fetchChampionsDetail = async ({
  pokemonId,
  format,
  formCode,
}: FetchArgs) => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<
    GetChampionsPokemonDetailQuery,
    GetChampionsPokemonDetailQueryVariables
  >({
    query: GetChampionsPokemonDetailDocument,
    variables: {
      pokemonId,
      format,
      ...(formCode ? { formCode } : {}),
    },
    fetchPolicy: 'network-only',
  })

  return data?.getChampionsPokemonDetail ?? null
}
