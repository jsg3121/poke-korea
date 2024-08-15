import { CardColor, EngTypes, TypesColor } from '../../types'

/**
 * info : 타입 정보 및 색상 설정
 * @param type string 데이터베이스 타입 한글
 * @returns type: 타입 정보, color: 타입 색상
 */
export const changeType = (type: string) => {
  switch (type) {
    case '노말':
      return {
        type: EngTypes.NORMAL,
        color: TypesColor.NORMAL,
        cardColor: CardColor.NORMAL,
      }
    case '불꽃':
      return {
        type: EngTypes.FIRE,
        color: TypesColor.FIRE,
        cardColor: CardColor.FIRE,
      }
    case '물':
      return {
        type: EngTypes.WATER,
        color: TypesColor.WATER,
        cardColor: CardColor.WATER,
      }
    case '풀':
      return {
        type: EngTypes.GRASS,
        color: TypesColor.GRASS,
        cardColor: CardColor.GRASS,
      }
    case '전기':
      return {
        type: EngTypes.ELECTRIC,
        color: TypesColor.ELECTRIC,
        cardColor: CardColor.ELECTRIC,
      }
    case '얼음':
      return {
        type: EngTypes.ICE,
        color: TypesColor.ICE,
        cardColor: CardColor.ICE,
      }
    case '격투':
      return {
        type: EngTypes.FIGHTING,
        color: TypesColor.FIGHTING,
        cardColor: CardColor.FIGHTING,
      }
    case '독':
      return {
        type: EngTypes.POISON,
        color: TypesColor.POISON,
        cardColor: CardColor.POISON,
      }
    case '땅':
      return {
        type: EngTypes.GROUND,
        color: TypesColor.GROUND,
        cardColor: CardColor.GROUND,
      }
    case '비행':
      return {
        type: EngTypes.FLYING,
        color: TypesColor.FLYING,
        cardColor: CardColor.FLYING,
      }
    case '에스퍼':
      return {
        type: EngTypes.PSYCHIC,
        color: TypesColor.PSYCHIC,
        cardColor: CardColor.PSYCHIC,
      }
    case '벌레':
      return {
        type: EngTypes.BUG,
        color: TypesColor.BUG,
        cardColor: CardColor.BUG,
      }
    case '바위':
      return {
        type: EngTypes.ROCK,
        color: TypesColor.ROCK,
        cardColor: CardColor.ROCK,
      }
    case '고스트':
      return {
        type: EngTypes.GHOST,
        color: TypesColor.GHOST,
        cardColor: CardColor.GHOST,
      }
    case '드래곤':
      return {
        type: EngTypes.DRAGON,
        color: TypesColor.DRAGON,
        cardColor: CardColor.DRAGON,
      }
    case '악':
      return {
        type: EngTypes.DARK,
        color: TypesColor.DARK,
        cardColor: CardColor.DARK,
      }
    case '강철':
      return {
        type: EngTypes.STEEL,
        color: TypesColor.STEEL,
        cardColor: CardColor.STEEL,
      }
    case '페어리':
      return {
        type: EngTypes.FAIRY,
        color: TypesColor.FAIRY,
        cardColor: CardColor.FAIRY,
      }

    default:
      return {
        type: '-',
        color: TypesColor.NORMAL,
        cardColor: CardColor.NORMAL,
      }
  }
}
