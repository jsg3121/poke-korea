export const ADSENSE_CLIENT =
  process.env.NODE_ENV === 'production' ? 'ca-pub-6481622724376761' : ''
export const ADSENSE_SLOT =
  process.env.NODE_ENV === 'production' ? '1410249585' : ''

/**
 * 상세(detail) 페이지 인콘텐츠 광고 슬롯 (RES-004 배치안, 지점 1·2).
 * 지점 1 = 능력치↔기본정보 사이 / 지점 2 = 기술표↔타입상성 사이.
 * 기기별 성과 분리 추적을 위해 모바일(320×100)·데스크톱(728×90) 슬롯을 나눈다.
 *
 * 슬롯 값이 빈 문자열이면 해당 컴포넌트는 렌더되지 않는다(빈 광고 요청 방지).
 * 크기(320×100/728×90)는 코드의 <ins> 클래스가 결정하므로, 슬롯은 디스플레이
 * 유형으로만 발급하면 된다(발급 크기는 무관).
 */
export const DETAIL_INCONTENT_SLOTS = {
  // 지점 1 (능력치 후)
  point1Mobile: '3347283833', // 320×100
  point1Desktop: '8834459942', // 728×90
  // 지점 2 (기술표 후)
  point2Mobile: '3773704957', // 320×100
  point2Desktop: '3401601641', // 728×90
} as const

/**
 * 기술 상세(/moves/[id]) 하단 인아티클 광고 슬롯 (RES-004).
 * 포켓몬 그리드 소비 후 하단 — moves 최고 효율 지점(구버전 모바일 인아티클
 * CTR 1.81%). 기기별 성과 분리를 위해 PC·모바일 슬롯을 나눈다.
 *
 * 구버전 모바일 인아티클(4353208706)은 ability 상세와 공유돼 성과가 섞였으므로,
 * moves만 온전히 추적하도록 전용 슬롯을 새로 발급한다(공유 분리).
 *
 * 슬롯 값이 빈 문자열이면 렌더하지 않는다. 인아티클 유형으로 발급한다.
 */
export const MOVES_DETAIL_BOTTOM_SLOTS = {
  mobile: '1694602458', // 인아티클
  desktop: '8946406513', // 인아티클
} as const
