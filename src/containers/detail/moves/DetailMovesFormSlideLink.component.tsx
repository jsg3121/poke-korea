import { ReactNode } from 'react'
import Link from 'next/link'

interface DetailMovesFormSlideLinkProps {
  href: string
  disabled: boolean
  label: string
  children: ReactNode
}

const SLIDE_LINK_BASE_CLASS =
  'inline-flex h-7 w-7 items-center justify-center rounded-lg border border-solid text-xs transition-colors desktop:h-9 desktop:w-9 desktop:text-sm'

const DetailMovesFormSlideLink = ({
  href,
  disabled,
  label,
  children,
}: DetailMovesFormSlideLinkProps) => {
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className={`${SLIDE_LINK_BASE_CLASS} pointer-events-none select-none border-primary-3 bg-primary-3 text-primary-2`}
      >
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${SLIDE_LINK_BASE_CLASS} border-primary-3 bg-white-1 text-primary-1 hover:bg-primary-4`}
    >
      {children}
    </Link>
  )
}

export default DetailMovesFormSlideLink
