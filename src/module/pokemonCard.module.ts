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

/**
 * 카드 헤더의 포켓몬 이름 폰트 크기 + 정렬 클래스를 이름 길이에 따라 결정한다.
 * PokemonCard·ChampionsCard가 공유한다.
 *
 * - 폰트: 길수록 작게(모바일 최소 text-2xs=11px)해 줄 수를 최소화하고 잘림을 막는다.
 * - 정렬: 짧으면 우측(도감 번호와 같은 줄), 길어서 어절 단위로 2줄이 될 만하면 좌측
 *   (2줄 우측 정렬은 들쭉날쭉해 가독성이 나쁨).
 * 이름은 break-keep과 함께 써서 어절(띄어쓰기) 단위로만 줄바꿈한다.
 *
 * @param name - 포켓몬/챔피언스 표시 이름
 * @returns 폰트·정렬 Tailwind 클래스 문자열
 */
export const getNameHeaderClass = (name: string): string => {
  const len = name.length
  if (len <= 7) return 'text-xs desktop:text-base text-right'
  if (len <= 10) return 'text-2xs desktop:text-sm text-right'
  return 'text-2xs desktop:text-xs text-left'
}
