import { ButtonHTMLAttributes, ReactNode } from 'react'
import { ButtonSize, ButtonVariant, getButtonClass } from './buttonStyle'

/**
 * 액션 버튼 (DS 원자). 클릭 액션용 `<button>`.
 * 이동(링크)용 CTA는 LinkButton을 쓴다 — 시각 스타일은 buttonStyle에서 공유한다.
 *
 * 토큰 기반 규격(모바일 퍼스트, 터치 타겟 min-h-touch 보장).
 */

/**
 * className은 받지 않는다 — DS 규격을 외부 className으로 우회하면 선언형 일관성이
 * 깨지고, twMerge가 없어 토큰 충돌 시 병합되지 않는다. 레이아웃 제어는 상위 wrapper의
 * 책임으로 둔다(disabled 시각도 buttonStyle에 응집).
 */
interface ButtonComponentProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
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
  ...buttonProps
}: ButtonComponentProps) => {
  return (
    <button
      type={type}
      className={getButtonClass({ variant, size, fullWidth })}
      {...buttonProps}
    >
      {children}
      {showArrow && <span aria-hidden="true">→</span>}
    </button>
  )
}

export default ButtonComponent
