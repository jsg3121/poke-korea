import { Metadata } from 'next'

import { getRobotsConfig } from '~/modules/metadata.module'

interface VersionGroup {
  versionGroupId: number
  generationId: number
  baseVersionGroupName?: string | null
}

interface MovesMetadataParams {
  pokemonName: string
  methodLabel: string
  skillCount: number
  canonicalUrl: string
  version?: VersionGroup | null
  versionGroups?: VersionGroup[] | null
}

const createMovesMetadata = (
  {
    pokemonName,
    methodLabel,
    skillCount,
    canonicalUrl,
    version,
  }: MovesMetadataParams,
  formLabel: string,
): Metadata => {
  const versionLabel = version
    ? `${version.generationId}세대 ${version.baseVersionGroupName} 시리즈`
    : ''

  const titleSuffix = methodLabel.includes('기술')
    ? '습득 정보'
    : '습득 기술 정보'

  const title = `${pokemonName}${formLabel}${versionLabel ? ` ${versionLabel}` : ''} ${methodLabel} ${titleSuffix}`

  const target = versionLabel
    ? `${versionLabel}의 ${pokemonName}${formLabel}`
    : `${pokemonName}${formLabel}`
  const description =
    skillCount === 0
      ? `${target}은(는) ${methodLabel}(으)로 배우는 기술이 없습니다. 다른 버전과 습득 방법에서 배울 수 있는 기술을 확인해보세요.`
      : `${target}이(가) ${methodLabel}(으)로 배우는 기술 ${skillCount}개를 확인하세요. 위력·명중률·PP와 함께 버전별 습득 정보를 한눈에 볼 수 있습니다.`

  return {
    title,
    description,
    robots: skillCount > 0 ? getRobotsConfig() : { index: false, follow: true },
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
