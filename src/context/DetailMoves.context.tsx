'use client'

import { useSearchParams } from 'next/navigation'
import { ReactNode, createContext } from 'react'
import {
  PokemonDetail,
  PokemonNormalForm,
  PokemonRegionForm,
  PokemonLearnableSkillByVersion,
} from '~/graphql/typeGenerated'

export type TPokemonType = 'default' | 'region' | 'normalForm'

interface IDetailMovesProviderProps {
  pokemonDetail: PokemonDetail
  normalFormData: PokemonNormalForm[]
  regionFormData: PokemonRegionForm[]
  children: ReactNode
}

interface IDetailMovesProps {
  pokemonDetail: PokemonDetail
  normalFormData: PokemonNormalForm[]
  regionFormData: PokemonRegionForm[]
  pokemonType: TPokemonType
  activeIndex: number
  getCurrentLearnableSkills: () =>
    | PokemonLearnableSkillByVersion[]
    | null
    | undefined
  getCurrentPokemonInfo: () => {
    name: string
    imagePath: string
    types: string[]
    maxIndex: number
  }
}

const DetailMovesContext = createContext<IDetailMovesProps>({
  pokemonDetail: {} as PokemonDetail,
  normalFormData: [],
  regionFormData: [],
  pokemonType: 'default',
  activeIndex: 0,
  getCurrentLearnableSkills: () => null,
  getCurrentPokemonInfo: () => ({
    name: '',
    imagePath: '',
    types: [],
    maxIndex: 0,
  }),
})

const DetailMovesProvider = ({
  children,
  pokemonDetail,
  normalFormData,
  regionFormData,
}: IDetailMovesProviderProps) => {
  const routerQuery = useSearchParams()

  const pokemonType =
    (routerQuery.get('pokemonType') as TPokemonType) || 'default'
  const activeIndex = routerQuery.get('activeIndex')
    ? parseInt(routerQuery.get('activeIndex') as string, 10)
    : 0

  const getCurrentLearnableSkills = () => {
    switch (pokemonType) {
      case 'normalForm':
        return normalFormData[activeIndex]?.learnableSkills
      case 'region':
        return regionFormData[activeIndex]?.learnableSkills
      default:
        return pokemonDetail.learnableSkills
    }
  }

  const getCurrentPokemonInfo = () => {
    switch (pokemonType) {
      case 'normalForm':
        return {
          name: normalFormData[activeIndex]?.name || pokemonDetail.name,
          imagePath: normalFormData[activeIndex]?.imagePath || '',
          types: normalFormData[activeIndex]?.types || pokemonDetail.types,
          maxIndex: normalFormData.length - 1,
        }
      case 'region':
        return {
          name: `${regionFormData[activeIndex]?.name || pokemonDetail.name} (${regionFormData[activeIndex]?.region || ''})`,
          imagePath: '',
          types: regionFormData[activeIndex]?.types || pokemonDetail.types,
          maxIndex: regionFormData.length - 1,
        }
      default:
        return {
          name: pokemonDetail.name,
          imagePath: '',
          types: pokemonDetail.types,
          maxIndex: 0,
        }
    }
  }

  const initialValue: IDetailMovesProps = {
    pokemonDetail,
    normalFormData,
    regionFormData,
    pokemonType,
    activeIndex,
    getCurrentLearnableSkills,
    getCurrentPokemonInfo,
  }

  return (
    <DetailMovesContext.Provider value={initialValue}>
      {children}
    </DetailMovesContext.Provider>
  )
}

export { DetailMovesContext, DetailMovesProvider }
