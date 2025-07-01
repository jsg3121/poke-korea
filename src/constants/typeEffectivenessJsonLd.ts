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
