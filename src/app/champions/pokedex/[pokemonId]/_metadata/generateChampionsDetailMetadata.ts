import { Metadata } from 'next'
import { GetChampionsPokemonListDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

const SITE_URL = 'https://poke-korea.com'

export const generateChampionsDetailMetadata = async (
  pokemonId: number,
): Promise<Metadata> => {
  if (isNaN(pokemonId) || pokemonId <= 0) {
    return { title: '포켓몬을 찾을 수 없습니다' }
  }

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetChampionsPokemonListQuery,
    GetChampionsPokemonListQueryVariables
  >({
    query: GetChampionsPokemonListDocument,
    variables: {
      input: {
        filter: { search: String(pokemonId) },
        pagination: { first: 1 },
      },
    },
  })

  const pokemon = data?.getChampionsPokemonList?.edges?.[0]?.node

  if (!pokemon) {
    return { title: '포켓몬을 찾을 수 없습니다' }
  }

  return {
    title: `${pokemon.name} 챔피언스 메타 정보 | 포케코리아`,
    description: `포켓몬 챔피언스 ${pokemon.name}의 사용률, 인기 기술, 아이템, 특성, 추천 파트너 정보를 확인하세요.`,
    openGraph: {
      title: `${pokemon.name} 챔피언스 메타 정보 | 포케코리아`,
      description: `포켓몬 챔피언스 ${pokemon.name}의 사용률, 인기 기술, 아이템, 특성, 추천 파트너 정보를 확인하세요.`,
      url: `${SITE_URL}/champions/pokedex/${pokemonId}`,
    },
    alternates: {
      canonical: `${SITE_URL}/champions/pokedex/${pokemonId}`,
    },
  }
}
