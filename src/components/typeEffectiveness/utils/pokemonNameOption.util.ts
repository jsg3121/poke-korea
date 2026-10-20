import { PokemonNameOption } from '../pokemonNameSearch.types'

/**
 * 자동완성 행의 DOM id를 만든다.
 * @param listboxId 목록(listbox) id
 * @param index 행 위치
 * @returns 행 id
 */
export const getOptionId = (listboxId: string, index: number) =>
  `${listboxId}-option-${index}`

/**
 * 폼 단위로 고유한 키를 만든다.
 * @param option 검색 결과 항목
 * @returns 도감 번호·폼 구분·폼 순번을 이은 키
 */
export const getOptionKey = (option: PokemonNameOption) =>
  `${option.number}-${option.formType}-${option.index}`
