import { PokemonNameOption } from '../pokemonNameSearch.types'

/**
 * 폼 단위로 고유한 키를 만든다.
 * @param option 검색 결과 항목
 * @returns 도감 번호·폼 구분·폼 순번을 이은 키
 */
export const getOptionKey = (option: PokemonNameOption) =>
  `${option.number}-${option.formType}-${option.index}`
