import Link from 'next/link'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { getTabItemClass, TabItemVariant } from './tabItemStyle'

/**
 * 탭 항목 하나 (DS 원자). 라벨 + active(선택됨) 상태를 가진 최소 단위.
 *
 * 동작 모드는 `href` 유무로 자동 분기한다.
 * - href 있음 → 페이지 이동 탭(next/link). active면 `aria-current="page"`.
 * - href 없음 → 상태 전환 탭(`<button>`). `role="tab"` + `aria-selected`.
 *
 * 항목들을 배열로 묶는 네비게이션 바/컨텐츠 탭(organism·molecule)은 이 원자를
 * 조립해 만든다(스크롤·도메인 매칭 등은 상위 책임). 시각 규격은 tabItemStyle 참조.
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
  onClick?: never
  type?: never
}

/** 상태 전환 모드: href 없음, button 렌더 */
interface TabItemButtonProps
  extends TabItemBaseProps,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> {
  href?: undefined
}

type TabItemComponentProps = TabItemLinkProps | TabItemButtonProps

const TabItemComponent = (props: TabItemComponentProps) => {
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

export default TabItemComponent
