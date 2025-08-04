'use client'

import { ReactNode, createContext } from 'react'
import {
  PokemonLevelUpSkillInfo,
  PokemonMachineSkillInfo,
  PokemonType,
  PokemonVersionGroup,
} from '~/graphql/typeGenerated'

export type TPokemonType = 'default' | 'region' | 'normalForm'

export type PokemonLearnableDataType = {
  versionGroup?: PokemonVersionGroup
  levelUpSkills: Array<PokemonLevelUpSkillInfo>
  machineSkills: Array<PokemonMachineSkillInfo>
}

export type PokemonInfoType = {
  name: string
  types: Array<PokemonType>
  isFormChange?: boolean
  isRegionForm?: boolean
  activeType?: 'region' | 'normalForm'
}

interface IDetailMovesProviderProps {
  pokemonInfo: PokemonInfoType
  pokemonLearnableData: Array<PokemonLearnableDataType>
  formDataLength: number
  children: ReactNode
}

interface IDetailMovesProps {
  pokemonInfo?: PokemonInfoType
  pokemonLearnableData: Array<PokemonLearnableDataType>
  formDataLength: number
}

const DetailMovesContext = createContext<IDetailMovesProps>({
  pokemonLearnableData: [],
  formDataLength: 0,
})

const DetailMovesProvider = ({
  pokemonInfo,
  pokemonLearnableData,
  formDataLength,
  children,
}: IDetailMovesProviderProps) => {
  const initialValue: IDetailMovesProps = {
    pokemonInfo,
    pokemonLearnableData,
    formDataLength,
  }

  return (
    <DetailMovesContext.Provider value={initialValue}>
      {children}
    </DetailMovesContext.Provider>
  )
}

export { DetailMovesContext, DetailMovesProvider }
