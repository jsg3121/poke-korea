import { Metadata } from 'next'
import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { getRobotsConfig } from '~/module/metadata.module'
import { buildTypeSlug, getTypeLabel } from '~/module/typeParams.module'

/**
 * 타입 상세 페이지 메타데이터.
 *
 * ## 검색어를 그대로 title에 넣는다
 *
 * 이 페이지가 노리는 검색어는 `독타입 약점`·`물타입 상성` 계열이다(spec §26.8.2 —
 * 이 검색어군에서 노출이 75.6% 빠졌다). 따라서 title에 **"○○ 타입 약점"**을
 * 그대로 넣어 검색어와 일치시킨다. 브랜드 접미사는 루트 layout의 title.template이
 * 붙이므로 여기서는 붙이지 않는다.
 *
 * ## self-canonical
 *
 * 각 타입 페이지는 독립 색인 대상이므로 자기 자신을 canonical로 지정한다
 * (spec §20). 메인 계산기를 canonical로 지정하면 하위 페이지가 색인되지 않아
 * 이 트랙 전체가 무의미해진다.
 *
 * OG 이미지는 공통 이미지를 쓴다 — 타입별 동적 OG 이미지는 이 프로젝트에 선례가
 * 없고, 18장을 따로 만들 근거도 아직 없다.
 */

const SITE_URL = 'https://poke-korea.com'
const SITE_NAME = '포케 코리아'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

export const generateTypeDetailMetadata = (type: PokemonType): Metadata => {
  const label = getTypeLabel(type)
  const url = `${SITE_URL}/type-effectiveness/${buildTypeSlug(type)}`
  const content = TYPE_DETAIL_CONTENT[type]

  const title = `${label} 타입 약점과 상성`

  // description은 타입별 리드 문장을 그대로 쓴다 — 18개가 전부 다르고, 검색
  // 결과에서 사용자가 실제로 원하는 답(약점)이 첫 문장에 나온다.
  const description = content
    ? `${content.lead} ${label} 타입 포켓몬과 기술, 복합 타입 조합까지 한눈에 확인하세요.`
    : `${label} 타입의 약점과 상성을 확인하세요.`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url,
      title: `${title} - ${SITE_NAME}`,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${label} 타입 약점과 상성 - ${SITE_NAME}`,
          type: 'image/png',
        },
      ],
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${SITE_NAME}`,
      description,
      images: [OG_IMAGE_URL],
    },
  }
}
