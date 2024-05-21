import { FC, ReactNode, createContext } from 'react'
import type {
  Pokemon,
  PokemonMega,
  PokemonNormalForm,
  PokemonRegion,
} from '~/graphql/typeGenerated'
import type { IFDetailPokemonInfo } from '~/types/detailInfo.types'

export interface IFDetailProviderProps extends IFDetailPokemonInfo {
  children: ReactNode
}

interface IFDetailProps {
  pokemonBaseInfo?: Pokemon
  megaEvolutions?: Array<PokemonMega>
  regionFormInfo?: Array<PokemonRegion>
  normalForm?: Array<PokemonNormalForm>
}

const DetailContext = createContext<IFDetailProps>({})

const DetailProvider: FC<IFDetailProviderProps> = (props) => {
  const { children, pokemonBaseInfo, megaEvolutions } = props

  const initialValue: IFDetailProps = {
    pokemonBaseInfo,
    megaEvolutions,
  }

  return (
    <DetailContext.Provider value={initialValue}>
      {children}
    </DetailContext.Provider>
  )
}

export { DetailContext, DetailProvider }
