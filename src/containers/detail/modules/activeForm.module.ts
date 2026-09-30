import { TActiveType } from '~/types/detailContext.type'
import {
  PokemonDetail,
  PokemonGigantamax,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
  PokemonStats,
} from '~/graphql/typeGenerated'

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
  height?: number | null
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
        height: form?.height,
        weight: form?.weight,
      }
    }
    case 'region': {
      const form = regionFormInfo?.[activeIndex]
      return {
        name: form?.name || pokemonBaseInfo?.name || '',
        stats: form?.regionFormStats ?? pokemonBaseInfo?.pokemonStats,
        height: form ? form.height : pokemonBaseInfo?.height,
        weight: form ? form.weight : pokemonBaseInfo?.weight,
      }
    }
    case 'gigantamax': {
      const form = gigantamaxInfo?.[activeIndex]
      return {
        name: form?.name ?? '',
        stats: pokemonBaseInfo?.pokemonStats,
        height: form?.height,
        weight: form?.weight,
      }
    }
    default: {
      const form = normalForm?.[0]
      return {
        name: form?.name ?? pokemonBaseInfo?.name ?? '',
        stats: form?.normalFormStats ?? pokemonBaseInfo?.pokemonStats,
        height: form ? form.height : pokemonBaseInfo?.height,
        weight: form ? form.weight : pokemonBaseInfo?.weight,
      }
    }
  }
}

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
