import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ReactNode, createContext } from 'react'
import {
  PokemonAbilityList,
  PokemonDetail,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
} from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types'

type TActiveType = 'normal' | 'mega' | 'region'

type TActiveTypeInfo = {
  activeType: TActiveType
  name: string
  pokemonNumber: number
  generation: number
  types: Array<string>
  isEvolution: boolean
  abilities: Array<PokemonAbilityList>
  isRegion: boolean
  isMega: boolean
}

export interface IFDetailProviderProps {
  pokemonBaseInfo: PokemonDetail
  megaEvolutions: Array<PokemonMegaEvolution>
  regionFormInfo: Array<PokemonRegionForm>
  normalForm: Array<PokemonNormalForm>
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
  regionFormInfo,
  megaEvolutions,
}: IFDetailProviderProps) => {
  const { query } = useRouter()

  const activeType = query.activeType as TActiveType
  const activeIndex = query.activeIndex
    ? parseInt(query.activeIndex as string, 10)
    : 0
  const isShiny = query.shinyMode === 'shiny'

  const getTypes = () => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutions?.[activeIndex].types?.map((type) => {
          return PokemonTypes[type]
        })
      }
      case 'region': {
        return regionFormInfo?.[activeIndex].types?.map((type) => {
          return PokemonTypes[type]
        })
      }
      default: {
        return (
          normalForm?.[activeIndex]?.types?.map((type) => {
            return PokemonTypes[type]
          }) ??
          pokemonBaseInfo.types?.map((type) => {
            return PokemonTypes[type]
          })
        )
      }
    }
  }

  const getAbilityList = () => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutions?.[activeIndex].megaEvolutionAbilityList
      }
      case 'region': {
        return regionFormInfo?.[activeIndex].regionFormAbilityList
      }
      default: {
        return (
          normalForm?.[activeIndex]?.normalFormAbilityList ??
          pokemonBaseInfo.pokemonAbilityList
        )
      }
    }
  }

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
      abilities,
    }
  }

  const types = getTypes() ?? []
  const abilities = getAbilityList() ?? []

  const activeTypeInfo: TActiveTypeInfo = getActiveTypeInfo()

  const initialValue: IFDetailProps = {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    activeType,
    normalForm,
    activeTypeInfo,
  }

  const title = `No. ${pokemonBaseInfo.number} ${activeType === 'mega' ? '메가' : ''}${pokemonBaseInfo.name} ${activeType === 'region' ? '리전폼' : ''}${isShiny ? '이로치' : ''} | 대한민국 포켓몬의 모든 정보 - 포케 코리아`

  return (
    <>
      <NextSeo
        title={title}
        description={`
          전국 도감번호 : ${pokemonBaseInfo.number} 포켓몬명 : ${pokemonBaseInfo.name} 타입 : [${types.join(', ')}] 등장세대 : ${pokemonBaseInfo.generation}세대
          포켓몬의 자세한 정보를 빠르고 간편하게 확인할 수 있습니다.
        `}
        canonical={`https://poke-korea.com/detail/${pokemonBaseInfo.number}`}
        openGraph={{
          type: 'website',
          url: `https://poke-korea.com/detail/${pokemonBaseInfo.number}`,
          title,
          description: `
            전국 도감번호 : ${pokemonBaseInfo.number} 포켓몬명 : ${pokemonBaseInfo.name} 타입 : [${types.join(', ')}] 등장세대 : ${pokemonBaseInfo.generation}세대
            포케 코리아에서 포켓몬의 자세한 정보를 빠르고 간편하게 확인하세요.
          `,
          images: [
            {
              url: 'https://poke-korea.com/assets/image/ogImage.png',
              width: 1200,
              height: 630,
              alt: 'poke-korea',
              type: 'image/png',
            },
            {
              url: 'https://poke-korea.com/assets/image/kakaoOg.png',
              width: 800,
              height: 800,
              alt: 'poke-korea',
              type: 'image/png',
            },
          ],
          siteName: '포케 코리아',
        }}
      />
      <DetailContext.Provider value={initialValue}>
        {children}
      </DetailContext.Provider>
    </>
  )
}

export { DetailContext, DetailProvider }
