'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

import {
  PokemonType,
  SearchPokemonFormsWithTypesQuery,
} from '~/graphql/typeGenerated'

export type SelectedPokemon =
  SearchPokemonFormsWithTypesQuery['searchPokemonWithAllForms'][number]

export interface TypeEffectivenessProviderProps {
  children: ReactNode
}

interface TypeEffectivenessContextValue {
  selectTypeList: Array<PokemonType>
  selectedPokemon: SelectedPokemon | null
  isMaxSelectType: boolean
  handleChangeTypes: (selectType: PokemonType) => void
  handleSelectPokemon: (pokemon: SelectedPokemon) => void
  handleResetSelectTypes: () => void
}

const TypeEffectivenessContext =
  createContext<TypeEffectivenessContextValue | null>(null)

const TypeEffectivenessProvider = ({
  children,
}: TypeEffectivenessProviderProps) => {
  const [selectTypeList, setSelectTypeList] = useState<Array<PokemonType>>([])
  const [selectedPokemon, setSelectedPokemon] =
    useState<SelectedPokemon | null>(null)

  const handleResetSelectTypes = () => {
    setSelectTypeList([])
    setSelectedPokemon(null)
  }

  const handleChangeTypes = (selectType: PokemonType) => {
    if (selectedPokemon !== null) {
      if (selectTypeList.includes(selectType)) {
        handleResetSelectTypes()
      }
      return
    }

    setSelectTypeList((prev) => {
      if (prev.includes(selectType)) {
        return prev.filter((type) => type !== selectType)
      } else {
        return [...prev, selectType]
      }
    })
  }

  const handleSelectPokemon = (pokemon: SelectedPokemon) => {
    setSelectTypeList([...pokemon.types])
    setSelectedPokemon(pokemon)
  }

  const isMaxSelectType = selectTypeList.length === 2

  const initialValue: TypeEffectivenessContextValue = {
    isMaxSelectType,
    selectTypeList,
    selectedPokemon,
    handleChangeTypes,
    handleSelectPokemon,
    handleResetSelectTypes,
  }

  return (
    <TypeEffectivenessContext.Provider value={initialValue}>
      {children}
    </TypeEffectivenessContext.Provider>
  )
}

export const useTypeEffectiveness = () => {
  const context = useContext(TypeEffectivenessContext)
  if (!context) {
    throw new Error(
      'useTypeEffectiveness는 TypeEffectivenessProvider 안에서만 쓸 수 있습니다',
    )
  }
  return context
}

export { TypeEffectivenessProvider }
