/**
 * 사이트 전역 WebSite 구조화 데이터.
 *
 * WebSite 스키마는 사이트 홈(`/`)에만 1회 삽입한다(SSOT). 과거 layout.tsx가
 * 전역으로, 홈 page.tsx가 인라인으로 각각 삽입해 홈에서 WebSite가 2개 출력되던
 * 문제를 이 상수 하나로 단일화한다.
 *
 * SearchAction(potentialAction)은 제거했다 — 이를 활용하던 Google Sitelinks
 * Searchbox 기능이 2024-11-29부로 완전 폐지되어(Google Search Central) 아무
 * 효과가 없는 죽은 코드였다.
 */
export const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '포케 코리아',
  alternateName: '포케코리아',
  url: 'https://poke-korea.com',
  description:
    '1025마리 포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.',
  inLanguage: 'ko-KR',
}
