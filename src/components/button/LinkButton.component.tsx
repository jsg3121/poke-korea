import Link from 'next/link'
import { ReactNode } from 'react'
import { ButtonSize, ButtonVariant, getButtonClass } from './buttonStyle'

/**
 * 링크형 CTA (DS 원자). 이동용 `<Link>`. 시각 스타일은 Button과 공유한다
 * (buttonStyle). 클릭 액션이 아니라 페이지 이동이면 Button 대신 이것을 쓴다.
 *
 * 예: "챔피언스 전체 도감 보기" 같은 섹션 CTA.
 */

/**
 * className/style 등 스타일 우회 속성은 받지 않는다(DS 규격 유지). 외부 링크 CTA에
 * 필요한 접근성/기능 속성(aria-label·target·rel)만 선별 허용한다.
 */
interface LinkButtonComponentProps {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  /** 오른쪽 화살표(→) 표시 (CTA 강조용) */
  showArrow?: boolean
  /** 링크 접근명 (아이콘만 있을 때 등) */
  'aria-label'?: string
  /** 새 탭 열기 등 (외부 링크 CTA) */
  target?: React.HTMLAttributeAnchorTarget
  /** target="_blank" 시 보안 권장(noopener noreferrer) */
  rel?: string
}

const LinkButtonComponent = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showArrow = false,
  'aria-label': ariaLabel,
  target,
  rel,
}: LinkButtonComponentProps) => {
  return (
    <Link
      href={href}
      className={getButtonClass({ variant, size, fullWidth })}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
    >
      {children}
      {showArrow && <span aria-hidden="true">→</span>}
    </Link>
  )
}

export default LinkButtonComponent
