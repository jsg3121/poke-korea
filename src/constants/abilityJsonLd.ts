export const ABILITY_WEBPAGE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '포켓몬 특성 도감',
  description:
    '포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고, 어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요.',
  url: 'https://poke-korea.com/ability',
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
        name: '포켓몬 특성 도감',
        item: 'https://poke-korea.com/ability',
      },
    ],
  },
  image: 'https://poke-korea.com/assets/image/ogImage.png',
}

export const getAbilityDetailJsonLd = (
  abilityId: number,
  abilityName: string,
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `특성 정보 ${abilityName}`,
  description: `${abilityName} 특성을 가진 포켓몬 목록을 확인하세요.`,
  url: `https://poke-korea.com/ability/${abilityId}`,
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
        name: '포켓몬 특성 도감',
        item: 'https://poke-korea.com/ability',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: abilityName,
        item: `https://poke-korea.com/ability/${abilityId}`,
      },
    ],
  },
  image: 'https://poke-korea.com/assets/image/ogImage.png',
})
