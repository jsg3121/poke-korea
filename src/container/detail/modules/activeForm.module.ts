import {
  PokemonDetail,
  PokemonGigantamax,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
  PokemonStats,
} from '~/graphql/typeGenerated'
import { TActiveType } from '~/types/detailContext.type'

/**
 * 활성 폼(기본/메가/리전/거다이맥스)에 따른 표시 이름·스탯 선택.
 * 기존 데/모 DetailSummary 컨테이너에 중복돼 있던 getPokemonInfo 로직을
 * 반응형 단일 컨테이너(DetailHero·DetailStats)가 공유하도록 모듈로 이관했다.
 */

interface ActiveFormArgs {
  pokemonBaseInfo?: PokemonDetail
  megaEvolutions?: Array<PokemonMegaEvolution>
  regionFormInfo?: Array<PokemonRegionForm>
  gigantamaxInfo?: Array<PokemonGigantamax>
  normalForm?: Array<PokemonNormalForm>
  activeType: TActiveType
  activeIndex: number
}

interface ActiveFormInfo {
  name: string
  stats?: PokemonStats
  /** 활성 폼의 키(데시미터). 폼마다 값이 다르므로 스탯과 같은 기준으로 선택한다 */
  height?: number | null
  /** 활성 폼의 몸무게(헥토그램) */
  weight?: number | null
}

export const getActiveFormInfo = ({
  pokemonBaseInfo,
  megaEvolutions,
  regionFormInfo,
  gigantamaxInfo,
  normalForm,
  activeType,
  activeIndex,
}: ActiveFormArgs): ActiveFormInfo => {
  switch (activeType) {
    case 'mega': {
      const form = megaEvolutions?.[activeIndex]
      return {
        name: form?.name ?? '',
        stats: form?.megaEvolutionStats ?? undefined,
        // 메가·거다이맥스는 원종 폴백을 두지 않는다 — 원종 크기를 대신 보여주면
        // 잘못된 정보가 된다(메가이상해꽃 2.4m를 2.0m로 표시하는 셈).
        height: form?.height,
        weight: form?.weight,
      }
    }
    case 'region': {
      const form = regionFormInfo?.[activeIndex]
      return {
        name: `${pokemonBaseInfo?.name} ${form?.region}의 모습 ${form?.name && `(${form?.name})`}`,
        stats: form?.regionFormStats ?? pokemonBaseInfo?.pokemonStats,
        // 폼 객체가 있으면 그 값을 그대로 쓴다(null이어도). ??로 폴백하면 값이
        // 공식적으로 불명인 폼에 원종 수치가 잘못 표시된다(무한다이맥스 사례).
        height: form ? form.height : pokemonBaseInfo?.height,
        weight: form ? form.weight : pokemonBaseInfo?.weight,
      }
    }
    case 'gigantamax': {
      const form = gigantamaxInfo?.[activeIndex]
      return {
        name: form?.name ?? '',
        stats: pokemonBaseInfo?.pokemonStats,
        // mega와 동일하게 원종 폴백 없음
        height: form?.height,
        weight: form?.weight,
      }
    }
    default: {
      const form = normalForm?.[0]
      return {
        name: form?.name.replace('_', ' ') ?? pokemonBaseInfo?.name ?? '',
        stats: form?.normalFormStats ?? pokemonBaseInfo?.pokemonStats,
        // region과 동일 — 폼이 있으면 null도 그대로 전달해 "불명"으로 표시되게 한다
        height: form ? form.height : pokemonBaseInfo?.height,
        weight: form ? form.weight : pokemonBaseInfo?.weight,
      }
    }
  }
}

/**
 * 현재 폼 상태의 기준 경로(쿼리 제외). 이로치 토글·폼 칩이 공유한다
 * (기존 ShinySwitch getBasePath 이관 — activeIndex > 0이면 Path 기반 URL).
 */
export const getFormBasePath = ({
  pokemonNumber,
  activeType,
  activeIndex,
}: {
  pokemonNumber: number
  activeType: TActiveType
  activeIndex: number
}): string => {
  const baseUrl = `/detail/${pokemonNumber}`
  if (activeType === 'mega') {
    return activeIndex > 0
      ? `${baseUrl}/mega/${activeIndex}`
      : `${baseUrl}/mega`
  }
  if (activeType === 'region') {
    return activeIndex > 0
      ? `${baseUrl}/region/${activeIndex}`
      : `${baseUrl}/region`
  }
  if (activeType === 'gigantamax') {
    return activeIndex > 0
      ? `${baseUrl}/gigantamax/${activeIndex}`
      : `${baseUrl}/gigantamax`
  }
  return activeIndex > 0 ? `${baseUrl}/form/${activeIndex}` : baseUrl
}
