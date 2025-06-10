'use client'

import { useSearchParams } from 'next/navigation'
import { ReactNode, createContext } from 'react'
import {
  PokemonDetail,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
} from '~/graphql/typeGenerated'
import { TActiveType, TActiveTypeInfo } from '~/types/detailContext.type'

interface IFDetailProviderProps {
  pokemonBaseInfo: PokemonDetail
  normalForm: Array<PokemonNormalForm>
  megaEvolutionData?: Array<PokemonMegaEvolution>
  regionFormData?: Array<PokemonRegionForm>
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
  },
})

const DetailProvider = ({
  children,
  pokemonBaseInfo,
  normalForm,
  megaEvolutionData,
  regionFormData,
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
  const types = getTypes()
  const abilities = getAbilities()

  const getActiveTypeInfo = () => {
    return {
      activeType,
      isEvolution: pokemonBaseInfo.isEvolution,
      name: pokemonBaseInfo.name,
      pokemonNumber: pokemonBaseInfo.number,
      generation: pokemonBaseInfo.generation,
      isMega: pokemonBaseInfo.isMegaEvolution ?? false,
      isRegion: pokemonBaseInfo.isRegionForm ?? false,
      types,
      abilities: abilities ?? [],
    }
  }

  const activeTypeInfo: TActiveTypeInfo = getActiveTypeInfo()

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
