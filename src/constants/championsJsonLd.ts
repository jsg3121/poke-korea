import { OG_IMAGE_URL, SITE_NAME, SITE_URL } from '~/constants/seo.constant'

/**
 * 챔피언스 홈·상세 구조화 데이터(JSON-LD) 팩토리.
 *
 * 과거 두 라우트는 page.tsx에 BreadcrumbList만 인라인 삽입해, list·moves·
 * type·quiz 등 다른 라우트가 갖춘 WebPage 래핑(isPartOf·primaryImageOfPage)이
 * 없어 사이트 내 구조화 수준이 챔피언스만 낮았다(SEO-2026-07-28 감사 P2).
 *
 * 다른 라우트의 `*JsonLd.ts` 상수와 동일하게 WebPage 안에 breadcrumb를 중첩하는
 * 표준 구조로 승격하고, 홈·상세가 중복하던 breadcrumb 인라인을 이 상수로 단일화한다.
 *
 * page.tsx가 이미 계산한 name/description/url을 파라미터로 받는 순수 함수다 —
 * JSON-LD 생성을 위한 별도 GraphQL 호출을 만들지 않는다(moves 상수 패턴과 동일).
 */

interface ChampionsHomeJsonLdParams {
  /** 포맷 슬러그 (예: 'double', 'single') */
  formatSlug: string
  /** page.tsx generateMetadata가 만든 title 재사용 */
  name: string
  /** page.tsx generateMetadata가 만든 description 재사용 */
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

/** 챔피언스 상세 mainEntity(Thing) 구성용 — usageRate/winRate는 데이터 원천
 *  변경(PR #195)으로 더 이상 들어오지 않아 제외한다. */
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
  /** 포맷 슬러그 */
  formatSlug: string
  /** 포켓몬 표시명 (백엔드 name 그대로, 폼 정보 포함) */
  pokemonName: string
  /** 상세 canonical 경로 (buildChampionsDetailHref 결과, 선행 슬래시 포함) */
  detailPath: string
  /** page.tsx generateMetadata가 만든 title 재사용 */
  name: string
  /** page.tsx generateMetadata가 만든 description 재사용 */
  description: string
  /** 상세 전용 OG 이미지 URL (없으면 공용 OG 사용) */
  imageUrl?: string
  /** mainEntity(포켓몬 메타) 구성용 — 없으면 mainEntity 생략 */
  entityInfo?: ChampionsEntityInfo
}

/**
 * 챔피언스 상세 mainEntity(Thing) — 표준 엔티티 타입이 없어 포켓몬/기술 상세와
 * 동일한 Thing + additionalProperty 패턴. stats는 항상, 메타(tier·인기 기술 등)는
 * 있을 때만 넣는다. null 값은 제외해 스키마-콘텐츠 불일치를 막는다.
 */
const buildChampionsMainEntity = (
  pokemonName: string,
  info: ChampionsEntityInfo,
) => {
  const displayName = pokemonName.replace('_', ' ')
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
