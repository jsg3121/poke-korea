import Link from 'next/link'
import { ReactNode } from 'react'
import { ButtonSize, ButtonVariant, getButtonClass } from './buttonStyle'

/**
 * 링크형 CTA (DS 원자). 이동용 `<Link>`. 시각 스타일은 Button과 공유한다
 * (buttonStyle). 클릭 액션이 아니라 페이지 이동이면 Button 대신 이것을 쓴다.
 *
 * 예: "챔피언스 전체 도감 보기" 같은 섹션 CTA.
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
}

const LinkButtonComponent = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showArrow = false,
  'aria-label': ariaLabel,
}: LinkButtonComponentProps) => {
  return (
    <Link
      href={href}
      className={getButtonClass({ variant, size, fullWidth })}
      aria-label={ariaLabel}
    >
      {children}
      {showArrow && <span aria-hidden="true">→</span>}
    </Link>
  )
}

export default LinkButtonComponent
