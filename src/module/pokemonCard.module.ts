import { PokemonType } from '~/graphql/typeGenerated'
import { CardColor } from '~/types/pokemonTypes.types'

/**
 * 포켓몬 도감 번호를 3자리 형식으로 포맷팅
 *
 * @param pokemonNumber - 포켓몬 전국도감 번호
 * @returns 3자리 숫자 문자열 (예: 1 → "001", 25 → "025", 150 → "150")
 *
 * @example
 * ```tsx
 * pokemonNumberFormat(1)    // "001"
 * pokemonNumberFormat(25)   // "025"
 * pokemonNumberFormat(150)  // "150"
 * pokemonNumberFormat(1025) // "1025"
 * ```
 */
export const pokemonNumberFormat = (pokemonNumber: number): string => {
  return pokemonNumber.toString().padStart(3, '0')
}

/**
 * 포켓몬 타입 배열에 맞는 배경 색상 배열 반환
 *
 * @param types - 포켓몬 타입 배열
 * @returns 타입별 색상 배열
 *
 * @example
 * ```tsx
 * getBackgroundColor([PokemonType.FIRE])
 * // [CardColor.FIRE]
 *
 * getBackgroundColor([PokemonType.FIRE, PokemonType.FLYING])
 * // [CardColor.FIRE, CardColor.FLYING]
 * ```
 */
export const getBackgroundColor = (
  types: Array<PokemonType>,
): Array<CardColor> => {
  return types.map((type) => CardColor[type])
}
