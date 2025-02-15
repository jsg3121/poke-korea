import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ReactNode, createContext } from 'react'
import {
  PokemonDetail,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
} from '~/graphql/typeGenerated'
import {
  getPokemonNameByType,
  getSeoCanonicalUrl,
  getSeoDescription,
  getSeoTitle,
} from './module/generateSeoMetaData'
import { TActiveType, TActiveTypeInfo } from './type/detailContext.type'

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
  const router = useRouter()

  const activeType = router.query.activeType as TActiveType
  const activeIndex = router.query.activeIndex
    ? parseInt(router.query.activeIndex as string, 10)
    : 0
  const isShiny = router.query.shinyMode === 'shiny'

  const types = (() => {
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
  })()

  const abilities = (() => {
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
  })()

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

  const pokemonNameByType = getPokemonNameByType({
    activeType,
    megaEvolutionName: megaEvolutionData
      ? megaEvolutionData[activeIndex].name
      : '',
    regionFormPlace: regionFormData ? regionFormData[activeIndex].region : '',
    pokemonBaseInfoName: pokemonBaseInfo.name,
    isShiny,
  })

  const title = getSeoTitle({
    pokemonName: pokemonNameByType,
    pokemonNumber: pokemonBaseInfo.number,
  })

  const description = getSeoDescription({
    generation: pokemonBaseInfo.generation,
    pokemonNumber: pokemonBaseInfo.number,
    pokemonName: pokemonNameByType,
    types,
  })

  const caninicalUrl = getSeoCanonicalUrl({
    activeType,
    activeIndex,
    pokemonNumber: pokemonBaseInfo.number,
    isShiny,
  })

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={caninicalUrl}
        openGraph={{
          type: 'website',
          url: caninicalUrl,
          title,
          description,
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
