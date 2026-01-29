const SITE_URL = 'https://poke-korea.com'

export const MOVES_TYPE_ITEMLIST_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '포켓몬 기술 타입별 목록',
  description:
    '18가지 포켓몬 타입별로 분류된 기술 목록입니다. 원하는 타입을 선택해 해당 기술을 확인하세요.',
  numberOfItems: 18,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '노말 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=NORMAL`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '불꽃 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=FIRE`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: '물 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=WATER`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: '풀 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=GRASS`,
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: '전기 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=ELECTRIC`,
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: '얼음 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=ICE`,
    },
    {
      '@type': 'ListItem',
      position: 7,
      name: '격투 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=FIGHTING`,
    },
    {
      '@type': 'ListItem',
      position: 8,
      name: '독 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=POISON`,
    },
    {
      '@type': 'ListItem',
      position: 9,
      name: '땅 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=GROUND`,
    },
    {
      '@type': 'ListItem',
      position: 10,
      name: '비행 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=FLYING`,
    },
    {
      '@type': 'ListItem',
      position: 11,
      name: '에스퍼 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=PSYCHIC`,
    },
    {
      '@type': 'ListItem',
      position: 12,
      name: '벌레 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=BUG`,
    },
    {
      '@type': 'ListItem',
      position: 13,
      name: '바위 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=ROCK`,
    },
    {
      '@type': 'ListItem',
      position: 14,
      name: '고스트 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=GHOST`,
    },
    {
      '@type': 'ListItem',
      position: 15,
      name: '드래곤 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=DRAGON`,
    },
    {
      '@type': 'ListItem',
      position: 16,
      name: '악 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=DARK`,
    },
    {
      '@type': 'ListItem',
      position: 17,
      name: '강철 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=STEEL`,
    },
    {
      '@type': 'ListItem',
      position: 18,
      name: '페어리 타입 기술',
      url: `${SITE_URL}/moves?typeFilter=FAIRY`,
    },
  ],
}

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
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://poke-korea.com/assets/image/ogImage.png',
    width: 1200,
    height: 630,
  },
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
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://poke-korea.com/assets/image/ogImage.png',
    width: 1200,
    height: 630,
  },
})

export const getMoveDetailGenerationJsonLd = (
  skillId: number,
  skillName: string,
  generationId: number,
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `포켓몬 ${skillName} 기술 정보 (${generationId}세대) - 포케 코리아`,
  description: `${skillName} 기술의 ${generationId}세대 정보와 이 기술을 배울 수 있는 포켓몬 목록을 확인하세요.`,
  url: `https://poke-korea.com/moves/${skillId}/generation/${generationId}`,
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
      {
        '@type': 'ListItem',
        position: 4,
        name: `${generationId}세대`,
        item: `https://poke-korea.com/moves/${skillId}/generation/${generationId}`,
      },
    ],
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://poke-korea.com/assets/image/ogImage.png',
    width: 1200,
    height: 630,
  },
})
