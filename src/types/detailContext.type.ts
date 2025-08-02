import {
  PokemonAbilityList,
  PokemonType,
  PokemonLearnableSkillByVersion,
} from '~/graphql/typeGenerated'

export type TActiveType = 'normal' | 'mega' | 'region'

export type TActiveTypeInfo = {
  activeType: TActiveType
  name: string
  pokemonNumber: number
  generation: number
  types: Array<PokemonType>
  isEvolution: boolean
  abilities: Array<PokemonAbilityList>
  isRegion: boolean
  isMega: boolean
  learnableSkills?: Array<PokemonLearnableSkillByVersion>
}
