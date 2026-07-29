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

/** 기술 상세 mainEntity(Thing) 구성용 스탯 — page.tsx가 fetch한 skill에서 전달 */
interface MoveEntityInfo {
  /** 타입 한글명 (예: '불꽃') */
  typeLabel?: string | null
  /** 분류 한글명 (물리/특수/변화) */
  damageTypeLabel?: string | null
  power?: number | null
  accuracy?: number | null
  description?: string | null
}

/**
 * 기술 상세 mainEntity(Thing) — 표준 엔티티 타입이 없는 도메인이라 포켓몬 상세와
 * 동일하게 Thing + additionalProperty(PropertyValue) 패턴을 쓴다. null/미보유
 * 값은 제외해 스키마-콘텐츠 불일치를 막는다.
 */
const buildMoveMainEntity = (
  skillId: number,
  skillName: string,
  info: MoveEntityInfo,
) => {
  const properties = [
    info.typeLabel && { name: '타입', value: info.typeLabel },
    info.damageTypeLabel && { name: '분류', value: info.damageTypeLabel },
    info.power != null && { name: '위력', value: info.power },
    info.accuracy != null && { name: '명중률', value: info.accuracy },
  ]
    .filter(Boolean)
    .map((prop) => ({ '@type': 'PropertyValue' as const, ...prop }))

  return {
    '@type': 'Thing' as const,
    name: skillName,
    identifier: {
      '@type': 'PropertyValue' as const,
      propertyID: 'moveId',
      name: '기술 번호',
      value: skillId,
    },
    ...(info.description ? { description: info.description } : {}),
    ...(properties.length > 0 ? { additionalProperty: properties } : {}),
  }
}

export const getMoveDetailJsonLd = (
  skillId: number,
  skillName: string,
  entityInfo?: MoveEntityInfo,
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `포켓몬 ${skillName} 기술 정보 - 포케 코리아`,
  description: `${skillName} 기술의 버전별 정보와 이 기술을 배울 수 있는 포켓몬 목록을 확인하세요.`,
  url: `https://poke-korea.com/moves/${skillId}`,
  inLanguage: 'ko-KR',
  isPartOf: {
    '@type': 'WebSite',
    name: '포케 코리아',
    url: 'https://poke-korea.com',
  },
  ...(entityInfo
    ? { mainEntity: buildMoveMainEntity(skillId, skillName, entityInfo) }
    : {}),
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

export const getMoveDetailVersionJsonLd = (
  skillId: number,
  skillName: string,
  versionGroupId: number,
  versionGroupName: string,
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `포켓몬 ${skillName} (${versionGroupName}) 기술 정보 - 포케 코리아`,
  description: `${skillName} ${versionGroupName} 버전의 기술 정보와 이 기술을 배울 수 있는 포켓몬 목록을 확인하세요.`,
  url: `https://poke-korea.com/moves/${skillId}/version/${versionGroupId}`,
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
