import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { TActiveType } from '../types/detailContext.type'

type GetPokemonNameByTypeParams = {
  activeType: TActiveType
  pokemonBaseInfoName: string
  megaEvolutionName: string
  regionFormPlace: string
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
}

type GetSeoDescriptionFn = (params: GetSeoDescriptionParams) => string

type GetSeoCanonicalUrlParams = {
  activeType: TActiveType
  activeIndex: number
  pokemonNumber: number
  isShiny: boolean
}
type GetSeoCanonicalUrlFn = (params: GetSeoCanonicalUrlParams) => string

/**
 * @description 타입별 포켓몬 명
 * - 기본 : 도감번호 + 포켓몬 명 `No. 6 리자몽`
 * - 메가진화 : 도감번호 + 메가진화 포켓몬 명 `No. 6 메가리자몽X `
 * - 리전폼 : 도감번호 + 포켓몬 명 + 리전폼 지역 + 리전폼 `No. 19 꼬렛 알로라 리전폼`
 * - 이로치 : 각 케이스별 포켓몬 이름 + 이로치 `No. 19 꼬렛 알로라 리전폼 이로치`
 *
 * @param activeType 현재 포켓몬 모습
 * @param pokemonBaseInfoName 포켓몬 기본상태 이름
 * @param megaEvolutionName 포켓몬 메가진화상태 이름
 * @param regionFormPlace 리전폼 포켓몬 지역
 * @param isShiny 이로치 여부
 */
export const getPokemonNameByType: GetPokemonNameByTypeFn = ({
  activeType,
  pokemonBaseInfoName,
  megaEvolutionName,
  regionFormPlace,
  isShiny,
}) => {
  const shinyText = isShiny ? ' 이로치' : ''

  switch (activeType) {
    case 'mega': {
      return `${megaEvolutionName}${shinyText}`
    }
    case 'region': {
      const regionFormText = `${pokemonBaseInfoName} ${regionFormPlace} 리전폼`
      return `${regionFormText}${shinyText}`
    }
    default: {
      return `${pokemonBaseInfoName}${shinyText}`
    }
  }
}

/**
 * @description 포켓몬 사이트 메타태그 타이틀
 * @param pokemonName 타입별 변환된 포켓몬 이름
 * @param pokemonNumber 포켓몬 도감번호
 */
export const getSeoTitle: GetSeoTitleFn = ({ pokemonName, pokemonNumber }) => {
  const pokemonNumberText = `No. ${pokemonNumber}`
  const footerText = '| 대한민국 포켓몬의 모든 정보 - 포케 코리아'

  return `${pokemonNumberText} ${pokemonName} ${footerText}`
}

/**
 * @description 포켓몬 사이트 메타태그 디스크립션
 * @param pokemonNumber 포켓몬 도감 번호
 * @param pokemonName 타입별 변환된 포켓몬 이름
 * @param generation 포켓몬 등장 세대
 * @param types 포켓몬 타입
 */
export const getSeoDescription: GetSeoDescriptionFn = ({
  pokemonNumber,
  pokemonName,
  generation,
  types,
}) => {
  const typeList = types
    .map((type) => {
      return PokemonTypes[type]
    })
    .join(', ')

  return `전국 도감번호 : ${pokemonNumber} | 포켓몬명 : ${pokemonName} | 타입 : [${typeList}] | 등장세대 : ${generation}세대 | 포켓몬의 자세한 정보를 빠르고 간편하게 포케코리아에서 바로 확인해보세요.`
}

/**
 * @description 포켓몬 페이지 캐노니컬 url을 반환
 * @param activeType 활성화된 포켓몬 모습
 * @param pokemonNumber  포켓몬 도감 번호
 * @param isShiny 이로치 활성화 상태
 */
export const getSeoCanonicalUrl: GetSeoCanonicalUrlFn = ({
  activeType,
  activeIndex,
  pokemonNumber,
  isShiny,
}) => {
  const isNoramlActive = activeType === 'normal' || activeType === undefined
  const isFirstActiveIndex = activeIndex === 0 || activeIndex === undefined

  const baseUrl = `https://poke-korea.com/detail/${pokemonNumber}`
  const activeTypeQuery = isNoramlActive
    ? undefined
    : `activeType=${activeType}`
  const activeIndexQuery = isFirstActiveIndex
    ? undefined
    : `activeIndex=${activeIndex}`
  const shinyQuery = isShiny ? 'shinyMode=shiny' : undefined

  const queryParams = [activeTypeQuery, activeIndexQuery, shinyQuery]
    .filter((param) => param !== undefined)
    .join('&')

  return queryParams ? `${baseUrl}?${queryParams}` : baseUrl
}
