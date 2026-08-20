import { Metadata } from 'next'
import { getRobotsConfig } from '~/module/metadata.module'

interface VersionGroup {
  versionGroupId: number
  generationId: number
  baseVersionGroupName?: string | null
}

interface MovesMetadataParams {
  pokemonName: string
  /** 습득법 한글 라벨 (예: '레벨업', '기술 가르침') */
  methodLabel: string
  /** 이 버전·이 습득법으로 배우는 기술 수 — 0이면 noindex */
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

  // '알 기술'·'기술 가르침'처럼 라벨에 이미 "기술"이 들어간 경우 "기술 정보"를
  // 덧붙이면 중복되므로("알 기술 습득 기술 정보"), 접미사를 조정한다.
  const titleSuffix = methodLabel.includes('기술')
    ? '습득 정보'
    : '습득 기술 정보'

  const title = `${pokemonName}${formLabel}${versionLabel ? ` ${versionLabel}` : ''} ${methodLabel} ${titleSuffix}`

  // description도 버전·습득법을 반영한다 — 기존엔 전체 버전 범위만 서술해
  // 탭과 버전이 달라도 모든 페이지가 같은 설명을 가졌다.
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
    // 배울 기술이 없는 조합은 색인하지 않되, 다른 버전·습득법 링크는 따라가게
    // follow는 유지한다.
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
