import { ReactNode } from 'react'
import Link from 'next/link'

import { ButtonSize, ButtonVariant, getButtonClass } from './button.util'

interface LinkButtonProps {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  showArrow?: boolean
  'aria-label'?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
}

const LinkButton = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showArrow = false,
  'aria-label': ariaLabel,
  target,
  rel,
}: LinkButtonProps) => {
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

export default LinkButton
