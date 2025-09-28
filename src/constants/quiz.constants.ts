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
