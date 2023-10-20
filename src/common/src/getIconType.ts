import { PokemonTypes } from '../../types'

/**
 * info : card 타입별 배경 아이콘
 * @param type card icon type
 * @returns type: 타입 정보, color:배경 색상
 */
export const changeToEngType = (type: string) => {
  switch (type) {
    case 'normal':
      return PokemonTypes.NORMAL
    case 'fire':
      return PokemonTypes.FIRE
    case 'water':
      return PokemonTypes.WATER
    case 'grass':
      return PokemonTypes.GRASS
    case 'electric':
      return PokemonTypes.ELECTRIC
    case 'ice':
      return PokemonTypes.ICE
    case 'fighting':
      return PokemonTypes.FIGHTING
    case 'poison':
      return PokemonTypes.POISON
    case 'ground':
      return PokemonTypes.GROUND
    case 'flying':
      return PokemonTypes.FLYING
    case 'psychic':
      return PokemonTypes.PSYCHIC
    case 'bug':
      return PokemonTypes.BUG
    case 'rock':
      return PokemonTypes.ROCK
    case 'ghost':
      return PokemonTypes.GHOST
    case 'dragon':
      return PokemonTypes.DRAGON
    case 'dark':
      return PokemonTypes.DARK
    case 'steel':
      return PokemonTypes.STEEL
    case 'fairy':
      return PokemonTypes.FAIRY
    default:
      return '-'
  }
}
