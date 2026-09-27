'use client'

import Link from 'next/link'

import {
  CHAMPIONS_FORMAT_SLUGS,
  ChampionsFormatSlug,
  getFormatLabel,
} from '~/utils/championsFormat.util'

interface ChampionsFormatTabProps {
  currentFormat: ChampionsFormatSlug
  basePath: string
  suffix?: string
  className?: string
}

const ChampionsFormatTab = ({
  currentFormat,
  basePath,
  suffix = '',
  className = '',
}: ChampionsFormatTabProps) => {
  return (
    <nav aria-label="포맷 선택" className={`w-full ${className}`}>
      <ul className="flex items-center gap-2 flex-wrap">
        {CHAMPIONS_FORMAT_SLUGS.map((slug) => {
          const isActive = slug === currentFormat
          const href = `${basePath}/${slug}${suffix}`
          const label = getFormatLabel(slug)

          return (
            <li key={slug}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                title={label}
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-200 border-2 ${
                  isActive
                    ? 'bg-primary-4 text-primary-1 border-primary-4'
                    : 'bg-transparent text-primary-3 border-primary-3 hover:text-gray-300 hover:border-primary-4'
                }`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default ChampionsFormatTab
