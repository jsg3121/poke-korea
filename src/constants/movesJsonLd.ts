import { PokemonTypes } from '~/types/pokemonTypes.types'

const SITE_URL = 'https://poke-korea.com'

export const MOVES_TYPE_ITEMLIST_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '포켓몬 기술 타입별 목록',
  description:
    '18가지 포켓몬 타입별로 분류된 기술 목록입니다. 원하는 타입을 선택해 해당 기술을 확인하세요.',
  numberOfItems: Object.keys(PokemonTypes).length,
  itemListElement: Object.entries(PokemonTypes).map(
    ([typeEnum, typeName], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${typeName} 타입 기술`,
      url: `${SITE_URL}/moves?typeFilter=${typeEnum}`,
    }),
  ),
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
