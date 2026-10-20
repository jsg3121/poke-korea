import { useSearchPokemonFormsWithTypesQuery } from '~/graphql/gqlGenerated'
import { PokemonNameSuggestionStatus } from '~/components/typeEffectiveness/pokemonNameSearch.types'

const MAX_QUERY_WORDS = 5

type PokemonNameSearchStatus = 'idle' | PokemonNameSuggestionStatus

/**
 * 디바운스가 끝난 검색어로 포켓몬 폼을 검색한다.
 * @param keyword 공백을 정리한 검색어. 빈 문자열이면 요청하지 않는다
 * @returns 검색 결과, 상태, 다시 시도 함수
 */
export const usePokemonNameSearch = (keyword: string) => {
  const isOverWordLimit =
    keyword.split(/\s+/).filter((word) => word !== '').length > MAX_QUERY_WORDS

  const { data, loading, error, refetch } = useSearchPokemonFormsWithTypesQuery(
    {
      variables: { input: { name: keyword } },
      skip: keyword === '' || isOverWordLimit,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  )

  const options = data?.searchPokemonWithAllForms ?? []

  const getStatus = (): PokemonNameSearchStatus => {
    if (keyword === '') return 'idle'
    if (isOverWordLimit) return 'empty'
    if (options.length > 0) return 'success'
    if (loading) return 'loading'
    if (error) return 'error'
    return 'empty'
  }

  const retry = () => {
    void refetch()
  }

  return { options, status: getStatus(), retry }
}
