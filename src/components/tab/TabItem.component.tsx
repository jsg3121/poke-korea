import { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

export type TabItemVariant = 'underline' | 'fill'

/**
 * 공통 베이스 (레이아웃·터치타겟·트랜지션·포커스 링·줄바꿈 방지).
 *
 * 높이: 모바일 퍼스트로 차등한다.
 * - base(모바일): min-h-9(36px). 슬림하되 WCAG 2.2 2.5.8(AA, 24px)을 여유롭게 충족.
 *   네비 바 등에서 항목 높이가 컨테이너 높이와 맞아 active 밑줄이 하단에 붙는다.
 * - desktop:: min-h-touch(44px). 데스크톱은 기존 터치 타겟 기준을 유지한다.
 */
const BASE_CLASS =
  'inline-flex items-center justify-center min-h-9 desktop:min-h-touch whitespace-nowrap font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4'

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
    // 항상 border-b-2를 깔고 색만 토글한다). 폰트·패딩은 모바일 퍼스트 차등 —
    // 네비 균등 배분(좁은 폭 4등분)에서 12px로 들어가고, 데스크톱은 14px로 확장.
    base: 'px-2 desktop:px-4 text-xs desktop:text-sm border-b-2 border-solid',
    active: 'text-primary-4 border-primary-4',
    inactive: 'text-primary-3 border-transparent hover:text-primary-4',
  },
  fill: {
    // 채움형: 알약 배경. 선택 시 primary-4로 채우고 글자를 primary-1로 반전.
    // 배경이 꽉 차는 알약이라 모바일에서 부피가 커 보인다 → 높이는 BASE_CLASS의
    // min-h-9(모바일 36px / desktop 44px)을 따르고, 폰트·좌우 패딩도 모바일 퍼스트로
    // 줄였다가 desktop:로 확장한다.
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
const getTabItemClass = ({
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

/**
 * 탭 항목 하나 (DS 원자). 라벨 + active(선택됨) 상태를 가진 최소 단위.
 *
 * 동작 모드는 `href` 유무로 자동 분기한다.
 * - href 있음 → 페이지 이동 탭(next/link). active면 `aria-current="page"`.
 * - href 없음 → 상태 전환 탭(`<button>`). `role="tab"` + `aria-selected`.
 *
 * 항목들을 배열로 묶는 네비게이션 바/컨텐츠 탭은 이 원자를 조립해 만든다
 * (스크롤·도메인 매칭 등은 상위 책임).
 *
 * Button/LinkButton과 분리한 이유: 버튼은 "상태 없는 액션/이동"이지만 탭은
 * `active`(현재 선택됨)라는 의미축을 갖는다. 시각이 겹쳐도 의미가 다르므로
 * 별도 원자로 둔다.
 */

/**
 * className/style 등 스타일 우회 속성은 받지 않는다(DS 규격 유지). 다만 탭 조립 시
 * WAI-ARIA tablist 패턴에 필수인 접근성/식별 속성(id·aria-controls)은 선별 허용한다.
 */
interface TabItemBaseProps {
  children: ReactNode
  /** 밑줄형(네비) / 채움형(컨텐츠 전환) */
  variant?: TabItemVariant
  /** 현재 선택됨 표시 */
  active?: boolean
  /** 부모 폭을 채움(균등분할 컨테이너에서 사용) */
  fullWidth?: boolean
  /** 탭 식별자 (tablist 패턴에서 패널의 aria-labelledby 연결용) */
  id?: string
  /** 이 탭이 제어하는 패널의 id (WAI-ARIA tablist 패턴) */
  'aria-controls'?: string
}

/** 이동 모드: href 필수, next/link 렌더 */
interface TabItemLinkProps extends TabItemBaseProps {
  href: string
  /**
   * 이동 시 스크롤을 맨 위로 올리지 않는다(기본값 true = 올림).
   *
   * 탭이 sticky 크롬 안에 있어 화면에 계속 보이는 경우, 이동할 때마다 최상단으로
   * 튀면 방금 누른 탭이 시야에서 사라져 맥락이 끊긴다. 그런 배치에서만 false로 준다.
   */
  scroll?: boolean
  onClick?: never
  type?: never
}

/** 상태 전환 모드: href 없음, button 렌더 */
interface TabItemButtonProps
  extends TabItemBaseProps,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> {
  href?: undefined
}

type TabItemProps = TabItemLinkProps | TabItemButtonProps

const TabItem = (props: TabItemProps) => {
  const {
    children,
    variant = 'underline',
    active = false,
    fullWidth = false,
  } = props
  const className = getTabItemClass({ variant, active, fullWidth })

  // 이동 모드 — next/link. active면 현재 페이지 시맨틱.
  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        className={className}
        aria-current={active ? 'page' : undefined}
        id={props.id}
        aria-controls={props['aria-controls']}
        scroll={props.scroll}
      >
        {children}
      </Link>
    )
  }

  // 상태 전환 모드 — button. 탭 시맨틱(role="tab" + aria-selected).
  return (
    <button
      type={props.type ?? 'button'}
      role="tab"
      aria-selected={active}
      className={className}
      onClick={props.onClick}
      id={props.id}
      aria-controls={props['aria-controls']}
    >
      {children}
    </button>
  )
}

export default TabItem
