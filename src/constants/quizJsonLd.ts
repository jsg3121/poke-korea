// 포켓몬 타입 퀴즈 JSON-LD
export const POKEMON_TYPE_QUIZ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '포켓몬 타입 퀴즈',
  description: '특정 타입을 보고 해당 타입을 가지고 있는 포켓몬을 맞춰보세요!',
  about: {
    '@type': 'Thing',
    name: '포켓몬',
  },
  inLanguage: 'ko-KR',
  educationalLevel: '초급',
  hasPart: {
    '@type': 'Question',
    eduQuestionType: 'Multiple choice',
  },
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
        name: '퀴즈',
        item: 'https://poke-korea.com/quiz',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '포켓몬 타입 퀴즈',
        item: 'https://poke-korea.com/quiz/pokemon-type',
      },
    ],
  },
}

// 포켓몬 특성 퀴즈 JSON-LD
export const ABILITY_QUIZ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '포켓몬 특성 퀴즈',
  description: '포켓몬의 특성 설명을 보고 어떤 특성의 설명인지 맞춰보세요!',
  about: {
    '@type': 'Thing',
    name: '포켓몬',
  },
  inLanguage: 'ko-KR',
  educationalLevel: '초급',
  hasPart: {
    '@type': 'Question',
    eduQuestionType: 'Multiple choice',
  },
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
        name: '퀴즈',
        item: 'https://poke-korea.com/quiz',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '포켓몬 특성 퀴즈',
        item: 'https://poke-korea.com/quiz/ability',
      },
    ],
  },
}

// 포켓몬 실루엣 퀴즈 JSON-LD
export const SILHOUETTE_QUIZ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '포켓몬 실루엣 퀴즈',
  description: '검게 가려진 포켓몬의 실루엣을 보고 어떤 포켓몬인지 맞춰보세요!',
  about: {
    '@type': 'Thing',
    name: '포켓몬',
  },
  inLanguage: 'ko-KR',
  educationalLevel: '초급',
  hasPart: {
    '@type': 'Question',
    eduQuestionType: 'Multiple choice',
  },
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
        name: '퀴즈',
        item: 'https://poke-korea.com/quiz',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '포켓몬 실루엣 퀴즈',
        item: 'https://poke-korea.com/quiz/silhouette',
      },
    ],
  },
}

// 포켓몬 타입 상성 퀴즈 JSON-LD
export const TYPE_EFFECTIVENESS_QUIZ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '포켓몬 타입 상성 퀴즈',
  description:
    '공격하는 타입과 방어하는 타입을 확인하고, 어떤 효과를 가지는지 답을 선택해 맞춰보세요!',
  about: {
    '@type': 'Thing',
    name: '포켓몬',
  },
  inLanguage: 'ko-KR',
  educationalLevel: '초급',
  hasPart: {
    '@type': 'Question',
    eduQuestionType: 'Multiple choice',
  },
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
        name: '퀴즈',
        item: 'https://poke-korea.com/quiz',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '포켓몬 타입 상성 퀴즈',
        item: 'https://poke-korea.com/quiz/type-effectiveness',
      },
    ],
  },
}

export const QUIZ_WEBPAGE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '포켓몬 퀴즈 | 포케 코리아',
  description:
    '포켓몬의 실루엣, 특성, 타입, 상성을 정보를 통해 재미있는 퀴즈를 맞추며 포켓몬의 정보를 확인하고 배워보세요!',
  url: 'https://poke-korea.com/quiz',
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
        item: 'https://poke-korea.com/quiz',
      },
    ],
  },
  image: 'https://poke-korea.com/assets/image/ogImage.png',
}
