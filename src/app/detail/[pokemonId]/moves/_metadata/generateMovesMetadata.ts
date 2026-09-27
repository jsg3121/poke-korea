import { Metadata } from 'next'

import { LearnMethod, PokemonFormType } from '~/graphql/typeGenerated'
import { getRobotsConfig } from '~/modules/metadata.module'

import { fetchDefaultMovesMetadata } from '../_fetch/defaultMovesMetadata.fetch'
import { fetchLearnMethodCounts } from './fetchLearnMethodCounts'

interface GenerateMovesMetadataParams {
  pokemonId: string
  learnMethod: LearnMethod
  versionGroupId?: number
  canonicalPath: string
  formType?: PokemonFormType
  formIndex?: number
}

export async function generateMovesMetadata({
  pokemonId,
  learnMethod,
  versionGroupId,
  canonicalPath,
  formType,
  formIndex,
}: GenerateMovesMetadataParams): Promise<Metadata> {
  const [
    { pokemonDetail, isNormalForm, versionInfo, normalFormData },
    { methodLabel, skillCount },
  ] = await Promise.all([
    fetchDefaultMovesMetadata({ pokemonId }),
    fetchLearnMethodCounts({
      pokemonId,
      learnMethod,
      versionGroupId,
      formType,
      formIndex,
    }),
  ])

  const version = versionGroupId
    ? versionInfo.getVersionGroups?.find(
        (v) => v.versionGroupId === versionGroupId,
      )
    : versionInfo.getVersionGroups?.[0]

  if (versionGroupId && !version) {
    return {}
  }

  // 폼 목록이 비면 [0].name 접근에서 metadata 생성이 통째로 실패한다.
  const pokemonName = isNormalForm
    ? (normalFormData.getPokemonNormalForm?.[0]?.name ??
      pokemonDetail.getPokemonDetail?.name)
    : pokemonDetail.getPokemonDetail?.name

  const versionLabel = version
    ? `${version.generationId}세대 ${version.baseVersionGroupName} 시리즈`
    : ''

  const titleSuffix = methodLabel.includes('기술')
    ? '습득 정보'
    : '습득 기술 정보'

  const title = version
    ? `${pokemonName} ${versionLabel} ${methodLabel} ${titleSuffix}`
    : `${pokemonName} ${methodLabel} ${titleSuffix}`

  const description = buildDescription({
    pokemonName: pokemonName ?? '',
    versionLabel,
    methodLabel,
    skillCount,
  })

  const canonicalUrl = `https://poke-korea.com${canonicalPath}`

  return {
    title,
    description,
    // follow는 유지한다 — nofollow면 다른 버전·습득법 탭이 크롤링되지 않는다.
    robots: skillCount > 0 ? getRobotsConfig() : getEmptyPageRobots(),
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

const getEmptyPageRobots = () => ({
  index: false,
  follow: true,
})

const buildDescription = ({
  pokemonName,
  versionLabel,
  methodLabel,
  skillCount,
}: {
  pokemonName: string
  versionLabel: string
  methodLabel: string
  skillCount: number
}): string => {
  const target = versionLabel
    ? `${versionLabel}의 ${pokemonName}`
    : `${pokemonName}`

  if (skillCount === 0) {
    return `${target}은(는) ${methodLabel}(으)로 배우는 기술이 없습니다. 다른 버전과 습득 방법에서 배울 수 있는 기술을 확인해보세요.`
  }

  return `${target}이(가) ${methodLabel}(으)로 배우는 기술 ${skillCount}개를 확인하세요. 위력·명중률·PP와 함께 버전별 습득 정보를 한눈에 볼 수 있습니다.`
}
