import { useRouter } from 'next/router'
import { FC, ReactNode, createContext } from 'react'
import type {
  Pokemon,
  PokemonMega,
  PokemonNormalForm,
  PokemonRegion,
} from '~/graphql/typeGenerated'
import type { IFDetailPokemonInfo } from '~/types/detailInfo.types'

type TActiveType = 'normal' | 'mega' | 'region'
type TActiveTypeInfo = {
  activeType: TActiveType
  name: string
  pokemonNumber: number
  generation: number
  types: Array<string>
  isEvolution: boolean
}

export interface IFDetailProviderProps extends IFDetailPokemonInfo {
  children: ReactNode
}

// TODO : 각각 상태 정보를 하나로 묶어서 context에서 관리하도록 수정
interface IFDetailProps {
  pokemonBaseInfo?: Pokemon
  megaEvolutions?: Array<PokemonMega>
  regionFormInfo?: Array<PokemonRegion>
  normalForm?: Array<PokemonNormalForm>
  activeType: TActiveType
  activeTypeInfo?: TActiveTypeInfo
}

const DetailContext = createContext<IFDetailProps>({
  activeType: 'normal',
})

const DetailProvider: FC<IFDetailProviderProps> = (props) => {
  const {
    children,
    pokemonBaseInfo,
    normalForm,
    regionFormInfo,
    megaEvolutions,
  } = props
  const { query } = useRouter()

  const activeType = query.activeType as TActiveType
  const activeIndex = parseInt(query.activeIndex as string, 10) ?? 0

  const types = (() => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutions[activeIndex].type
      }
      case 'region': {
        return regionFormInfo[activeIndex].type
      }
      default: {
        return normalForm[activeIndex].type ?? pokemonBaseInfo.type
      }
    }
  })()

  const activeTypeInfo: TActiveTypeInfo = (() => {
    return {
      activeType,
      isEvolution: pokemonBaseInfo.isEvolution,
      name: pokemonBaseInfo.name,
      pokemonNumber: pokemonBaseInfo.number,
      generation: pokemonBaseInfo.generation,
      types,
    }
  })()

  const initialValue: IFDetailProps = {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    activeType,
    normalForm,
    activeTypeInfo,
  }

  return (
    <DetailContext.Provider value={initialValue}>
      {children}
    </DetailContext.Provider>
  )
}

export { DetailContext, DetailProvider }
