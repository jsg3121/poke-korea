import { SearchPokemonFormsWithTypesQuery } from '~/graphql/typeGenerated'

export type PokemonNameOption =
  SearchPokemonFormsWithTypesQuery['searchPokemonWithAllForms'][number]

export type PokemonNameSuggestionStatus =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error'
