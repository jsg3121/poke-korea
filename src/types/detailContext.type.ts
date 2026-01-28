import {
  PokemonAbilityList,
  PokemonDetailSkills,
  PokemonType,
  VersionGroup,
} from '~/graphql/typeGenerated'

export type TActiveType = 'normal' | 'mega' | 'region' | 'gigantamax'

export type TVersionGroupInfo = {
  levelUpSkillVersion?: VersionGroup
  machineSkillVersion?: VersionGroup
}

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
  isGigantamax: boolean
  learnableSkills?: PokemonDetailSkills
  versionGroupInfo: TVersionGroupInfo
}
