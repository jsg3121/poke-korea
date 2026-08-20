'use client'

import { ReactNode, createContext } from 'react'
import {
  LearnMethod,
  LearnMethodInfo,
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

/**
 * 습득법 한글 라벨 목록.
 *
 * 서버에서 받아 컨텍스트로 내린다 — 클라이언트 훅으로만 조회하면 SSR HTML에
 * enum 원문(LEVEL_UP)이 들어가고 쿼리 도착 후에야 한글로 바뀐다. 탭은 4종을 항상
 * 노출하므로, 데이터가 없는 습득법도 라벨은 이 목록에서 얻어야 한다.
 */
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
