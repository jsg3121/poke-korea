import { OG_IMAGE_URL, SITE_NAME, SITE_URL } from '~/constants/seo.constant'

interface ChampionsHomeJsonLdParams {
  formatSlug: string
  name: string
  description: string
}

export const getChampionsHomeJsonLd = ({
  formatSlug,
  name,
  description,
}: ChampionsHomeJsonLdParams) => {
  const url = `${SITE_URL}/champions/${formatSlug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: 'ko-KR',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '챔피언스',
          item: url,
        },
      ],
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
  }
}

interface ChampionsEntityInfo {
  stats?: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
    total: number
  } | null
  tier?: string | null
  topMove?: string | null
  topAbility?: string | null
  topItem?: string | null
}

interface ChampionsDetailJsonLdParams {
  formatSlug: string
  pokemonName: string
  detailPath: string
  name: string
  description: string
  imageUrl?: string
  entityInfo?: ChampionsEntityInfo
}

const buildChampionsMainEntity = (
  pokemonName: string,
  info: ChampionsEntityInfo,
) => {
  const displayName = pokemonName
  const properties = [
    info.tier && { name: '티어', value: info.tier },
    info.topMove && { name: '인기 기술', value: info.topMove },
    info.topAbility && { name: '인기 특성', value: info.topAbility },
    info.topItem && { name: '인기 도구', value: info.topItem },
    info.stats && { name: '체력', value: info.stats.hp },
    info.stats && { name: '공격', value: info.stats.attack },
    info.stats && { name: '특수공격', value: info.stats.specialAttack },
    info.stats && { name: '방어', value: info.stats.defense },
    info.stats && { name: '특수방어', value: info.stats.specialDefense },
    info.stats && { name: '스피드', value: info.stats.speed },
    info.stats && { name: '종족값 총합', value: info.stats.total },
  ]
    .filter(Boolean)
    .map((prop) => ({ '@type': 'PropertyValue' as const, ...prop }))

  return {
    '@type': 'Thing' as const,
    name: `${displayName} 챔피언스 메타`,
    ...(properties.length > 0 ? { additionalProperty: properties } : {}),
  }
}

export const getChampionsDetailJsonLd = ({
  formatSlug,
  pokemonName,
  detailPath,
  name,
  description,
  imageUrl,
  entityInfo,
}: ChampionsDetailJsonLdParams) => {
  const url = `${SITE_URL}${detailPath}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: 'ko-KR',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(entityInfo
      ? { mainEntity: buildChampionsMainEntity(pokemonName, entityInfo) }
      : {}),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '챔피언스',
          item: `${SITE_URL}/champions/${formatSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: '포켓몬 도감',
          item: `${SITE_URL}/champions/${formatSlug}/list`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: pokemonName,
          item: url,
        },
      ],
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: imageUrl || OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
  }
}
