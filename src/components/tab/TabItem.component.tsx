import { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

export type TabItemVariant = 'underline' | 'fill'

// min-h는 WCAG 2.2 SC 2.5.8(24px)을 충족하는 값이다.
const BASE_CLASS =
  'inline-flex items-center justify-center min-h-9 desktop:min-h-touch whitespace-nowrap font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4'

const VARIANT_CLASS: Record<
  TabItemVariant,
  { base: string; active: string; inactive: string }
> = {
  underline: {
    base: 'px-2 desktop:px-4 text-xs desktop:text-sm border-b-2 border-solid',
    active: 'text-primary-4 border-primary-4',
    inactive: 'text-primary-3 border-transparent hover:text-primary-4',
  },
  fill: {
    base: 'px-3 text-xs rounded-xl desktop:px-4 desktop:text-sm desktop:rounded-2xl',
    active: 'bg-primary-4 text-primary-1',
    inactive: 'bg-transparent text-primary-3 hover:text-primary-4',
  },
}

interface TabItemStyleParams {
  variant?: TabItemVariant
  active?: boolean
  fullWidth?: boolean
}

const getTabItemClass = ({
  variant = 'underline',
  active = false,
  fullWidth = false,
}: TabItemStyleParams): string => {
  const v = VARIANT_CLASS[variant]
  return [
    BASE_CLASS,
    v.base,
    active ? v.active : v.inactive,
    fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

interface TabItemBaseProps {
  children: ReactNode
  variant?: TabItemVariant
  active?: boolean
  fullWidth?: boolean
  id?: string
  'aria-controls'?: string
}

interface TabItemLinkProps extends TabItemBaseProps {
  href: string
  scroll?: boolean
  onClick?: never
  type?: never
}

interface TabItemButtonProps
  extends TabItemBaseProps,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> {
  href?: undefined
}

type TabItemProps = TabItemLinkProps | TabItemButtonProps

const TabItem = (props: TabItemProps) => {
  const {
    children,
    variant = 'underline',
    active = false,
    fullWidth = false,
  } = props
  const className = getTabItemClass({ variant, active, fullWidth })

  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        className={className}
        aria-current={active ? 'page' : undefined}
        id={props.id}
        aria-controls={props['aria-controls']}
        scroll={props.scroll}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      role="tab"
      aria-selected={active}
      className={className}
      onClick={props.onClick}
      id={props.id}
      aria-controls={props['aria-controls']}
    >
      {children}
    </button>
  )
}

export default TabItem
