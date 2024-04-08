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
