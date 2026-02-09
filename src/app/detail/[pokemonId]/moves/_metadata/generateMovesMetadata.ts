import { Metadata } from 'next'
import { getRobotsConfig } from '~/module/metadata.module'
import { fetchDefaultMovesMetadata } from '../_fetch/defaultMovesMetadata.fetch'

interface GenerateMovesMetadataParams {
  pokemonId: string
  movesType: 'LEVELUP' | 'MACHINE'
  versionGroupId?: number
  canonicalPath: string
}

/**
 * detail/moves 기본 4개 페이지 공통 메타데이터 생성
 * - fetch + pokemonName 도출 + title/description 구성 + Metadata 반환
 */
export async function generateMovesMetadata({
  pokemonId,
  movesType,
  versionGroupId,
  canonicalPath,
}: GenerateMovesMetadataParams): Promise<Metadata> {
  const { pokemonDetail, isNormalForm, versionInfo, normalFormData } =
    await fetchDefaultMovesMetadata({ pokemonId })

  const version = versionGroupId
    ? versionInfo.getVersionGroups?.find(
        (v) => v.versionGroupId === versionGroupId,
      )
    : versionInfo.getVersionGroups?.[0]

  if (versionGroupId && !version) {
    return {}
  }

  const pokemonName = isNormalForm
    ? normalFormData.getPokemonNormalForm?.[0].name.replace('_', ' ')
    : pokemonDetail.getPokemonDetail?.name

  const movesTypeText = movesType === 'LEVELUP' ? '레벨업 습득' : '머신 습득'

  const title = version
    ? `${pokemonName} ${version.generationId}세대 ${version.nameKo} 시리즈 ${movesTypeText} 기술 정보`
    : `${pokemonName} ${movesTypeText} 기술 정보`

  const isSingleSeries = versionInfo.getVersionGroups?.length === 1
  const versionGroups = versionInfo.getVersionGroups
  const description = isSingleSeries
    ? `${versionGroups?.[0].nameKo}시리즈에 출현한 ${pokemonName}의 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`
    : `${pokemonName}의 ${versionGroups?.[versionGroups.length - 1].nameKo} 시리즈부터 ${versionGroups?.[0].nameKo} 시리즈까지 습득 가능한 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`

  const canonicalUrl = `https://poke-korea.com${canonicalPath}`

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
