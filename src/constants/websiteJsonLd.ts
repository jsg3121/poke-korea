export const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '포케 코리아',
  url: 'https://poke-korea.com',
  description:
    '포켓몬의 모든 정보를 한곳에서 - 포켓몬 도감, 기술 정보, 타입 상성, 퀴즈 등 다양한 포켓몬 관련 정보를 제공합니다.',
  inLanguage: 'ko-KR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://poke-korea.com/?name={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
