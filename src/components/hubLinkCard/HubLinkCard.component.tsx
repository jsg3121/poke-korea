import { ReactNode } from 'react'
import Link from 'next/link'

interface HubLinkCardProps {
  href: string
  title: string
  description: string
  icon: ReactNode
}

const HubLinkCard = ({ href, title, description, icon }: HubLinkCardProps) => {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-2xl bg-primary-4 p-4 shadow-lg transition-colors hover:bg-white-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
    >
      <span
        aria-hidden="true"
        className="text-primary-1 [&>svg]:h-6 [&>svg]:w-6 desktop:[&>svg]:h-8 desktop:[&>svg]:w-8"
      >
        {icon}
      </span>
      <span className="text-base font-bold text-primary-1 desktop:text-lg">
        {title}
      </span>
      <span className="text-xs desktop:text-sm text-primary-1 break-keep">
        {description}
      </span>
    </Link>
  )
}

export default HubLinkCard
