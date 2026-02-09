import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonNormalFormMetadataDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  type GetDetailMovesPokemonInfoQuery,
  type GetDetailMovesPokemonInfoQueryVariables,
  type GetPokemonNormalFormMetadataQuery,
  type GetPokemonNormalFormMetadataQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

interface FetchDefaultMovesMetadataParams {
  pokemonId: string
  activeIndex?: number
  activeType?: 'NORMAL'
}

/**
 * detail/moves 메타데이터 공통 쿼리 실행
 * - 그룹 1 (기본 4개 페이지): activeIndex=0, activeType 미전달
 * - 그룹 2 (form 페이지): activeIndex 동적, activeType='NORMAL'
 */
export async function fetchDefaultMovesMetadata({
  pokemonId,
  activeIndex = 0,
  activeType,
}: FetchDefaultMovesMetadataParams) {
  const apolloClient = initializeApollo()

  const { data: pokemonDetail } = await apolloClient.query<
    GetDetailMovesPokemonInfoQuery,
    GetDetailMovesPokemonInfoQueryVariables
  >({
    query: GetDetailMovesPokemonInfoDocument,
    variables: { pokemonId },
    fetchPolicy: 'cache-first',
  })

  const isNormalForm = !!pokemonDetail.getPokemonDetail?.isFormChange

  const versionGroupFilter = activeType
    ? { activeType, activeIndex }
    : isNormalForm
      ? { activeType: 'NORMAL' as const, activeIndex }
      : {}

  const [{ data: versionInfo }, { data: normalFormData }] = await Promise.all([
    apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          ...versionGroupFilter,
        },
      },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<
      GetPokemonNormalFormMetadataQuery,
      GetPokemonNormalFormMetadataQueryVariables
    >({
      query: GetPokemonNormalFormMetadataDocument,
      variables: {
        pokemonId: parseInt(pokemonId, 10),
        activeIndex,
      },
    }),
  ])

  return {
    pokemonDetail,
    isNormalForm,
    versionInfo,
    normalFormData,
  }
}
