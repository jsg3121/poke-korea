'use client'

import { createContext, ReactNode } from 'react'

import {
  LearnMethod,
  LearnMethodInfo,
  PokemonType,
  SkillsByMethod,
  VersionGroup,
} from '~/graphql/typeGenerated'

export type TPokemonType = 'default' | 'region' | 'normalForm'

export type SkillsByMethodType = Array<SkillsByMethod>

export type LearnMethodLabelsType = Array<LearnMethodInfo>

export type PokemonInfoType = {
  name: string
  types: Array<PokemonType>
  isFormChange?: boolean
  isRegionForm?: boolean
  activeType?: 'region' | 'normalForm'
}

interface IDetailMovesProviderProps {
  pokemonInfo: PokemonInfoType
  skillsByMethod: SkillsByMethodType
  formDataLength: number
  versionGroup?: Array<VersionGroup> | null
  normalFormInfo?: {
    name?: string
    imagePath?: string
  }
  currentActiveIndex: number
  currentVersionGroupId?: number
  currentLearnMethod?: LearnMethod
  learnMethodLabels?: LearnMethodLabelsType
  children: ReactNode
}

interface IDetailMovesProps {
  pokemonInfo?: PokemonInfoType
  skillsByMethod?: SkillsByMethodType
  formDataLength: number
  versionGroup?: Array<VersionGroup> | null
  normalFormInfo?: {
    name?: string
    imagePath?: string
  }
  currentActiveIndex: number
  currentVersionGroupId?: number
  currentLearnMethod?: LearnMethod
  learnMethodLabels?: LearnMethodLabelsType
}

const DetailMovesContext = createContext<IDetailMovesProps>({
  formDataLength: 0,
  currentActiveIndex: 0,
})

const DetailMovesProvider = ({
  pokemonInfo,
  skillsByMethod,
  formDataLength,
  normalFormInfo,
  versionGroup,
  currentActiveIndex,
  currentVersionGroupId,
  currentLearnMethod,
  learnMethodLabels,
  children,
}: IDetailMovesProviderProps) => {
  const initialValue: IDetailMovesProps = {
    pokemonInfo,
    skillsByMethod,
    formDataLength,
    normalFormInfo,
    versionGroup,
    currentActiveIndex,
    currentVersionGroupId,
    currentLearnMethod,
    learnMethodLabels,
  }

  return (
    <DetailMovesContext.Provider value={initialValue}>
      {children}
    </DetailMovesContext.Provider>
  )
}

export { DetailMovesContext, DetailMovesProvider }
