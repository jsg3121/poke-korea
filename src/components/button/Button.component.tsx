import { ButtonHTMLAttributes, ReactNode } from 'react'

import { ButtonSize, ButtonVariant, getButtonClass } from './button.util'

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  showArrow?: boolean
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showArrow = false,
  type = 'button',
  ...buttonProps
}: ButtonProps) => {
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

export default Button
