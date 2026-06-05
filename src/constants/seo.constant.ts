/**
 * SEO 전역 상수.
 *
 * Why: 사이트 이름과 도메인은 여러 metadata 생성 함수에서 중복 사용되며,
 *      한 곳에서만 변경되면 다른 곳과 불일치할 위험이 있다.
 *      이 모듈은 챔피언스 + 일반 도감 양쪽 metadata 에서 import 한다.
 */

export const SITE_NAME = '포케 코리아'
export const SITE_URL = 'https://poke-korea.com'

/** Open Graph 공통 이미지 URL (포켓몬별 차별 이미지는 별도 빌더가 처리) */
export const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

/** 포켓몬별 동적 OG 이미지 base URL (챔피언스 상세 페이지 용) */
export const OG_IMAGE_BASE = 'https://image.poke-korea.com/og-images'
