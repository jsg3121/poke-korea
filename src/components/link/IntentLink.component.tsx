'use client'

import { ComponentProps, FocusEvent, MouseEvent, TouchEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type IntentLinkProps = Omit<ComponentProps<typeof Link>, 'prefetch' | 'href'> & {
  href: string
}

const IntentLink = ({
  href,
  onMouseEnter,
  onTouchStart,
  onFocus,
  ...props
}: IntentLinkProps) => {
  const router = useRouter()

  const prefetchOnIntent = () => router.prefetch(href)

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    prefetchOnIntent()
    onMouseEnter?.(event)
  }

  const handleTouchStart = (event: TouchEvent<HTMLAnchorElement>) => {
    prefetchOnIntent()
    onTouchStart?.(event)
  }

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    prefetchOnIntent()
    onFocus?.(event)
  }

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onFocus={handleFocus}
      {...props}
    />
  )
}

export default IntentLink
