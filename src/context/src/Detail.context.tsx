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

export interface IFDetailProviderProps extends IFDetailPokemonInfo {
  children: ReactNode
}

interface IFDetailProps {
  pokemonBaseInfo?: Pokemon
  megaEvolutions?: Array<PokemonMega>
  regionFormInfo?: Array<PokemonRegion>
  normalForm?: Array<PokemonNormalForm>
  activeType: TActiveType
}

const DetailContext = createContext<IFDetailProps>({
  activeType: 'normal',
})

const DetailProvider: FC<IFDetailProviderProps> = (props) => {
  const { children, pokemonBaseInfo, normalForm, megaEvolutions } = props
  const { query } = useRouter()

  const activeType = query.activeType as TActiveType

  const initialValue: IFDetailProps = {
    pokemonBaseInfo,
    megaEvolutions,
    activeType,
    normalForm,
  }

  return (
    <DetailContext.Provider value={initialValue}>
      {children}
    </DetailContext.Provider>
  )
}

export { DetailContext, DetailProvider }
