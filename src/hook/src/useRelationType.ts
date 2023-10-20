import { changeToEngType, changeType } from '../../common'

type UseRelationType = (types: Array<string>) => {
  quad: Array<string>
  double: Array<string>
  half: Array<string>
  quarter: Array<string>
  zero: Array<string>
}

type LelationListType = Array<{
  type: string
  double: string
  half: string
  invalidity: string
}>

type TypesListType = {
  [key: string]: number
}

/**
 *
 * type : 타입 명
 *
 * double  : 맞았을 때 두배로 효과
 *
 * half : 맞았을 때 0.5배로 맞는 타입
 *
 * invalidity : 맞았을 때 효과가 없는 타입
 */
const relationList: LelationListType = [
  {
    type: '노말',
    double: '격투',
    half: '',
    invalidity: '고스트',
  },
  {
    type: '불꽃',
    double: '물 땅 바위',
    half: '불꽃 풀 얼음 벌레 강철 페어리',
    invalidity: '',
  },
  {
    type: '물',
    double: '전기 풀',
    half: '불꽃 물 얼음 강철',
    invalidity: '',
  },
  {
    type: '풀',
    double: '불꽃 얼음 독 비행 벌레',
    half: '물 전기 풀 땅',
    invalidity: '',
  },
  {
    type: '전기',
    double: '땅',
    half: '전기 비행 강철',
    invalidity: '',
  },
  {
    type: '얼음',
    double: '불꽃 격투 바위 강철',
    half: '얼음',
    invalidity: '',
  },
  {
    type: '격투',
    double: '비행 에스퍼 페어리',
    half: '벌레 바위 악',
    invalidity: '',
  },
  {
    type: '독',
    double: '땅 에스퍼',
    half: '풀 격투 독 벌레 페어리',
    invalidity: '',
  },
  {
    type: '땅',
    double: '물 풀 얼음',
    half: '독 바위',
    invalidity: '전기',
  },
  {
    type: '비행',
    double: '전기 얼음 바위',
    half: '풀 격투 벌레',
    invalidity: '땅',
  },
  {
    type: '에스퍼',
    double: '벌레 고스트 악',
    half: '격투 에스퍼',
    invalidity: '',
  },
  {
    type: '벌레',
    double: '불꽃 비행 바위',
    half: '풀 격투 땅',
    invalidity: '',
  },
  {
    type: '바위',
    double: '물 풀 격투 땅 강철',
    half: '노말 불꽃 독 비행',
    invalidity: '',
  },
  {
    type: '고스트',
    double: '고스트 악',
    half: '독 벌레',
    invalidity: '노말 격투',
  },
  {
    type: '드래곤',
    double: '얼음 드래곤 페어리',
    half: '불꽃 물 전기 풀',
    invalidity: '',
  },
  {
    type: '악',
    double: '격투 벌레 페어리',
    half: '고스트 악',
    invalidity: '에스퍼',
  },
  {
    type: '강철',
    double: '불꽃 격투 땅',
    half: '노말 풀 얼음 비행 에스퍼 벌레 바위 드래곤 강철 페어리',
    invalidity: '독',
  },
  {
    type: '페어리',
    double: '독 강철',
    half: '격투 벌레 악',
    invalidity: '드래곤',
  },
]

export const useRelationType: UseRelationType = (types) => {
  const double: string[] = []
  const half: string[] = []
  const invalidity: string[] = []

  const list: TypesListType = {
    normal: 0,
    fire: 0,
    water: 0,
    grass: 0,
    electric: 0,
    ice: 0,
    fighting: 0,
    poison: 0,
    ground: 0,
    flying: 0,
    psychic: 0,
    bug: 0,
    rock: 0,
    ghost: 0,
    dragon: 0,
    dark: 0,
    steel: 0,
    fairy: 0,
  }

  types.forEach((type) => {
    relationList.forEach((item) => {
      if (type === item.type) {
        double.push(...item.double.split(' '))
        half.push(...item.half.split(' '))
        invalidity.push(...item.invalidity.split(' '))
      }
    })
  })

  double.forEach((item) => {
    if (item !== '') {
      const { type } = changeType(item)
      list[type] += 1
    }
  })

  half.forEach((item) => {
    if (item !== '') {
      const { type } = changeType(item)
      list[type] -= 1
    }
  })

  invalidity.forEach((item) => {
    if (item !== '') {
      const { type } = changeType(item)
      list[type] = 999
    }
  })

  const result: ReturnType<UseRelationType> = {
    quad: [],
    double: [],
    half: [],
    quarter: [],
    zero: [],
  }

  for (const [key, value] of Object.entries(list)) {
    if (value === 2) {
      result.quad.push(changeToEngType(key))
    } else if (value === 1) {
      result.double.push(changeToEngType(key))
    } else if (value === -1) {
      result.half.push(changeToEngType(key))
    } else if (value === -2) {
      result.quarter.push(changeToEngType(key))
    } else if (value === 999) {
      result.zero.push(changeToEngType(key))
    }
  }

  return result
}
