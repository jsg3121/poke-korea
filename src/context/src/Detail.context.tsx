import { NextSeo } from 'next-seo'
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
type TAbilityType = {
  name: string
  description: string
  isHidden: boolean
}
type TActiveTypeInfo = {
  activeType: TActiveType
  name: string
  pokemonNumber: number
  generation: number
  types: Array<string>
  isEvolution: boolean
  abilities: Array<TAbilityType>
  isRegion: boolean
  isMega: boolean
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
  const activeIndex = query.activeIndex
    ? parseInt(query.activeIndex as string, 10)
    : 0
  const isShiny = query.shinyMode === 'shiny'

  // TODO: 익명함수 형태로 사용된 부분 함수로 분리해서 구분하기
  const types = (() => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutions[activeIndex].type
      }
      case 'region': {
        return regionFormInfo[activeIndex].type
      }
      default: {
        return normalForm[activeIndex]?.type ?? pokemonBaseInfo.type
      }
    }
  })()

  const abilities = (() => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutions[activeIndex].abilities
      }
      case 'region': {
        return regionFormInfo[activeIndex].abilities
      }
      default: {
        return normalForm[activeIndex]?.abilities ?? pokemonBaseInfo.abilities
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
      isMega: pokemonBaseInfo.isMega ?? false,
      isRegion: pokemonBaseInfo.isRegion ?? false,
      types,
      abilities,
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
