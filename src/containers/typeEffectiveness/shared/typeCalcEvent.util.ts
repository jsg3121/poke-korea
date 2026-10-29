import { PokemonType } from '~/graphql/typeGenerated'

/**
 * 타입 목록을 이벤트 파라미터 값으로 바꾼다.
 * @param types 선택된 타입 목록
 * @returns 소문자 타입을 알파벳순으로 정렬해 쉼표로 이은 값(예: `fire,flying`)
 */
export const toTypesParam = (types: ReadonlyArray<PokemonType>) =>
  types
    .map((type) => type.toLowerCase())
    .sort()
    .join(',')
