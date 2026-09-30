import { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-12 text-center desktop:py-16">
      {icon && (
        <span
          aria-hidden="true"
          className="text-primary-3 [&>svg]:h-16 [&>svg]:w-16"
        >
          {icon}
        </span>
      )}
      <p className="text-lg font-bold text-primary-4 desktop:text-xl">
        {title}
      </p>
      {description && (
        <p className="text-sm text-primary-3 desktop:text-base">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
