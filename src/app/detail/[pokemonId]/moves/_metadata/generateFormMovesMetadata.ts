import { Metadata } from 'next'
import { getRobotsConfig } from '~/module/metadata.module'

interface VersionGroup {
  versionGroupId: number
  generationId: number
  baseVersionGroupName?: string | null
}

interface MovesMetadataParams {
  pokemonName: string
  movesType: 'LEVELUP' | 'MACHINE'
  canonicalUrl: string
  version?: VersionGroup | null
  versionGroups?: VersionGroup[] | null
}

const createMovesMetadata = (
  {
    pokemonName,
    movesType,
    canonicalUrl,
    version,
    versionGroups,
  }: MovesMetadataParams,
  formLabel: string,
): Metadata => {
  const isSingleSeries = versionGroups?.length === 1
  const movesTypeLabel = movesType === 'LEVELUP' ? ' 레벨업 습득' : ' 머신 습득'
  const versionLabel = version
    ? ` ${version.generationId}세대 ${version.baseVersionGroupName} 시리즈`
    : ''

  const title = `${pokemonName}${formLabel}${versionLabel}${movesTypeLabel} 기술 정보`
  const description = isSingleSeries
    ? `${versionGroups?.[0].baseVersionGroupName}시리즈에 출현한 ${pokemonName}의 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`
    : `${pokemonName}의 ${versionGroups?.[versionGroups.length - 1].baseVersionGroupName} 시리즈부터 ${versionGroups?.[0].baseVersionGroupName} 시리즈까지 습득 가능한 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      locale: 'ko_KR',
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
  }
}

export const generateFormMovesMetadata = (
  params: MovesMetadataParams,
): Metadata => createMovesMetadata(params, '')

export const generateRegionMovesMetadata = (
  params: MovesMetadataParams,
): Metadata => createMovesMetadata(params, ' 리전폼')
