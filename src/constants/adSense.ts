export const ADSENSE_CLIENT =
  process.env.NODE_ENV === 'production' ? 'ca-pub-6481622724376761' : ''

/**
 * 포켓몬 상세 인콘텐츠 — 디스플레이 유형.
 * 지점1 = 능력치 뒤(모바일만) / 지점2 = 기술표 뒤.
 * 지점1 데스크톱은 `DETAIL_INCONTENT_INARTICLE_SLOTS`에 있다.
 */
export const DETAIL_INCONTENT_SLOTS = {
  // 지점 1 (능력치 후)
  point1Mobile: '3347283833', // 320×100
  // 지점 2 (기술표 후)
  point2Mobile: '3773704957', // 320×100
  point2Desktop: '3401601641', // 728×90
} as const

/**
 * 포켓몬 상세 인콘텐츠 — 데스크톱 인아티클 유형.
 * 지점1 = 능력치 뒤 / 지점3 = 최하단.
 */
export const DETAIL_INCONTENT_INARTICLE_SLOTS = {
  point1Desktop: '6928976245', // 인아티클
  point3Desktop: '8489469924', // 인아티클
} as const

/**
 * 타입 상성 상세(/type-effectiveness/[type]) — 18개 타입 라우트 공용.
 * 위치: 복합 타입 블록 뒤·고유 효과 앞.
 */
export const TYPE_DETAIL_SLOTS = {
  mobile: '4288859636', // 320×100 디스플레이
  desktop: '6177029135', // 인아티클
} as const

/**
 * 기술 상세(/moves/[id]) 하단 — 인아티클 유형.
 * 위치: 포켓몬 그리드 뒤.
 */
export const MOVES_DETAIL_BOTTOM_SLOTS = {
  mobile: '1694602458', // 인아티클
  desktop: '8946406513', // 인아티클
} as const

/**
 * 기술 상세(/moves/[id]) 상단 — 디스플레이 유형.
 * 위치: 히어로 아래·버전 탭바 위.
 */
export const MOVES_DETAIL_TOP_SLOTS = {
  mobile: '4984100459', // 320×100 디스플레이
  desktop: '4960049721', // 970×250 디스플레이
} as const

/**
 * 습득 기술 탭(/detail/[id]/moves) 상단 — 디스플레이 유형.
 * 위치: 히어로 아래·학습법 탭 위.
 */
export const DETAIL_MOVES_SLOTS = {
  mobile: '4026242009', // 320×100 디스플레이
  desktop: '5339323671', // 970×250 디스플레이
} as const

/**
 * 퀴즈 4종 결과 화면 상단 — 디스플레이 유형.
 * 위치: 결과 최상단(ResultHeader 앞).
 */
export const QUIZ_RESULT_SLOTS = {
  silhouette: { mobile: '5386861180', desktop: '1431304306' },
  ability: { mobile: '5230307889', desktop: '7459873641' },
  pokemonType: { mobile: '8942962819', desktop: '8236385800' },
  typeEffectiveness: { mobile: '6906351634', desktop: '8389811933' },
} as const

/**
 * 챔피언스 — 라우트별 1지점.
 * 홈=TOP3 뒤 / 도감=타입필터 아래 / 티어=S티어 위 / 상세=좌측 능력치 아래.
 */
export const CHAMPIONS_SLOTS = {
  homeMobile: '4439506677', // 320×100 디스플레이
  homeDesktop: '3370681590', // 인아티클
  pokedexMobile: '3000100797', // 320×100 디스플레이
  pokedexDesktop: '6939345800', // 인아티클
  tierMobile: '5434692448', // 320×100 디스플레이
  tierDesktop: '8682718029', // 인아티클
  detailMobile: '7869284098', // 320×100 디스플레이 (모바일 메타패널 뒤)
  detailDesktop: '1482884857', // 300×250 디스플레이 (데스크톱 좌측 능력치 아래)
  // 대회 — 목록=헤더 아래, 상세=대회정보 아래·TOP3 앞.
  tournamentsListMobile: '7386782370', // 320×100 디스플레이
  tournamentsListDesktop: '3598746451', // 인아티클
  tournamentsDetailMobile: '7478547641', // 320×100 디스플레이
  tournamentsDetailDesktop: '6033604039', // 인아티클
} as const
