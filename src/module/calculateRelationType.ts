import { PokemonType } from '~/graphql/typeGenerated'

export type UseRelationType = (types: Array<PokemonType>) => {
  quad: Array<PokemonType>
  double: Array<PokemonType>
  half: Array<PokemonType>
  quarter: Array<PokemonType>
  zero: Array<PokemonType>
}

type LelationListType = Array<{
  type: PokemonType
  double: Array<PokemonType>
  half: Array<PokemonType>
  invalidity: Array<PokemonType>
}>

type TypesListType = {
  [key in PokemonType]: number
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
export const relationList: LelationListType = [
  {
    type: PokemonType.NORMAL,
    double: [PokemonType.FIGHTING],
    half: [],
    invalidity: [PokemonType.GHOST],
  },
  {
    type: PokemonType.FIRE,
    double: [PokemonType.WATER, PokemonType.GROUND, PokemonType.ROCK],
    half: [
      PokemonType.FIRE,
      PokemonType.GRASS,
      PokemonType.ICE,
      PokemonType.BUG,
      PokemonType.STEEL,
      PokemonType.FAIRY,
    ],
    invalidity: [],
  },
  {
    type: PokemonType.WATER,
    double: [PokemonType.ELECTRIC, PokemonType.GRASS],
    half: [
      PokemonType.FIRE,
      PokemonType.WATER,
      PokemonType.ICE,
      PokemonType.STEEL,
    ],
    invalidity: [],
  },
  {
    type: PokemonType.GRASS,
    double: [
      PokemonType.FIRE,
      PokemonType.ICE,
      PokemonType.POISON,
      PokemonType.FLYING,
      PokemonType.BUG,
    ],
    half: [
      PokemonType.WATER,
      PokemonType.ELECTRIC,
      PokemonType.GRASS,
      PokemonType.GROUND,
    ],
    invalidity: [],
  },
  {
    type: PokemonType.ELECTRIC,
    double: [PokemonType.GROUND],
    half: [PokemonType.ELECTRIC, PokemonType.FLYING, PokemonType.STEEL],
    invalidity: [],
  },
  {
    type: PokemonType.ICE,
    double: [
      PokemonType.FIRE,
      PokemonType.FIGHTING,
      PokemonType.ROCK,
      PokemonType.STEEL,
    ],
    half: [PokemonType.ICE],
    invalidity: [],
  },
  {
    type: PokemonType.FIGHTING,
    double: [PokemonType.FLYING, PokemonType.PSYCHIC, PokemonType.FAIRY],
    half: [PokemonType.BUG, PokemonType.ROCK, PokemonType.DARK],
    invalidity: [],
  },
  {
    type: PokemonType.POISON,
    double: [PokemonType.GROUND, PokemonType.PSYCHIC],
    half: [
      PokemonType.GRASS,
      PokemonType.FIGHTING,
      PokemonType.POISON,
      PokemonType.BUG,
      PokemonType.FAIRY,
    ],
    invalidity: [],
  },
  {
    type: PokemonType.GROUND,
    double: [PokemonType.WATER, PokemonType.GRASS, PokemonType.ICE],
    half: [PokemonType.POISON, PokemonType.ROCK],
    invalidity: [PokemonType.ELECTRIC],
  },
  {
    type: PokemonType.FLYING,
    double: [PokemonType.ELECTRIC, PokemonType.ICE, PokemonType.ROCK],
    half: [PokemonType.GRASS, PokemonType.FIGHTING, PokemonType.BUG],
    invalidity: [PokemonType.GROUND],
  },
  {
    type: PokemonType.PSYCHIC,
    double: [PokemonType.BUG, PokemonType.GHOST, PokemonType.DARK],
    half: [PokemonType.FIGHTING, PokemonType.PSYCHIC],
    invalidity: [],
  },
  {
    type: PokemonType.BUG,
    double: [PokemonType.FIRE, PokemonType.FLYING, PokemonType.ROCK],
    half: [PokemonType.GRASS, PokemonType.FIGHTING, PokemonType.GROUND],
    invalidity: [],
  },
  {
    type: PokemonType.ROCK,
    double: [
      PokemonType.WATER,
      PokemonType.GRASS,
      PokemonType.FIGHTING,
      PokemonType.GROUND,
      PokemonType.STEEL,
    ],
    half: [
      PokemonType.NORMAL,
      PokemonType.FIRE,
      PokemonType.POISON,
      PokemonType.FLYING,
    ],
    invalidity: [],
  },
  {
    type: PokemonType.GHOST,
    double: [PokemonType.GHOST, PokemonType.DARK],
    half: [PokemonType.POISON, PokemonType.BUG],
    invalidity: [PokemonType.NORMAL, PokemonType.FIGHTING],
  },
  {
    type: PokemonType.DRAGON,
    double: [PokemonType.ICE, PokemonType.DRAGON, PokemonType.FAIRY],
    half: [
      PokemonType.FIRE,
      PokemonType.WATER,
      PokemonType.ELECTRIC,
      PokemonType.GRASS,
    ],
    invalidity: [],
  },
  {
    type: PokemonType.DARK,
    double: [PokemonType.FIGHTING, PokemonType.BUG, PokemonType.FAIRY],
    half: [PokemonType.GHOST, PokemonType.DARK],
    invalidity: [PokemonType.PSYCHIC],
  },
  {
    type: PokemonType.STEEL,
    double: [PokemonType.FIRE, PokemonType.FIGHTING, PokemonType.GROUND],
    half: [
      PokemonType.NORMAL,
      PokemonType.GRASS,
      PokemonType.ICE,
      PokemonType.FLYING,
      PokemonType.PSYCHIC,
      PokemonType.BUG,
      PokemonType.ROCK,
      PokemonType.DRAGON,
      PokemonType.STEEL,
      PokemonType.FAIRY,
    ],
    invalidity: [PokemonType.POISON],
  },
  {
    type: PokemonType.FAIRY,
    double: [PokemonType.POISON, PokemonType.STEEL],
    half: [PokemonType.FIGHTING, PokemonType.BUG, PokemonType.DARK],
    invalidity: [PokemonType.DRAGON],
  },
]

export const calculateRelationType: UseRelationType = (types) => {
  const double: Array<PokemonType> = []
  const half: Array<PokemonType> = []
  const invalidity: Array<PokemonType> = []

  const list: TypesListType = {
    [PokemonType.NORMAL]: 0,
    [PokemonType.FIRE]: 0,
    [PokemonType.WATER]: 0,
    [PokemonType.GRASS]: 0,
    [PokemonType.ELECTRIC]: 0,
    [PokemonType.ICE]: 0,
    [PokemonType.FIGHTING]: 0,
    [PokemonType.POISON]: 0,
    [PokemonType.GROUND]: 0,
    [PokemonType.FLYING]: 0,
    [PokemonType.PSYCHIC]: 0,
    [PokemonType.BUG]: 0,
    [PokemonType.ROCK]: 0,
    [PokemonType.GHOST]: 0,
    [PokemonType.DRAGON]: 0,
    [PokemonType.DARK]: 0,
    [PokemonType.STEEL]: 0,
    [PokemonType.FAIRY]: 0,
  }

  types.forEach((type) => {
    relationList.forEach((item) => {
      if (type === item.type) {
        double.push(...item.double)
        half.push(...item.half)
        invalidity.push(...item.invalidity)
      }
    })
  })

  double.forEach((item) => {
    list[PokemonType[item]] += 1
  })

  half.forEach((item) => {
    list[PokemonType[item]] -= 1
  })

  invalidity.forEach((item) => {
    list[PokemonType[item]] = 999
  })

  const result: ReturnType<UseRelationType> = {
    quad: [],
    double: [],
    half: [],
    quarter: [],
    zero: [],
  }

  for (const [key, value] of Object.entries(list) as [PokemonType, number][]) {
    if (value === 2) {
      result.quad.push(key)
    } else if (value === 1) {
      result.double.push(key)
    } else if (value === -1) {
      result.half.push(key)
    } else if (value === -2) {
      result.quarter.push(key)
    } else if (value === 999) {
      result.zero.push(key)
    }
  }

  return result
}
