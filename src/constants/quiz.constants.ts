export const QUIZ_CONSTANTS = {
  TOTAL_QUESTIONS: 20,
  OPTION_COUNT: 4,
} as const

export const QUIZ_ROUTES = {
  MAIN: '/quiz',
  SILHOUETTE: '/quiz/silhouette',
  ABILITY: '/quiz/ability',
  POKEMON_TYPE: '/quiz/pokemon-type',
  TYPE_EFFECTIVENESS: '/quiz/type-effectiveness',
} as const

export const QUIZ_CONFIG = [
  {
    type: 'silhouette',
    title: '실루엣 퀴즈',
    description: '포켓몬의 실루엣을 보고 어떤 포켓몬인지 맞춰보세요!',
    route: QUIZ_ROUTES.SILHOUETTE,
    icon: '🔍',
  },
  {
    type: 'ability',
    title: '특성 퀴즈',
    description: '포켓몬 특성 설명을 보고 어떤 특성인지 맞춰보세요!',
    route: QUIZ_ROUTES.ABILITY,
    icon: '⚡',
  },
  {
    type: 'pokemon-type',
    title: '포켓몬 타입 퀴즈',
    description: '특정 타입을 가진 포켓몬을 골라보세요!',
    route: QUIZ_ROUTES.POKEMON_TYPE,
    icon: '🎯',
  },
  {
    type: 'type-effectiveness',
    title: '타입 상성 퀴즈',
    description: '공격, 방어 관계를 보고 답을 선택해 맞춰보세요!',
    route: QUIZ_ROUTES.TYPE_EFFECTIVENESS,
    icon: '⚔️',
  },
] as const

export const QUIZ_DESCRIPTION_LIST_DATA = {
  silhouette: {
    sections: [
      {
        title: '',
        content:
          '실루엣 퀴즈는 검은 그림자로 가려진 포켓몬의 외형만 보고 어떤 포켓몬인지 맞추는 퀴즈입니다. 포켓몬의 전체적인 실루엣, 귀나 꼬리 같은 특징적인 부위를 단서로 정답을 골라야 합니다.',
      },
      {
        title: '어떤 문제가 나오나요?',
        content:
          '1세대부터 최신 세대까지 다양한 포켓몬이 출제됩니다. 4개의 선택지 중 정확한 포켓몬 이름을 선택하면 됩니다. 비슷한 체형의 포켓몬이 선택지에 함께 등장할 수 있으니 세밀한 관찰이 필요합니다.',
      },
      {
        title: '난이도 안내',
        content:
          '평소 포켓몬 도감을 자주 보셨다면 무난하게 풀 수 있는 수준입니다. 잘 모르는 문제는 건너뛸 수 있으니 부담 없이 도전해보세요. 예상 소요 시간은 약 5~10분입니다.',
      },
    ],
    relatedLinks: [
      {
        href: '/list',
        text: '도감 페이지으로 포켓몬 확인하러 가기 →',
      },
    ],
  },
  ability: {
    sections: [
      {
        title: '특성 퀴즈?',
        content:
          '특성 퀴즈는 포켓몬 특성의 설명을 읽고 어떤 특성인지 맞추는 퀴즈입니다. 배틀에서 중요한 역할을 하는 특성들을 얼마나 잘 알고 있는지 테스트해보세요.',
      },
      {
        title: '어떤 문제가 나오나요?',
        content:
          '특성의 효과 설명이 주어지고, 4개의 선택지 중 해당 설명에 맞는 특성 이름을 고르면 됩니다. 위협, 부유, 변환자재 등 배틀에서 자주 쓰이는 특성부터 희귀한 특성까지 다양하게 출제됩니다.',
      },
      {
        title: '난이도 안내',
        content:
          '포켓몬 배틀을 즐기시는 분이라면 익숙한 특성이 많을 것입니다. 특성 도감을 미리 살펴보면 도움이 됩니다. 예상 소요 시간은 약 5~10분입니다.',
      },
    ],
    relatedLinks: [
      {
        href: '/ability',
        text: '특성을 더 자세히 알아보려면 특성 도감을 확인하세요',
      },
    ],
  },
  pokemonType: {
    sections: [
      {
        title: '포켓몬 타입 퀴즈?',
        content:
          '포켓몬 타입 퀴즈는 특정 타입이 주어졌을 때, 해당 타입을 가진 포켓몬을 골라내는 퀴즈입니다. 평소에 알고 있다고 생각했던 포켓몬의 타입이 정확한지 확인해볼 수 있습니다.',
      },
      {
        title: '어떤 문제가 나오나요?',
        content:
          '물, 불꽃, 풀 같은 단일 타입부터 복합 타입까지 다양한 문제가 출제됩니다. 4마리의 포켓몬 중 제시된 타입을 가진 포켓몬을 선택하면 됩니다. 외형과 타입이 다른 포켓몬도 있으니 주의하세요.',
      },
      {
        title: '난이도 안내',
        content:
          '포켓몬의 외형만으로 타입을 추측하기 어려운 경우도 있어 의외로 까다로울 수 있습니다. 포켓몬 도감에서 타입 정보를 미리 확인해두면 도움이 됩니다. 예상 소요 시간은 약 5~10분입니다.',
      },
    ],
    relatedLinks: [
      {
        href: '/list',
        text: '포켓몬 타입 정보를 도감에서 확인해보세요',
      },
    ],
  },
  typeEffectiveness: {
    sections: [
      {
        title: '타입 상성 퀴즈?',
        content:
          '타입 상성 퀴즈는 공격 타입과 방어 타입의 조합을 보고 데미지 배수를 맞추는 퀴즈입니다. 포켓몬 배틀의 핵심인 타입 상성표를 얼마나 정확하게 알고 있는지 확인해보세요.',
      },
      {
        title: '어떤 문제가 나오나요?',
        content:
          '공격 타입과 방어 타입이 주어지고, 효과가 굉장했다(2배), 보통이다(1배), 별로였다(0.5배), 효과가 없다(0배) 중 정확한 배수를 선택합니다. 단일 타입뿐 아니라 복합 타입 문제도 출제됩니다.',
      },
      {
        title: '난이도 안내',
        content:
          '18가지 타입 간의 상성 관계를 모두 외우는 것은 쉽지 않습니다. 타입 상성 계산기로 미리 연습하면 퀴즈에 도움이 됩니다. 예상 소요 시간은 약 5~10분입니다.',
      },
    ],
    relatedLinks: [
      {
        href: '/type-effectiveness',
        text: '타입 상성 계산기로 직접 계산해보세요',
      },
    ],
  },
} as const

export const QUIZ_CROSS_LINKS = [
  {
    type: 'silhouette',
    title: '실루엣 퀴즈 →',
    route: QUIZ_ROUTES.SILHOUETTE,
  },
  {
    type: 'ability',
    title: '특성 퀴즈 →',
    route: QUIZ_ROUTES.ABILITY,
  },
  {
    type: 'pokemon-type',
    title: '포켓몬 타입 퀴즈 →',
    route: QUIZ_ROUTES.POKEMON_TYPE,
  },
  {
    type: 'type-effectiveness',
    title: '타입 상성 퀴즈 →',
    route: QUIZ_ROUTES.TYPE_EFFECTIVENESS,
  },
] as const
