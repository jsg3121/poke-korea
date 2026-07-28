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
  /** 포맷 슬러그 (예: 'vgc', 'bss') */
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
}

export const getChampionsDetailJsonLd = ({
  formatSlug,
  pokemonName,
  detailPath,
  name,
  description,
  imageUrl,
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
