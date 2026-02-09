import { Metadata } from 'next'
import { changeTypeArrayToString } from '~/module/filter.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface ListMetadataParams {
  type?: string
  isMega?: string
  isRegion?: string
  isGigantamax?: string
  isEvolution?: string
  generation?: string
}

export const generateListMetadata = ({
  type,
  isMega,
  isRegion,
  isGigantamax,
  isEvolution,
  generation,
}: ListMetadataParams): Metadata => {
  const { titlePrefix, descriptionPrefix, filters } = buildMetadata({
    type,
    isMega,
    isRegion,
    isGigantamax,
    isEvolution,
    generation,
  })

  const title = `${titlePrefix} | 포케 코리아`
  const description =
    filters.length > 0
      ? `${descriptionPrefix}을 한눈에 확인하세요. ${filters.join(', ')} 포켓몬을 빠르게 찾아보세요.`
      : `모든 세대의 포켓몬을 한눈에! 타입, 진화 여부, 세대별로 필터링하여 원하는 포켓몬을 빠르게 찾아보세요.`

  const queryString = new URLSearchParams(
    Object.entries({
      type,
      isMega,
      isRegion,
      isGigantamax,
      isEvolution,
      generation,
    }).filter(([_, v]) => v !== undefined) as [string, string][],
  ).toString()
  const canonicalUrl = queryString
    ? `https://poke-korea.com/list?${queryString}`
    : 'https://poke-korea.com/list'

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
}

const buildMetadata = ({
  type,
  isMega,
  isRegion,
  isGigantamax,
  isEvolution,
  generation,
}: ListMetadataParams) => {
  const typeArray = type ? changeTypeArrayToString(type) : []
  const typeNames = typeArray.map((t) => PokemonTypes[t]).filter(Boolean)

  const typeData =
    typeNames.length > 0
      ? {
          titlePrefix:
            typeNames.length === 1
              ? `${typeNames[0]} 타입 포켓몬 도감`
              : `${typeNames.join('·')} 타입 포켓몬 도감`,
          descPrefix:
            typeNames.length === 1
              ? `${typeNames[0]} 타입 포켓몬`
              : `${typeNames.join('·')} 타입 포켓몬`,
          filter:
            typeNames.length === 1
              ? `${typeNames[0]} 타입`
              : `${typeNames.join('·')} 타입`,
        }
      : null

  const generationData = generation
    ? {
        titleSuffix: `${generation}세대`,
        descPrefix:
          typeNames.length > 0
            ? `${generation}세대 ${typeNames.join('·')} 타입 포켓몬`
            : `${generation}세대 포켓몬`,
        filter: `${generation}세대`,
      }
    : null

  const megaData =
    isMega === 'true'
      ? {
          titleSuffix: '메가진화',
          descPrefix: '메가진화 포켓몬',
          filter: '메가진화',
        }
      : null

  const regionData =
    isRegion === 'true'
      ? {
          titleSuffix: '리전폼',
          descPrefix: '리전폼 포켓몬',
          filter: '리전폼',
        }
      : null

  const gigantamaxData =
    isGigantamax === 'true'
      ? {
          titleSuffix: '거다이맥스',
          descPrefix: '거다이맥스 포켓몬',
          filter: '거다이맥스',
        }
      : null

  const evolutionData =
    isEvolution === 'true'
      ? { suffix: '(진화 가능)', filter: '진화 가능' }
      : isEvolution === 'false'
        ? { suffix: '(진화 불가)', filter: '진화 불가' }
        : null

  const baseTitlePrefix =
    typeData?.titlePrefix ||
    (generationData ? `${generationData.titleSuffix} 포켓몬 도감` : null) ||
    (megaData ? `${megaData.titleSuffix} 포켓몬 도감` : null) ||
    (regionData ? `${regionData.titleSuffix} 포켓몬 도감` : null) ||
    (gigantamaxData ? `${gigantamaxData.titleSuffix} 포켓몬 도감` : null) ||
    '포켓몬 도감'

  const titleSuffixes = [
    generationData && typeData ? generationData.titleSuffix : null,
    megaData && (typeData || generationData) ? megaData.titleSuffix : null,
    regionData && (typeData || generationData || megaData)
      ? regionData.titleSuffix
      : null,
    gigantamaxData && (typeData || generationData || megaData || regionData)
      ? gigantamaxData.titleSuffix
      : null,
  ].filter(Boolean) as string[]

  const finalTitle =
    titleSuffixes.length > 0
      ? `${baseTitlePrefix} - ${titleSuffixes.join(' ')}`
      : baseTitlePrefix

  const baseDescPrefix =
    gigantamaxData?.descPrefix ||
    regionData?.descPrefix ||
    megaData?.descPrefix ||
    generationData?.descPrefix ||
    typeData?.descPrefix ||
    '모든 세대의 포켓몬'

  const finalDescPrefix = evolutionData
    ? `${baseDescPrefix} ${evolutionData.suffix}`
    : baseDescPrefix

  const filters = [
    typeData?.filter,
    generationData?.filter,
    megaData?.filter,
    regionData?.filter,
    gigantamaxData?.filter,
    evolutionData?.filter,
  ].filter(Boolean) as string[]

  return {
    titlePrefix: finalTitle,
    descriptionPrefix: finalDescPrefix,
    filters,
  }
}
