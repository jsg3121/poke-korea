import Link from 'next/link'

interface ChampionsHomeSectionHeaderProps {
  title: string
  description?: string
  moreHref?: string
  moreLabel?: string
}

const ChampionsHomeSectionHeader = ({
  title,
  description,
  moreHref,
  moreLabel = '전체 보기',
}: ChampionsHomeSectionHeaderProps) => {
  return (
    <header className="w-full flex items-end justify-between mb-4 px-1">
      <div className="flex-1">
        <h2 className="text-xl desktop:text-2xl font-bold text-primary-4 leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs desktop:text-sm text-primary-3">
            {description}
          </p>
        )}
      </div>
      {moreHref && (
        <Link
          href={moreHref}
          className="ml-3 text-xs desktop:text-sm text-primary-3 hover:text-primary-4 transition-colors whitespace-nowrap"
          aria-label={`${title} ${moreLabel}`}
        >
          {moreLabel} →
        </Link>
      )}
    </header>
  )
}

export default ChampionsHomeSectionHeader
