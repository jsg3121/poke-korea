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
    <header className="w-full mb-4 px-1">
      <h2 className="text-xl desktop:text-2xl font-bold text-primary-4 leading-tight break-keep desktop:mb-2">
        {title}
      </h2>
      <div className="mt-1 flex items-baseline justify-between gap-3 desktop:mt-0 desktop:flex-1 desktop:justify-end">
        {description && (
          <p className="text-xs desktop:text-sm text-primary-3 break-keep desktop:mr-auto">
            {description}
          </p>
        )}
        {moreHref && (
          <Link
            href={moreHref}
            className="shrink-0 text-xs desktop:text-sm text-primary-3 hover:text-primary-4 transition-colors whitespace-nowrap"
            aria-label={`${title} ${moreLabel}`}
          >
            {moreLabel} →
          </Link>
        )}
      </div>
    </header>
  )
}

export default ChampionsHomeSectionHeader
