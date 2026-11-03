import { ReactNode } from 'react'

import IntentLink from '~/components/link/IntentLink.component'

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
    <IntentLink
      href={href}
      className={getButtonClass({ variant, size, fullWidth })}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
    >
      {children}
      {showArrow && <span aria-hidden="true">→</span>}
    </IntentLink>
  )
}

export default LinkButton
