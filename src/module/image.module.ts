// Path 기반 URL 생성

import {
  PokemonMegaEvolution,
  PokemonRegionForm,
  PokemonType,
} from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { TActiveType } from '~/types/detailContext.type'
import { PokemonTypes } from '~/types/pokemonTypes.types'

export type PokemonImageData = {
  imageCode?: string
  types?: Array<PokemonType>
  name?: string
}

type GetImageListParams = {
  activeType: TActiveType
  types?: Array<PokemonType>
  name: string
  normalFormImageList: Array<string>
  megaEvolutions?: Array<PokemonMegaEvolution>
  regionFormInfo?: Array<PokemonRegionForm>
  pokemonNumber?: number
}
type GetImageListFn = (
  params: GetImageListParams,
) => Array<PokemonImageData> | undefined

export const getImageList: GetImageListFn = ({
  activeType,
  name,
  types,
  normalFormImageList,
  megaEvolutions,
  regionFormInfo,
  pokemonNumber,
}) => {
  switch (activeType) {
    case 'mega': {
      const megaImages = megaEvolutions?.map((mega, index) => {
        return {
          imageCode: `1${mega.pokemonId.toString().padStart(3, '0')}${index
            .toString()
            .padStart(2, '0')}`,
          types: mega.types,
          name: mega.name,
        }
      })
      return megaImages
    }
    case 'region': {
      const regionImages = regionFormInfo?.map((region, index) => {
        return {
          imageCode: `2${region.pokemonId.toString().padStart(3, '0')}${index
            .toString()
            .padStart(2, '0')}`,
          types: region.types,
          name: region.name,
        }
      })
      return regionImages
    }
    default: {
      if (normalFormImageList && normalFormImageList.length > 0) {
        const normalFormImages = normalFormImageList?.map((imagePath) => {
          return {
            imageCode: imagePath,
            types: types,
            name: name,
          }
        })
        return normalFormImages
      } else {
        const pokemonData = {
          imageCode: pokemonNumber?.toString() || '',
          types: types,
          name: name,
        }
        return [pokemonData]
      }
    }
  }
}

type GetFormUrlParams = {
  activeType: TActiveType
  activeIndex: number
  pokemonNumber: number
  isShiny: boolean
}
type GetFormUrlFn = (params: GetFormUrlParams) => string

export const getFormUrl: GetFormUrlFn = ({
  activeType,
  activeIndex,
  pokemonNumber,
  isShiny,
}) => {
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''
  const baseUrl = `/detail/${pokemonNumber}`

  if (activeType === 'mega') {
    return activeIndex > 0
      ? `${baseUrl}/mega/${activeIndex}${shinyQuery}`
      : `${baseUrl}/mega${shinyQuery}`
  } else if (activeType === 'region') {
    return activeIndex > 0
      ? `${baseUrl}/region/${activeIndex}${shinyQuery}`
      : `${baseUrl}/region${shinyQuery}`
  } else {
    return activeIndex > 0
      ? `${baseUrl}/form/${activeIndex}${shinyQuery}`
      : `${baseUrl}${shinyQuery}`
  }
}

type GetImageSrcParams = {
  imageCode?: string
  isShiny: boolean
}
type GetImageSrcFn = (params: GetImageSrcParams) => string

export const getImageSrc: GetImageSrcFn = ({ isShiny, imageCode }) => {
  if (!imageCode) return ''
  return isShiny
    ? `${imageMode}/shiny/${imageCode}.webp`
    : `${imageMode}/${imageCode}.webp`
}

type GetAltTextParams = {
  activeType: TActiveType
  item: PokemonImageData
  name: string
  isShiny: boolean
}
type GetAltTextFn = (params: GetAltTextParams) => string

export const getAltText: GetAltTextFn = ({
  activeType,
  item,
  name,
  isShiny,
}) => {
  if (!item) return ''
  const typeText = item.types
    ?.map((type) => PokemonTypes[type as keyof typeof PokemonTypes])
    .join('/')
  return `${typeText} 타입 포켓몬 ${item.name || name}${activeType === 'region' ? ' 리전폼' : ''}${isShiny ? ' 이로치' : ''}의 이미지`
}
