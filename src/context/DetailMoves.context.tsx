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
  children: ReactNode
}

interface IDetailMovesProps {
  pokemonInfo?: PokemonInfoType
  pokemonLearnableData: Array<PokemonLearnableDataType>
}

const DetailMovesContext = createContext<IDetailMovesProps>({
  pokemonLearnableData: [],
})

const DetailMovesProvider = ({
  pokemonInfo,
  pokemonLearnableData,
  children,
}: IDetailMovesProviderProps) => {
  const initialValue: IDetailMovesProps = {
    pokemonInfo,
    pokemonLearnableData,
  }

  return (
    <DetailMovesContext.Provider value={initialValue}>
      {children}
    </DetailMovesContext.Provider>
  )
}

export { DetailMovesContext, DetailMovesProvider }
