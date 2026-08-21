import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeSlug, getTypeLabel } from '~/module/typeParams.module'
import { TYPE_DETAIL_CONTENT } from './typeDetailContent'

const description =
  '포켓몬 타입 상성표와 계산기로 상대의 약점을 빠르게 찾으세요! 불꽃, 물, 풀 등 각 타입의 약점과 강점을 한눈에 확인하고, 2배, 0.5배 데미지 계산부터 타입별 상태이상 면역 정보까지 한 번에 확인할 수 있어요.'
const name = '포켓몬 타입 상성 계산기'

export const TYPE_EFFECTIVENESS_WEBPAGE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url: 'https://poke-korea.com/type-effectiveness',
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
        name: '타입 상성 계산기',
        item: 'https://poke-korea.com/type-effectiveness',
      },
    ],
  },
  image: 'https://poke-korea.com/assets/image/ogImage.png',
}

// ItemList 타입 - 타입별 추가 효과 리스트
export const TYPE_EFFECTIVENESS_ITEMLIST_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '포켓몬 타입별 추가 효과',
  description: '포켓몬 타입별 특수 효과 및 상태이상 면역 정보',
  numberOfItems: 18,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '노말 타입',
      description:
        '포켓몬의 타입과 기술의 타입이 일치하면 기술의 위력이 1.5배가 돼요.',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '불꽃 타입',
      description: '불꽃 타입의 포켓몬은 화상 상태가 되지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: '풀 타입',
      description:
        '풀 타입의 포켓몬은 씨뿌리기, 독가루, 저리가루, 수면가루,버섯포자 기술의 효과를 받지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: '전기 타입',
      description: '전기 타입의 포켓몬은 마비 상태가 되지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: '얼음 타입',
      description:
        '얼음 타입의 포켓몬은 싸라기눈 기술의 데미지를 받지 않고, 얼음 상태가 되지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: '독 타입',
      description: '독 타입의 포켓몬은 독, 맹독 상태가 되지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 7,
      name: '비행 타입 - 1',
      description:
        '비행 타입을 가지지 않았거나, 부유 특성이 없는 독 타입 포켓몬은 교체했을 때 주위에 뿌려진 독압정을 제거 해줘요.',
    },
    {
      '@type': 'ListItem',
      position: 8,
      name: '비행 타입 - 2',
      description:
        '비행 타입의 포켓몬은 압정뿌리기의 데미지를 받지 않고, 독압정을 통한 독, 맹독 상태가 되지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 9,
      name: '땅 타입',
      description:
        '땅 타입의 포켓몬은 전기자석파의 효과를 받지 않고, 모래바람의 데미지를 받지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 10,
      name: '바위 타입',
      description:
        '바위 타입의 포켓몬은 모래바람이 불 때, 특수방어가 상승하고, 지속 데미지를 받지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 11,
      name: '고스트 타입',
      description:
        '고스트 타입의 포켓몬은 상대를 도망치게 할 수 없는 기술의 효과를 받지 않아요.',
    },
    {
      '@type': 'ListItem',
      position: 12,
      name: '강철 타입',
      description:
        '강철 타입의 포켓몬은 모래바람의 데미지, 독, 맹독 상태 면역을 가지고 있어요.',
    },
  ],
}

/**
 * 타입 상세 페이지(`/type-effectiveness/[type]`) WebPage JSON-LD.
 *
 * breadcrumb는 별도 `<script>`가 아니라 WebPage의 `breadcrumb` 필드에 중첩한다
 * (`abilityJsonLd.ts`·`movesJsonLd.ts`와 같은 패턴). 3단 구조로 홈 → 타입 상성
 * 계산기 → 해당 타입을 잇는다.
 */
export const getTypeDetailWebPageJsonLd = (
  type: PokemonType,
): Record<string, unknown> => {
  const label = getTypeLabel(type)
  const url = `https://poke-korea.com/type-effectiveness/${buildTypeSlug(type)}`
  const content = TYPE_DETAIL_CONTENT[type]

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${label} 타입 약점과 상성 - 포케 코리아`,
    description:
      content?.lead ?? `${label} 타입의 약점과 상성을 확인할 수 있어요.`,
    url,
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
          name: '타입 상성 계산기',
          item: 'https://poke-korea.com/type-effectiveness',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${label} 타입`,
          item: url,
        },
      ],
    },
    image: 'https://poke-korea.com/assets/image/ogImage.png',
  }
}

/**
 * 타입 상세 페이지 FAQPage JSON-LD.
 *
 * 이 프로젝트에서 **동적 페이지에 FAQPage를 붙이는 첫 사례**다(기존 선례는
 * `shinyJsonLd.ts`의 정적 상수 하나뿐). 타입마다 질문 3개가 전부 다르기 때문에
 * (§26.9.5) 구조화 데이터로서 의미가 있다 — 타입명만 치환한 공통 질문이었다면
 * 18개 페이지가 같은 FAQ를 신고하는 셈이라 넣을 이유가 없다.
 *
 * FAQ가 없는 타입은 null을 반환하고 호출부가 script 자체를 렌더하지 않는다.
 */
export const getTypeDetailFaqJsonLd = (
  type: PokemonType,
): Record<string, unknown> | null => {
  const content = TYPE_DETAIL_CONTENT[type]

  if (!content || content.faq.length === 0) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
