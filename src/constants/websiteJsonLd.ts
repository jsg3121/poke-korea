/**
 * 사이트 전역 WebSite + SearchAction 구조화 데이터.
 *
 * WebSite 스키마는 사이트 홈(`/`)에만 1회 삽입한다(Google 사이트링크 검색창
 * 가이드 권장). 과거 layout.tsx가 전역으로, 홈 page.tsx가 인라인으로 각각
 * 삽입해 홈에서 WebSite가 2개 출력되고 SearchAction target도 서로 달랐던
 * 문제를 이 상수 하나로 단일화한다(SSOT).
 *
 * target은 `/list?name=`이다 — 홈에서 `?name=` 검색 시 page.tsx가 `/list`로
 * 308 영구 리다이렉트하므로 실제 검색 결과 URL과 일치시킨다.
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
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://poke-korea.com/list?name={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
