import { ButtonHTMLAttributes, ReactNode } from 'react'
import { ButtonSize, ButtonVariant, getButtonClass } from './buttonStyle'

/**
 * 액션 버튼 (DS 원자). 클릭 액션용 `<button>`.
 * 이동(링크)용 CTA는 LinkButton을 쓴다 — 시각 스타일은 buttonStyle에서 공유한다.
 *
 * 토큰 기반 규격(모바일 퍼스트, 터치 타겟 min-h-touch 보장).
 */

interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  /** 오른쪽 화살표(→) 표시 (CTA 강조용) */
  showArrow?: boolean
}

const ButtonComponent = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showArrow = false,
  type = 'button',
  className,
  ...buttonProps
}: ButtonComponentProps) => {
  return (
    <button
      type={type}
      className={`${getButtonClass({ variant, size, fullWidth })} disabled:opacity-50 disabled:cursor-not-allowed${
        className ? ` ${className}` : ''
      }`}
      {...buttonProps}
    >
      {children}
      {showArrow && <span aria-hidden="true">→</span>}
    </button>
  )
}

export default ButtonComponent
