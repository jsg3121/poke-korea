import type {
  Pokemon,
  PokemonMega,
  PokemonNormalForm,
  PokemonRegion,
} from '~/graphql/typeGenerated'

export interface IFDetailPokemonInfo {
  pokemonBaseInfo: Pokemon
  megaEvolutions: Array<PokemonMega>
  regionFormInfo: Array<PokemonRegion>
  normalForm: Array<PokemonNormalForm>
}

export interface IFPokemonStat {
  attack: number
  defense: number
  hp: number
  specialAttack: number
  specialDefense: number
  speed: number
  total: number
}
