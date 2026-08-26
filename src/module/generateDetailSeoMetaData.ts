import {
  PokemonDetail,
  PokemonGigantamax,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
  PokemonStats,
  PokemonType,
} from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { TActiveType } from '../types/detailContext.type'

type GetPokemonNameByTypeParams = {
  activeType: TActiveType
  pokemonBaseInfoName: string
  megaEvolutionName: string
  regionFormPlace: string
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
  /** 분류(예: "씨앗포켓몬"). 폼과 무관한 종 단위 값 */
  genus?: string | null
  /** 활성 폼의 키(데시미터) */
  height?: number | null
  /** 활성 폼의 몸무게(헥토그램) */
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

// JSON-LD와 메타데이터에서 공통으로 사용할 데이터 구조
interface PokemonDataParams {
  pokemonDetail: PokemonDetail
  activeType: TActiveType
  activeIndex: number
  normalForm?: PokemonNormalForm[]
  megaEvolutionData?: PokemonMegaEvolution[]
  regionFormData?: PokemonRegionForm[]
}

// 공통 함수들
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
  gigantamaxName,
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
    case 'gigantamax': {
      return `${gigantamaxName}${shinyText}`
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
  // 브랜드 접미사는 layout의 title.template(`%s - 포케 코리아`)이 붙인다.
  // 여기서 접미사를 붙이면 이중 접미사가 되므로 페이지명(No.N 이름)만 반환한다.
  return `No. ${pokemonNumber} ${pokemonName}`
}

/**
 * @description 활성 폼/이로치 여부에 따른 description 첨가 키워드
 * - 메가/거다이맥스: 강화된 종족값 강조 (검색자 의도: "메가 ○○ 스탯")
 * - 리전: 리전 한정 모습 강조 (검색자 의도: "○○ 알로라 폼")
 * - 이로치: 색이 다른 모습 명시 (검색자 의도: "○○ 이로치")
 * - 기본: 진화 정보 강조
 *
 * 호출 측에서 isShiny와 activeType이 둘 다 활성일 수 있으므로
 * 가장 검색 가치가 높은 키워드 1개만 선택해 description 길이를 80자 이내로 유지한다.
 */
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

/**
 * 앞말의 받침 유무로 "과/와"를 고른다.
 * 한글 음절(가~힣)은 (코드 - 0xAC00) % 28 이 0이면 받침이 없다.
 * 한글이 아니면(영문·숫자 등) 받침 없는 것으로 보고 "와"를 쓴다.
 */
const josaWaGwa = (word: string): string => {
  const last = word.charCodeAt(word.length - 1)
  const isHangul = last >= 0xac00 && last <= 0xd7a3
  if (!isHangul) return '와'
  return (last - 0xac00) % 28 === 0 ? '와' : '과'
}

/**
 * @description 포켓몬 사이트 메타태그 디스크립션
 * - 네이버 80자 가이드라인 충족
 * - 라벨식 나열("도감번호 : XXX | 포켓몬명 : XXX") 대신 자연어 패턴 적용
 * - 폼/이로치별로 자연어 키워드를 다양화하여 boilerplate 회피
 *
 * **제원(분류·키·몸무게)을 넣는 이유(1.58.0):** 기존 뒷부분은 모든 포켓몬에
 * 동일한 문구("기술, 특성 정보를 포케 코리아에서 확인")라 정보량이 0이었다.
 * 실제 값으로 바꾸면 스니펫이 고유해지고, 폼마다 키·몸무게가 달라 메가·
 * 거다이맥스 description이 형용사 하나가 아니라 수치로 차별화된다.
 * 경쟁 사이트(Pokémon Wiki)도 description에 같은 항목을 노출한다.
 *
 * 값이 없으면 해당 조각을 생략한다 — "불명"을 스니펫에 노출하지 않는다.
 *
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
 * @description 포켓몬 페이지 캐노니컬 url을 반환 (Path 기반)
 * @param activeType 활성화된 포켓몬 모습
 * @param activeIndex 활성화된 폼 인덱스
 * @param pokemonNumber 포켓몬 도감 번호
 * @param isShiny 이로치 활성화 상태
 *
 * URL 패턴:
 * - 기본: /detail/{number}
 * - 기본폼 (폼체인지): /detail/{number}/form/{index}
 * - 메가진화: /detail/{number}/mega 또는 /detail/{number}/mega/{index}
 * - 리전폼: /detail/{number}/region 또는 /detail/{number}/region/{index}
 * - 이로치: ?shinyMode=shiny (쿼리 파라미터로 유지)
 */
export const getSeoCanonicalUrl: GetSeoCanonicalUrlFn = ({
  activeType,
  activeIndex,
  pokemonNumber,
  isShiny,
}) => {
  const baseUrl = `https://poke-korea.com/detail/${pokemonNumber}`
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''

  // 메가진화
  if (activeType === 'mega') {
    const path =
      activeIndex > 0 ? `${baseUrl}/mega/${activeIndex}` : `${baseUrl}/mega`
    return `${path}${shinyQuery}`
  }

  // 리전폼
  if (activeType === 'region') {
    const path =
      activeIndex > 0 ? `${baseUrl}/region/${activeIndex}` : `${baseUrl}/region`
    return `${path}${shinyQuery}`
  }

  // 거다이맥스
  if (activeType === 'gigantamax') {
    const path =
      activeIndex > 0
        ? `${baseUrl}/gigantamax/${activeIndex}`
        : `${baseUrl}/gigantamax`
    return `${path}${shinyQuery}`
  }

  // 기본폼 (폼체인지가 있는 경우 activeIndex > 0이면 Path 기반 URL 사용)
  if (activeIndex > 0) {
    return `${baseUrl}/form/${activeIndex}${shinyQuery}`
  }

  // 기본폼
  return `${baseUrl}${shinyQuery}`
}

/**
 * @description 현재 활성화된 포켓몬의 이름을 반환 (공통 함수)
 * @param params 포켓몬 데이터 파라미터
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
      return `${pokemonDetail.name} ${regionFormData?.[activeIndex]?.region}의 모습`
    default:
      return normalForm?.[activeIndex]?.name || pokemonDetail.name
  }
}

/**
 * @description 현재 활성화된 포켓몬의 타입을 반환 (공통 함수)
 * @param params 포켓몬 데이터 파라미터
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
      // 거다이맥스는 타입이 변경되지 않으므로 기본 포켓몬 타입 사용
      return pokemonDetail.types
    default:
      return normalForm?.[activeIndex]?.types || pokemonDetail.types
  }
}

/**
 * @description 현재 활성화된 폼의 키·몸무게를 반환 (공통 함수, 1.58.0)
 *
 * 컨테이너의 getActiveFormInfo와 같은 선택 기준을 쓴다. 폼 객체가 있으면
 * 그 값을 그대로(null이어도) 반환하고, 폼 자체가 없을 때만 원종으로 폴백한다
 * — ??로 폴백하면 값이 공식적으로 불명인 폼에 원종 수치가 붙는다.
 * 메가·거다이맥스는 원종 폴백을 두지 않는다(원종 크기는 잘못된 정보).
 */
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
      // normalForm은 fetchNormalFormData(id, activeIndex)가 이미 해당 인덱스
      // 하나만 담아 오므로 [0]으로 읽는다. [activeIndex]로 읽으면 index>0에서
      // undefined가 되어 원종 값으로 잘못 폴백된다(컨테이너 getActiveFormInfo와 동일).
      const form = normalForm?.[0]
      return form
        ? { height: form.height, weight: form.weight }
        : { height: pokemonDetail.height, weight: pokemonDetail.weight }
    }
  }
}

/**
 * @description 현재 활성화된 포켓몬의 능력치를 반환 (공통 함수)
 * @param params 포켓몬 데이터 파라미터
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
      // 거다이맥스는 스탯이 변경되지 않으므로 기본 포켓몬 스탯 사용
      return pokemonDetail.pokemonStats
    default:
      return (
        normalForm?.[activeIndex]?.normalFormStats || pokemonDetail.pokemonStats
      )
  }
}
