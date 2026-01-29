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
  '포켓몬 퀴즈 | 포케 코리아',
  '포켓몬의 실루엣, 특성, 타입, 상성을 정보를 통해 재미있는 퀴즈를 맞추며 포켓몬의 정보를 확인하고 배워보세요!',
  '/quiz',
  '포켓몬 퀴즈 | 포케 코리아',
)

/** 실루엣 퀴즈 페이지 메타데이터 */
export const QUIZ_SILHOUETTE_META: Metadata = createQuizMetadata(
  '포켓몬 실루엣 퀴즈 | 포케 코리아',
  '검게 가려진 포켓몬의 실루엣을 보고 어떤 포켓몬인지 맞춰보세요!',
  '/quiz/silhouette',
  '실루엣 퀴즈 | 포케 코리아',
)

/** 특성 퀴즈 페이지 메타데이터 */
export const QUIZ_ABILITY_META: Metadata = createQuizMetadata(
  '포켓몬 특성 퀴즈 | 포케 코리아',
  '포켓몬의 특성 설명을 보고 어떤 특성의 설명인지 맞춰보세요!',
  '/quiz/ability',
  '특성 퀴즈 | 포케 코리아',
)

/** 타입 퀴즈 페이지 메타데이터 */
export const QUIZ_POKEMON_TYPE_META: Metadata = createQuizMetadata(
  '포켓몬 타입 퀴즈 | 포케 코리아',
  '특정 타입을 보고 해당 타입을 가지고 있는 포켓몬을 맞춰보세요!',
  '/quiz/pokemon-type',
  '포켓몬 타입 퀴즈 | 포케 코리아',
)

/** 타입 상성 퀴즈 페이지 메타데이터 */
export const QUIZ_TYPE_EFFECTIVENESS_META: Metadata = createQuizMetadata(
  '포켓몬 타입 상성 퀴즈 | 포케 코리아',
  '공격하는 타입과 방어하는 타입을 확인하고, 어떤 효과를 가지는지 답을 선택해 맞춰보세요!',
  '/quiz/type-effectiveness',
  '포켓몬 타입 상성 퀴즈 | 포케 코리아',
)
