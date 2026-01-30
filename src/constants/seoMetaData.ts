import { Metadata } from 'next'
import { getRobotsConfig } from '~/module/metadata.module'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

export const TYPE_EFFECTIVNESS_SEO_META = {
  title: '포켓몬 상성 계산기 - 포케 코리아',
  description: `
    포켓몬 타입 상성표와 계산기로 상대의 약점을 빠르게 찾으세요!
    포켓몬 타입 상성표와 계산기를 통해 불꽃, 물, 풀 등 각 타입의 약점과 강점을 한눈에 확인하고,
    2배, 0.5배 데미지 계산부터 타입별 상태이상 면역 정보까지 한 번에 확인할 수 있어요.
  `,
  canonicalUrl: 'https://poke-korea.com/type-effectiveness',
}

/** 기술 도감 메타데이터 생성 헬퍼 */
const createMovesMetadata = (
  title: string,
  description: string,
  path: string,
  imageAlt: string,
): Metadata => ({
  title,
  description,
  robots: getRobotsConfig(),
  openGraph: {
    title,
    description,
    url: `${SITE_URL}${path}`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: imageAlt,
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}${path}`,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [OG_IMAGE_URL],
  },
})

/** 기술 도감 메인 (필터 없음) 메타데이터 */
export const MOVES_MAIN_META: Metadata = createMovesMetadata(
  '포켓몬 기술 도감 (1~9세대 전체) | 포케 코리아',
  '1세대부터 9세대까지 900개 이상의 포켓몬 기술을 타입·데미지 유형별로 검색하세요. 위력, 명중률, 배울 수 있는 포켓몬까지 한눈에 확인할 수 있습니다.',
  '/moves',
  '포켓몬 기술 도감 | 포케 코리아',
)

/** 퀴즈 페이지 메타데이터 생성 헬퍼 */
const createQuizMetadata = (
  title: string,
  description: string,
  path: string,
  imageAlt: string,
): Metadata => ({
  title,
  description,
  robots: getRobotsConfig(),
  openGraph: {
    title,
    description,
    url: `${SITE_URL}${path}`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: imageAlt,
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}${path}`,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [OG_IMAGE_URL],
  },
})

/** 퀴즈 메인 페이지 메타데이터 */
export const QUIZ_MAIN_META: Metadata = createQuizMetadata(
  '포켓몬 퀴즈 모음 (실루엣·특성·타입·상성) | 포케 코리아',
  '실루엣, 특성, 타입, 타입 상성까지 4종류의 포켓몬 퀴즈를 20문제 4지선다로 풀어보세요. 완료 후 결과를 바로 확인할 수 있습니다.',
  '/quiz',
  '포켓몬 퀴즈 모음 | 포케 코리아',
)

/** 실루엣 퀴즈 페이지 메타데이터 */
export const QUIZ_SILHOUETTE_META: Metadata = createQuizMetadata(
  '포켓몬 실루엣 퀴즈 | 포케 코리아',
  '검은 실루엣만 보고 포켓몬 이름을 맞춰보세요! 4지선다 20문제, 완료 후 정답과 결과를 바로 확인할 수 있습니다.',
  '/quiz/silhouette',
  '포켓몬 실루엣 퀴즈 | 포케 코리아',
)

/** 특성 퀴즈 페이지 메타데이터 */
export const QUIZ_ABILITY_META: Metadata = createQuizMetadata(
  '포켓몬 특성 퀴즈 | 포케 코리아',
  '포켓몬 특성 설명을 보고 정답 특성을 골라보세요! 4지선다 20문제, 완료 후 정답과 결과를 바로 확인할 수 있습니다.',
  '/quiz/ability',
  '포켓몬 특성 퀴즈 | 포케 코리아',
)

/** 타입 퀴즈 페이지 메타데이터 */
export const QUIZ_POKEMON_TYPE_META: Metadata = createQuizMetadata(
  '포켓몬 타입 퀴즈 | 포케 코리아',
  '불꽃, 물, 풀 등 특정 타입을 가진 포켓몬을 골라보세요! 4지선다 20문제, 완료 후 정답과 결과를 바로 확인할 수 있습니다.',
  '/quiz/pokemon-type',
  '포켓몬 타입 퀴즈 | 포케 코리아',
)

/** 타입 상성 퀴즈 페이지 메타데이터 */
export const QUIZ_TYPE_EFFECTIVENESS_META: Metadata = createQuizMetadata(
  '포켓몬 타입 상성 퀴즈 | 포케 코리아',
  '공격·방어 타입 조합의 데미지 배수를 맞춰보세요! 2배·0.5배·0배 등 4지선다 20문제, 완료 후 정답과 결과를 바로 확인할 수 있습니다.',
  '/quiz/type-effectiveness',
  '포켓몬 타입 상성 퀴즈 | 포케 코리아',
)
