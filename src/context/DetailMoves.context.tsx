'use client'

import { ReactNode, createContext } from 'react'
import {
  LearnableSkillPokemonInfoFragment,
  PokemonLevelUpSkillInfo,
  PokemonMachineSkillInfo,
  PokemonVersionGroup,
} from '~/graphql/typeGenerated'

export type TPokemonType = 'default' | 'region' | 'normalForm'

export type PokemonLearnableDataType = {
  versionGroupt?: PokemonVersionGroup
  levelUpSkills: Array<PokemonLevelUpSkillInfo>
  machineSkills: Array<PokemonMachineSkillInfo>
}

interface IDetailMovesProviderProps {
  pokemonInfo: LearnableSkillPokemonInfoFragment
  pokemonLearnableData: Array<PokemonLearnableDataType>
  children: ReactNode
}

interface IDetailMovesProps {
  pokemonInfo?: LearnableSkillPokemonInfoFragment
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
