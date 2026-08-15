'use client'

import { ReactNode, createContext } from 'react'
import {
  LearnMethod,
  PokemonType,
  SkillsByMethod,
  VersionGroup,
} from '~/graphql/typeGenerated'

export type TPokemonType = 'default' | 'region' | 'normalForm'

/**
 * 습득법별 기술 그룹. 백엔드가 displayOrder 순으로 정렬해 내려준다.
 *
 * 기존엔 `{ levelUpSkills, machineSkills }` 2필드 고정이라 알 기술·기술 가르침 등을
 * 담을 자리가 없었다. 배열로 받으면 습득법이 늘어도 화면이 자동으로 따라간다.
 */
export type SkillsByMethodType = Array<SkillsByMethod>

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
  }

  return (
    <DetailMovesContext.Provider value={initialValue}>
      {children}
    </DetailMovesContext.Provider>
  )
}

export { DetailMovesContext, DetailMovesProvider }
