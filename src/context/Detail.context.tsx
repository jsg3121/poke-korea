'use client'

import { createContext, ReactNode } from 'react'

import { TActiveType, TActiveTypeInfo } from '~/types/detailContext.type'
import {
  PokemonDetail,
  PokemonGigantamax,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
  VersionGroup,
} from '~/graphql/typeGenerated'

interface DetailProviderProps {
  pokemonBaseInfo: PokemonDetail
  normalForm: Array<PokemonNormalForm>
  megaEvolutionData?: Array<PokemonMegaEvolution>
  regionFormData?: Array<PokemonRegionForm>
  gigantamaxData?: Array<PokemonGigantamax>
  versionGroup?: Array<VersionGroup>
  normalFormImageList: Array<string>
  activeType: TActiveType
  activeIndex: number
  children: ReactNode
}

interface DetailContextValue {
  pokemonBaseInfo?: PokemonDetail
  megaEvolutions?: Array<PokemonMegaEvolution>
  regionFormInfo?: Array<PokemonRegionForm>
  gigantamaxInfo?: Array<PokemonGigantamax>
  normalForm?: Array<PokemonNormalForm>
  activeType: TActiveType
  activeIndex: number
  activeTypeInfo: TActiveTypeInfo
  normalFormImageList: Array<string>
}

const DetailContext = createContext<DetailContextValue>({
  activeType: 'normal',
  activeIndex: 0,
  normalFormImageList: [],
  activeTypeInfo: {
    activeType: 'normal',
    generation: 1,
    isEvolution: false,
    name: '',
    pokemonNumber: 0,
    types: [],
    abilities: [],
    isMega: false,
    isRegion: false,
    isGigantamax: false,
    versionGroupInfo: {},
  },
})

const DetailProvider = ({
  children,
  pokemonBaseInfo,
  normalForm,
  megaEvolutionData,
  regionFormData,
  gigantamaxData,
  versionGroup,
  normalFormImageList,
  activeType,
  activeIndex,
}: DetailProviderProps) => {
  const getTypes = () => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutionData?.[activeIndex]?.types ?? []
      }
      case 'region': {
        return regionFormData?.[activeIndex]?.types ?? []
      }
      default: {
        return (
          normalForm?.[0]?.types?.map((type) => {
            return type
          }) ??
          pokemonBaseInfo.types?.map((type) => {
            return type
          })
        )
      }
    }
  }

  const getAbilities = () => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutionData?.[activeIndex]?.megaEvolutionAbilityList ?? []
      }
      case 'region': {
        return regionFormData?.[activeIndex]?.regionFormAbilityList ?? []
      }
      default: {
        return (
          normalForm?.[0]?.normalFormAbilityList ??
          pokemonBaseInfo.pokemonAbilityList
        )
      }
    }
  }

  const getLearnableSkills = () => {
    switch (activeType) {
      case 'region': {
        return regionFormData?.[activeIndex]?.learnableSkills
      }
      default: {
        return (
          normalForm?.[0]?.learnableSkills ?? pokemonBaseInfo.learnableSkills
        )
      }
    }
  }

  const getVersionInfo = () => {
    switch (activeType) {
      case 'region': {
        return {
          levelUpSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              regionFormData?.[activeIndex]?.learnableSkills
                ?.levelUpVersionGroupId
            )
          }),
          machineSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              regionFormData?.[activeIndex]?.learnableSkills
                ?.machineVersionGroupId
            )
          }),
        }
      }
      default: {
        return {
          levelUpSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              (normalForm?.[0]?.learnableSkills?.levelUpVersionGroupId ??
                pokemonBaseInfo.learnableSkills?.levelUpVersionGroupId)
            )
          }),
          machineSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              (normalForm?.[0]?.learnableSkills?.machineVersionGroupId ??
                pokemonBaseInfo.learnableSkills?.machineVersionGroupId)
            )
          }),
        }
      }
    }
  }

  const types = getTypes()
  const abilities = getAbilities()
  const learnableSkills = getLearnableSkills()
  const versionGroupInfo = getVersionInfo()

  const activeTypeInfo: TActiveTypeInfo = {
    activeType,
    isEvolution: pokemonBaseInfo.isEvolution,
    name: pokemonBaseInfo.name,
    pokemonNumber: pokemonBaseInfo.number,
    generation: pokemonBaseInfo.generation,
    isMega: pokemonBaseInfo.isMegaEvolution ?? false,
    isRegion: pokemonBaseInfo.isRegionForm ?? false,
    isGigantamax: pokemonBaseInfo.isGigantamax ?? false,
    types,
    abilities: abilities ?? [],
    learnableSkills: learnableSkills ?? undefined,
    versionGroupInfo,
  }

  const initialValue: DetailContextValue = {
    pokemonBaseInfo,
    activeType,
    activeIndex,
    normalForm,
    activeTypeInfo,
    megaEvolutions: megaEvolutionData,
    regionFormInfo: regionFormData,
    gigantamaxInfo: gigantamaxData,
    normalFormImageList,
  }

  return (
    <DetailContext.Provider value={initialValue}>
      {children}
    </DetailContext.Provider>
  )
}

export { DetailContext, DetailProvider }
