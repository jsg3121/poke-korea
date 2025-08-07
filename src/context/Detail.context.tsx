'use client'

import { useSearchParams } from 'next/navigation'
import { ReactNode, createContext } from 'react'
import {
  PokemonDetail,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
  VersionGroup,
} from '~/graphql/typeGenerated'
import { TActiveType, TActiveTypeInfo } from '~/types/detailContext.type'

interface IFDetailProviderProps {
  pokemonBaseInfo: PokemonDetail
  normalForm: Array<PokemonNormalForm>
  megaEvolutionData?: Array<PokemonMegaEvolution>
  regionFormData?: Array<PokemonRegionForm>
  versionGroup?: Array<VersionGroup>
  children: ReactNode
}

interface IFDetailProps {
  pokemonBaseInfo?: PokemonDetail
  megaEvolutions?: Array<PokemonMegaEvolution>
  regionFormInfo?: Array<PokemonRegionForm>
  normalForm?: Array<PokemonNormalForm>
  activeType: TActiveType
  activeTypeInfo: TActiveTypeInfo
}

const DetailContext = createContext<IFDetailProps>({
  activeType: 'normal',
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
    versionGroupInfo: {},
  },
})

const DetailProvider = ({
  children,
  pokemonBaseInfo,
  normalForm,
  megaEvolutionData,
  regionFormData,
  versionGroup,
}: IFDetailProviderProps) => {
  const routerQuery = useSearchParams()

  const activeType = routerQuery.get('activeType') as TActiveType
  const activeIndex = routerQuery.get('activeIndex')
    ? parseInt(routerQuery.get('activeIndex') as string, 10)
    : 0

  const getTypes = () => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutionData?.[activeIndex].types ?? []
      }
      case 'region': {
        return regionFormData?.[activeIndex].types ?? []
      }
      default: {
        return (
          normalForm?.[activeIndex]?.types?.map((type) => {
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
        return megaEvolutionData?.[activeIndex].megaEvolutionAbilityList ?? []
      }
      case 'region': {
        return regionFormData?.[activeIndex].regionFormAbilityList ?? []
      }
      default: {
        return (
          normalForm?.[activeIndex]?.normalFormAbilityList ??
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
      case 'normal': {
        return (
          normalForm?.[activeIndex]?.learnableSkills ||
          pokemonBaseInfo.learnableSkills
        )
      }
      default: {
        return pokemonBaseInfo.learnableSkills
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
              regionFormData?.[activeIndex].learnableSkills
                ?.levelUpVersionGroupId
            )
          }),
          machineSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              regionFormData?.[activeIndex].learnableSkills
                ?.machineVersionGroupId
            )
          }),
        }
      }
      case 'normal': {
        return {
          levelUpSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              (normalForm?.[activeIndex]?.learnableSkills
                ?.levelUpVersionGroupId ??
                pokemonBaseInfo.learnableSkills?.levelUpVersionGroupId)
            )
          }),
          machineSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              (normalForm?.[activeIndex]?.learnableSkills
                ?.machineVersionGroupId ||
                pokemonBaseInfo.learnableSkills?.machineVersionGroupId)
            )
          }),
        }
      }
      default: {
        return {
          levelUpSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              pokemonBaseInfo.learnableSkills?.levelUpVersionGroupId
            )
          }),
          machineSkillVersion: versionGroup?.find((version) => {
            return (
              version.versionGroupId ===
              pokemonBaseInfo.learnableSkills?.machineVersionGroupId
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
    types,
    abilities: abilities ?? [],
    learnableSkills: learnableSkills ?? undefined,
    versionGroupInfo,
  }

  const initialValue: IFDetailProps = {
    pokemonBaseInfo,
    activeType,
    normalForm,
    activeTypeInfo,
    megaEvolutions: megaEvolutionData,
    regionFormInfo: regionFormData,
  }

  return (
    <DetailContext.Provider value={initialValue}>
      {children}
    </DetailContext.Provider>
  )
}

export { DetailContext, DetailProvider }
