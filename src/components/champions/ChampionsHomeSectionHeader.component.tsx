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
    // 모바일: 타이틀 행과 설명/CTA 행을 세로로 분리해 타이틀이 CTA에 밀려
    // 줄바꿈되지 않게 한다. 데스크톱: 타이틀+설명 블록과 CTA를 한 행에 양끝 배치.
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
