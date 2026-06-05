import { GetChampionsPokemonDetailDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

interface FetchArgs {
  pokemonId: number
  format: ChampionsFormat
  formCode?: string | null
}

/**
 * 챔피언스 포켓몬 상세 페치 (BASE / 폼 라우트 공통).
 * 폼 라우트에서 formCode 를 전달하면 해당 폼 데이터를 받는다.
 */
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
