/**
 * TabItem 스타일 (DS 원자). 탭 "항목 하나"의 시각 규격.
 *
 * Button/LinkButton과 분리한 이유: 버튼은 "상태 없는 액션/이동"이지만 탭은
 * `active`(현재 선택됨)라는 의미축을 갖는다([[ds-build-new-components]]).
 * 시각이 겹치는 부분이 있어도 의미가 다르므로 별도 원자로 둔다(Button/LinkButton
 * 선례와 같은 "시각 공유, 의미 분리" 철학).
 *
 * 색은 등록된 토큰(primary-1~4)만 사용한다(임의값 금지, styling.md). 진한 네이비
 * 배경(primary-1) 위에서 active를 primary-4(밝은 흰계열)로 강조한다.
 * - underline: 네비게이션용. 배경 없이 텍스트 + 하단 밑줄로 현재 위치 표시.
 * - fill: 컨텐츠 전환용. 선택 항목을 배경 채움(알약)으로 명확히 표시.
 */

export type TabItemVariant = 'underline' | 'fill'

/**
 * 공통 베이스 (레이아웃·터치타겟·트랜지션·포커스 링·줄바꿈 방지).
 *
 * 높이: 모바일 퍼스트로 차등한다(ADR-0011).
 * - base(모바일): min-h-touch-tab(24px). 모바일 탭은 슬림한 게 일반적이라 버튼의
 *   44px 대신 WCAG 2.2 2.5.8(AA) 최소 24px을 적용한다. 단 이 24px 기준은 "항목 중심
 *   간격 24px 이상 확보"가 전제이므로, 이 원자를 배열로 조립하는 상위(네비 바·컨텐츠
 *   탭)에서 모바일 항목 간 간격(gap)을 24px 이상 두어야 한다.
 * - desktop:: min-h-touch(44px). 데스크톱은 기존 터치 타겟 기준을 유지한다.
 */
const BASE_CLASS =
  'inline-flex items-center justify-center min-h-touch-tab desktop:min-h-touch whitespace-nowrap font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4'

/**
 * variant별 클래스 — active/inactive를 각각 정적 매핑(purge 안전).
 * 레이아웃 시프트 방지를 위해 active에서 font-weight를 바꾸지 않고 색/밑줄/배경으로만
 * 상태를 구분한다.
 */
const VARIANT_CLASS: Record<
  TabItemVariant,
  { base: string; active: string; inactive: string }
> = {
  underline: {
    // 밑줄형: 배경 없음. 하단 2px 경계로 현재 위치 표시(레이아웃 시프트 방지를 위해
    // 항상 border-b-2를 깔고 색만 토글한다).
    base: 'px-3 desktop:px-4 text-sm border-b-2 border-solid',
    active: 'text-primary-4 border-primary-4',
    inactive: 'text-primary-3 border-transparent hover:text-primary-4',
  },
  fill: {
    // 채움형: 알약 배경. 선택 시 primary-4로 채우고 글자를 primary-1로 반전.
    // 배경이 꽉 차는 알약이라 모바일에서 부피가 커 보인다 → 터치타겟(min-h-touch
    // 44px)은 유지한 채 폰트·좌우 패딩만 모바일 퍼스트로 줄이고 desktop:로 확장한다.
    // 모서리는 캡슐(rounded-full) 대신 모서리만 둥글게, 모바일 퍼스트로 차등:
    // base(모바일) rounded-xl(12px) → desktop: rounded-2xl(16px).
    base: 'px-3 text-xs rounded-xl desktop:px-4 desktop:text-sm desktop:rounded-2xl',
    active: 'bg-primary-4 text-primary-1',
    inactive: 'bg-transparent text-primary-3 hover:text-primary-4',
  },
}

interface TabItemStyleParams {
  variant?: TabItemVariant
  active?: boolean
  fullWidth?: boolean
}

/** variant·active·fullWidth로 탭 항목 클래스 문자열을 조합한다. */
export const getTabItemClass = ({
  variant = 'underline',
  active = false,
  fullWidth = false,
}: TabItemStyleParams): string => {
  const v = VARIANT_CLASS[variant]
  return [
    BASE_CLASS,
    v.base,
    active ? v.active : v.inactive,
    fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ')
}
