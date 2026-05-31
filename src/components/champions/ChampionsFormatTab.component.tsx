'use client'

import Link from 'next/link'

export type ChampionsFormatSlug = 'vgc' | 'bss'

interface ChampionsFormatTabProps {
  currentFormat: ChampionsFormatSlug
  basePath: string
}

const FORMAT_ITEMS: Array<{
  slug: ChampionsFormatSlug
  label: string
  description: string
}> = [
  { slug: 'vgc', label: 'VGC (더블)', description: '포켓몬 챔피언스 VGC' },
  { slug: 'bss', label: 'BSS (싱글)', description: 'Battle Stadium Singles' },
]

const ChampionsFormatTab = ({
  currentFormat,
  basePath,
}: ChampionsFormatTabProps) => {
  return (
    <nav
      aria-label="포맷 선택"
      className="w-full max-w-[1280px] mx-auto px-4 pt-4"
    >
      <ul className="flex items-center gap-2 border-b border-solid border-primary-2">
        {FORMAT_ITEMS.map((item) => {
          const isActive = item.slug === currentFormat
          const href = `${basePath}/${item.slug}`

          return (
            <li key={item.slug}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                title={item.description}
                className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-4 font-bold border-b-2 border-primary-4'
                    : 'text-primary-3 hover:text-primary-4'
                }`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default ChampionsFormatTab
