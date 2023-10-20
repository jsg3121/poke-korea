import { EngTypes, TypesColor } from '../../types'

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
      }
    case '불꽃':
      return {
        type: EngTypes.FIRE,
        color: TypesColor.FIRE,
      }
    case '물':
      return {
        type: EngTypes.WATER,
        color: TypesColor.WATER,
      }
    case '풀':
      return {
        type: EngTypes.GRASS,
        color: TypesColor.GRASS,
      }
    case '전기':
      return {
        type: EngTypes.ELECTRIC,
        color: TypesColor.ELECTRIC,
      }
    case '얼음':
      return {
        type: EngTypes.ICE,
        color: TypesColor.ICE,
      }
    case '격투':
      return {
        type: EngTypes.FIGHTING,
        color: TypesColor.FIGHTING,
      }
    case '독':
      return {
        type: EngTypes.POISON,
        color: TypesColor.POISON,
      }
    case '땅':
      return {
        type: EngTypes.GROUND,
        color: TypesColor.GROUND,
      }
    case '비행':
      return {
        type: EngTypes.FLYING,
        color: TypesColor.FLYING,
      }
    case '에스퍼':
      return {
        type: EngTypes.PSYCHIC,
        color: TypesColor.PSYCHIC,
      }
    case '벌레':
      return {
        type: EngTypes.BUG,
        color: TypesColor.BUG,
      }
    case '바위':
      return {
        type: EngTypes.ROCK,
        color: TypesColor.ROCK,
      }
    case '고스트':
      return {
        type: EngTypes.GHOST,
        color: TypesColor.GHOST,
      }
    case '드래곤':
      return {
        type: EngTypes.DRAGON,
        color: TypesColor.DRAGON,
      }
    case '악':
      return {
        type: EngTypes.DARK,
        color: TypesColor.DARK,
      }
    case '강철':
      return {
        type: EngTypes.STEEL,
        color: TypesColor.STEEL,
      }
    case '페어리':
      return {
        type: EngTypes.FAIRY,
        color: TypesColor.FAIRY,
      }

    default:
      return {
        type: '-',
        color: TypesColor.NORMAL,
      }
  }
}
