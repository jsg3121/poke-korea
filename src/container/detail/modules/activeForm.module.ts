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
    case 'mega':
      return {
        name: megaEvolutions?.[activeIndex]?.name ?? '',
        stats: megaEvolutions?.[activeIndex]?.megaEvolutionStats ?? undefined,
      }
    case 'region':
      return {
        name: `${pokemonBaseInfo?.name} ${regionFormInfo?.[activeIndex]?.region}의 모습 ${regionFormInfo?.[activeIndex]?.name && `(${regionFormInfo?.[activeIndex]?.name})`}`,
        stats:
          regionFormInfo?.[activeIndex]?.regionFormStats ??
          pokemonBaseInfo?.pokemonStats,
      }
    case 'gigantamax':
      return {
        name: gigantamaxInfo?.[activeIndex]?.name ?? '',
        stats: pokemonBaseInfo?.pokemonStats,
      }
    default:
      return {
        name:
          normalForm?.[0]?.name.replace('_', ' ') ??
          pokemonBaseInfo?.name ??
          '',
        stats:
          normalForm?.[0]?.normalFormStats ?? pokemonBaseInfo?.pokemonStats,
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
