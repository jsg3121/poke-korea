import { PokemonType } from '~/graphql/typeGenerated'
import { CardColor, PokemonTypes, TypesColor } from '../types'

/**
 * info : 타입 정보 및 색상 설정
 * @param type string 데이터베이스 타입 한글
 * @returns type: 타입 정보, color: 타입 색상
 */
export const changeType = (type: PokemonType) => {
  return {
    type: PokemonTypes[type],
    color: TypesColor[type],
    cardColor: CardColor[type],
  }
}
