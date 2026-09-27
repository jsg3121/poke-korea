import { PokemonTypes } from '~/types/pokemonTypes.types'
import {
  PokemonDetail,
  PokemonGigantamax,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
  PokemonStats,
  PokemonType,
} from '~/graphql/typeGenerated'

import { TActiveType } from '../types/detailContext.type'

type GetPokemonNameByTypeParams = {
  activeType: TActiveType
  pokemonBaseInfoName: string
  megaEvolutionName: string
  regionFormName: string
  normalFormName: string
  gigantamaxName: string
  isShiny: boolean
}
type GetPokemonNameByTypeFn = (params: GetPokemonNameByTypeParams) => string

type GetSeoTitleParams = {
  pokemonNumber: number
  pokemonName: string
}
type GetSeoTitleFn = (params: GetSeoTitleParams) => string

type GetSeoDescriptionParams = {
  pokemonNumber: number
  pokemonName: string
  generation: number
  types: Array<PokemonType>
  activeType: TActiveType
  isShiny: boolean
  genus?: string | null
  height?: number | null
  weight?: number | null
}

type GetSeoDescriptionFn = (params: GetSeoDescriptionParams) => string

type GetSeoCanonicalUrlParams = {
  activeType: TActiveType
  activeIndex: number
  pokemonNumber: number
  isShiny: boolean
}
type GetSeoCanonicalUrlFn = (params: GetSeoCanonicalUrlParams) => string

interface PokemonDataParams {
  pokemonDetail: PokemonDetail
  activeType: TActiveType
  activeIndex: number
  normalForm?: PokemonNormalForm[]
  megaEvolutionData?: PokemonMegaEvolution[]
  regionFormData?: PokemonRegionForm[]
}

type GetPokemonNameFn = (params: PokemonDataParams) => string
type GetPokemonTypesFn = (params: PokemonDataParams) => PokemonType[]
type GetPokemonStatsFn = (
  params: PokemonDataParams,
) => PokemonStats | undefined | null
type GetPokemonSizeFn = (
  params: PokemonDataParams & {
    gigantamaxData?: PokemonGigantamax[]
  },
) => { height?: number | null; weight?: number | null }

/**
 * - 기본 : 도감번호 + 포켓몬 명 `No. 6 리자몽`
 * @param activeType 현재 포켓몬 모습
 * @param pokemonBaseInfoName 포켓몬 기본상태 이름
 * @param megaEvolutionName 포켓몬 메가진화상태 이름
 * @param regionFormName 리전폼 표시명(지역 포함)
 * @param normalFormName 노말폼 표시명(종명 포함). 폼이 없으면 빈 문자열
 * @param isShiny 이로치 여부
 */
export const getPokemonNameByType: GetPokemonNameByTypeFn = ({
  activeType,
  pokemonBaseInfoName,
  megaEvolutionName,
  regionFormName,
  normalFormName,
  gigantamaxName,
  isShiny,
}) => {
  const shinyText = isShiny ? ' 이로치' : ''

  switch (activeType) {
    case 'mega': {
      return `${megaEvolutionName}${shinyText}`
    }
    case 'region': {
      return `${regionFormName || pokemonBaseInfoName}${shinyText}`
    }
    case 'gigantamax': {
      return `${gigantamaxName}${shinyText}`
    }
    default: {
      return `${normalFormName || pokemonBaseInfoName}${shinyText}`
    }
  }
}

/**
 */
export const getSeoTitle: GetSeoTitleFn = ({ pokemonName, pokemonNumber }) => {
  return `No. ${pokemonNumber} ${pokemonName}`
}

const getDetailFormKeyword = (
  activeType: TActiveType,
  isShiny: boolean,
): string => {
  if (isShiny) return '색이 다른 모습'
  if (activeType === 'mega') return '강화된 종족값'
  if (activeType === 'gigantamax') return '거다이맥스 형태'
  if (activeType === 'region') return '리전 한정 모습'
  return '진화·종족값'
}

const josaWaGwa = (word: string): string => {
  const last = word.charCodeAt(word.length - 1)
  const isHangul = last >= 0xac00 && last <= 0xd7a3
  if (!isHangul) return '와'
  return (last - 0xac00) % 28 === 0 ? '와' : '과'
}

/**
 * - 네이버 80자 가이드라인 충족
 * @param pokemonNumber 포켓몬 도감 번호
 * @param pokemonName 타입별 변환된 포켓몬 이름 (이미 폼/이로치 정보 포함)
 * @param generation 포켓몬 등장 세대
 * @param types 포켓몬 타입
 * @param activeType 현재 활성 폼 (mega/region/gigantamax/normal)
 * @param isShiny 이로치 여부
 * @param genus 분류
 * @param height 활성 폼의 키(데시미터)
 * @param weight 활성 폼의 몸무게(헥토그램)
 */
export const getSeoDescription: GetSeoDescriptionFn = ({
  pokemonNumber,
  pokemonName,
  generation,
  types,
  activeType,
  isShiny,
  genus,
  height,
  weight,
}) => {
  const typeList = types.map((type) => PokemonTypes[type]).join('·')
  const formKeyword = getDetailFormKeyword(activeType, isShiny)

  const specParts = [
    genus,
    height !== null && height !== undefined
      ? `키 ${(height / 10).toFixed(1)}m`
      : null,
    weight !== null && weight !== undefined
      ? `몸무게 ${(weight / 10).toFixed(1)}kg`
      : null,
  ].filter(Boolean)

  const specText = specParts.length > 0 ? `${specParts.join(', ')}. ` : ''

  return `${pokemonName} (No. ${pokemonNumber}, ${generation}세대, ${typeList} 타입). ${specText}${formKeyword}${josaWaGwa(formKeyword)} 기술·특성 정보.`
}

/**
 * URL 패턴:
 */
export const getSeoCanonicalUrl: GetSeoCanonicalUrlFn = ({
  activeType,
  activeIndex,
  pokemonNumber,
  isShiny,
}) => {
  const baseUrl = `https://poke-korea.com/detail/${pokemonNumber}`
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''

  if (activeType === 'mega') {
    const path =
      activeIndex > 0 ? `${baseUrl}/mega/${activeIndex}` : `${baseUrl}/mega`
    return `${path}${shinyQuery}`
  }

  if (activeType === 'region') {
    const path =
      activeIndex > 0 ? `${baseUrl}/region/${activeIndex}` : `${baseUrl}/region`
    return `${path}${shinyQuery}`
  }

  if (activeType === 'gigantamax') {
    const path =
      activeIndex > 0
        ? `${baseUrl}/gigantamax/${activeIndex}`
        : `${baseUrl}/gigantamax`
    return `${path}${shinyQuery}`
  }

  if (activeIndex > 0) {
    return `${baseUrl}/form/${activeIndex}${shinyQuery}`
  }

  return `${baseUrl}${shinyQuery}`
}

/**
 */
export const getPokemonName: GetPokemonNameFn = ({
  pokemonDetail,
  activeType,
  activeIndex,
  normalForm,
  megaEvolutionData,
  regionFormData,
}) => {
  switch (activeType) {
    case 'mega':
      return megaEvolutionData?.[activeIndex]?.name || pokemonDetail.name
    case 'region':
      return regionFormData?.[activeIndex]?.name || pokemonDetail.name
    default:
      return normalForm?.[0]?.name || pokemonDetail.name
  }
}

/**
 */
export const getPokemonTypes: GetPokemonTypesFn = ({
  pokemonDetail,
  activeType,
  activeIndex,
  normalForm,
  megaEvolutionData,
  regionFormData,
}) => {
  switch (activeType) {
    case 'mega':
      return megaEvolutionData?.[activeIndex]?.types || pokemonDetail.types
    case 'region':
      return regionFormData?.[activeIndex]?.types || pokemonDetail.types
    case 'gigantamax':
      return pokemonDetail.types
    default:
      return normalForm?.[0]?.types || pokemonDetail.types
  }
}

export const getPokemonSize: GetPokemonSizeFn = ({
  pokemonDetail,
  activeType,
  activeIndex,
  normalForm,
  megaEvolutionData,
  regionFormData,
  gigantamaxData,
}) => {
  switch (activeType) {
    case 'mega': {
      const form = megaEvolutionData?.[activeIndex]
      return { height: form?.height, weight: form?.weight }
    }
    case 'region': {
      const form = regionFormData?.[activeIndex]
      return form
        ? { height: form.height, weight: form.weight }
        : { height: pokemonDetail.height, weight: pokemonDetail.weight }
    }
    case 'gigantamax': {
      const form = gigantamaxData?.[activeIndex]
      return { height: form?.height, weight: form?.weight }
    }
    default: {
      const form = normalForm?.[0]
      return form
        ? { height: form.height, weight: form.weight }
        : { height: pokemonDetail.height, weight: pokemonDetail.weight }
    }
  }
}

/**
 */
export const getPokemonStats: GetPokemonStatsFn = ({
  pokemonDetail,
  activeType,
  activeIndex,
  normalForm,
  megaEvolutionData,
  regionFormData,
}) => {
  switch (activeType) {
    case 'mega':
      return megaEvolutionData?.[activeIndex]?.megaEvolutionStats
    case 'region':
      return (
        regionFormData?.[activeIndex]?.regionFormStats ||
        pokemonDetail.pokemonStats
      )
    case 'gigantamax':
      return pokemonDetail.pokemonStats
    default:
      return normalForm?.[0]?.normalFormStats || pokemonDetail.pokemonStats
  }
}
