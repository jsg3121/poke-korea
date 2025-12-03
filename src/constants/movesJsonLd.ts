export const MOVES_WEBPAGE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '포켓몬 기술 도감',
  description:
    '900개가 넘는 포켓몬의 모든 기술을 한곳에서 확인하고, 타입과 유형 필터를 이용해 필요한 기술을 한 번에 찾아보세요!',
  url: 'https://poke-korea.com/moves',
  inLanguage: 'ko-KR',
  isPartOf: {
    '@type': 'WebSite',
    name: '포케 코리아',
    url: 'https://poke-korea.com',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://poke-korea.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '포켓몬 기술 도감',
        item: 'https://poke-korea.com/moves',
      },
    ],
  },
  image: 'https://poke-korea.com/assets/image/ogImage.png',
}

export const getMoveDetailJsonLd = (skillId: number, skillName: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `포켓몬 ${skillName} 기술 정보 - 포케 코리아`,
  description: `${skillName} 기술의 세대별 정보와 이 기술을 배울 수 있는 포켓몬 목록을 확인하세요.`,
  url: `https://poke-korea.com/moves/${skillId}`,
  inLanguage: 'ko-KR',
  isPartOf: {
    '@type': 'WebSite',
    name: '포케 코리아',
    url: 'https://poke-korea.com',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://poke-korea.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '포켓몬 기술 도감',
        item: 'https://poke-korea.com/moves',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: skillName,
        item: `https://poke-korea.com/moves/${skillId}`,
      },
    ],
  },
  image: 'https://poke-korea.com/assets/image/ogImage.png',
})
