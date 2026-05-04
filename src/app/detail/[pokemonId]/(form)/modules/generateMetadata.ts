import { Metadata } from 'next'
import {
  PokemonDetail,
  PokemonGigantamax,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
} from '~/graphql/typeGenerated'
import {
  getPokemonNameByType,
  getPokemonTypes,
  getSeoCanonicalUrl,
  getSeoDescription,
  getSeoTitle,
} from '~/module/generateDetailSeoMetaData'
import { getRobotsConfig } from '~/module/metadata.module'
import { TActiveType } from '~/types/detailContext.type'

const OG_IMAGE_BASE = 'https://image.poke-korea.com/og-images'

function getOgImageUrls(
  pokemonId: number,
  activeType: TActiveType,
  activeIndex: number,
) {
  const folder =
    activeType === 'normal'
      ? activeIndex > 0
        ? 'form'
        : 'default'
      : activeType

  const fileId =
    folder === 'default' || folder === 'gigantamax'
      ? `${pokemonId}`
      : `${pokemonId}-${activeIndex}`

  return {
    large: `${OG_IMAGE_BASE}/${folder}/${fileId}-large.png`,
    medium: `${OG_IMAGE_BASE}/${folder}/${fileId}-medium.png`,
  }
}

interface GenerateDetailMetadataParams {
  pokemonDetail: PokemonDetail
  activeType: TActiveType
  activeIndex: number
  isShiny: boolean
  normalFormData?: PokemonNormalForm[]
  megaEvolutionData?: PokemonMegaEvolution[]
  regionFormData?: PokemonRegionForm[]
  gigantamaxData?: PokemonGigantamax[]
}

/**
 * 포켓몬 상세 페이지 메타데이터 생성
 */
export const generateDetailMetadata = ({
  pokemonDetail,
  activeType,
  activeIndex,
  isShiny,
  normalFormData = [],
  megaEvolutionData = [],
  regionFormData = [],
  gigantamaxData = [],
}: GenerateDetailMetadataParams): Metadata => {
  const commonParams = {
    pokemonDetail,
    activeType,
    activeIndex,
    normalForm: normalFormData,
    megaEvolutionData,
    regionFormData,
  }

  const types = getPokemonTypes(commonParams)

  const pokemonNameByType = getPokemonNameByType({
    activeType,
    megaEvolutionName: megaEvolutionData[activeIndex]?.name ?? '',
    regionFormPlace: regionFormData[activeIndex]?.region ?? '',
    gigantamaxName: gigantamaxData[activeIndex]?.name ?? '',
    pokemonBaseInfoName: pokemonDetail.name,
    isShiny,
  })

  const title = getSeoTitle({
    pokemonName: pokemonNameByType,
    pokemonNumber: pokemonDetail.number,
  })

  const canonicalUrl = getSeoCanonicalUrl({
    activeType,
    activeIndex,
    pokemonNumber: pokemonDetail.number,
    isShiny,
  })

  const description = getSeoDescription({
    generation: pokemonDetail.generation,
    pokemonNumber: pokemonDetail.number,
    pokemonName: pokemonNameByType,
    types,
    activeType,
    isShiny,
  })

  const ogImages = getOgImageUrls(pokemonDetail.number, activeType, activeIndex)

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `No. ${pokemonDetail.number} ${pokemonNameByType}`,
      description,
      locale: 'ko_KR',
      siteName: '포케 코리아',
      images: [
        {
          url: ogImages.large,
          width: 1200,
          height: 630,
          alt: `No. ${pokemonDetail.number} ${pokemonNameByType}`,
        },
        {
          url: ogImages.medium,
          width: 800,
          height: 800,
          alt: `No. ${pokemonDetail.number} ${pokemonNameByType}`,
        },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: `No. ${pokemonDetail.number} ${pokemonNameByType} | 포케코리아`,
      description,
      images: [ogImages.large],
    },
  }
}
