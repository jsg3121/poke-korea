import { Metadata } from 'next'
import { LearnMethod, PokemonFormType } from '~/graphql/typeGenerated'
import { getRobotsConfig } from '~/module/metadata.module'
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

/**
 * detail/moves 페이지 메타데이터 생성 — 습득법 × 버전 조합마다 고유한 내용을 만든다.
 *
 * 기존 description은 version·movesType을 전혀 참조하지 않고 "전체 버전 범위"만
 * 서술해, 탭과 버전이 달라도 모든 페이지가 같은 설명을 가졌다. title만 버전별로
 * 달라 검색 결과에서 페이지 구분이 되지 않았다.
 *
 * 빈 페이지는 noindex로 막는다 — 습득법 탭 4종을 항상 노출하므로, 해당 버전에
 * 그 습득법으로 배우는 기술이 없으면 "기술이 없습니다"만 있는 빈 페이지가 된다.
 * 사이트맵은 조합을 구분할 수 없어 전부 넣되, 페이지별 robots로 조정한다.
 */
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

  const pokemonName = isNormalForm
    ? normalFormData.getPokemonNormalForm?.[0].name.replace('_', ' ')
    : pokemonDetail.getPokemonDetail?.name

  const versionLabel = version
    ? `${version.generationId}세대 ${version.baseVersionGroupName} 시리즈`
    : ''

  // '알 기술'·'기술 가르침'처럼 라벨에 이미 "기술"이 들어간 경우 "기술 정보"를
  // 덧붙이면 중복되므로("알 기술 습득 기술 정보"), 접미사를 조정한다.
  const titleSuffix = methodLabel.includes('기술')
    ? '습득 정보'
    : '습득 기술 정보'

  const title = version
    ? `${pokemonName} ${versionLabel} ${methodLabel} ${titleSuffix}`
    : `${pokemonName} ${methodLabel} ${titleSuffix}`

  // description도 버전·습득법을 반영해 조합마다 달라지게 한다.
  // 기술이 없는 조합은 그 사실을 그대로 쓴다 — noindex 대상이라 검색에 뜨지 않지만,
  // SNS 공유 등으로 노출될 때 잘못된 기대를 주지 않는다.
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
    // 배울 기술이 없는 조합은 색인하지 않는다. follow는 유지해 이 페이지의
    // 링크(다른 버전·습득법 탭)는 계속 크롤링되게 한다.
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

/**
 * 빈 페이지용 robots — noindex, follow.
 *
 * nofollow가 아니라 follow인 이유: 이 페이지에는 다른 버전·습득법으로 가는 링크가
 * 있고 그중 상당수는 실제 콘텐츠가 있다. nofollow를 걸면 크롤러가 그 경로를 따라가지
 * 못해 색인 대상 페이지 발견이 늦어진다.
 */
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
