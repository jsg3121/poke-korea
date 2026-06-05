'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CHAMPIONS_DEFAULT_FORMAT_SLUG } from '~/utils/championsFormat.util'

type SubNavSection = 'home' | 'list' | 'tier' | 'tournaments'

interface NavItem {
  section: SubNavSection
  label: string
  defaultHref: string
}

const ChampionsSubNavMobile = () => {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      section: 'home',
      label: '챔피언스',
      defaultHref: `/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}`,
    },
    {
      section: 'list',
      label: '챔피언스 도감',
      defaultHref: `/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}/list`,
    },
    {
      section: 'tier',
      label: '티어 리스트',
      defaultHref: `/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}/tier`,
    },
    {
      section: 'tournaments',
      label: '대회',
      defaultHref: '/champions/tournaments',
    },
  ]

  /**
   * 활성 매칭:
   * - /champions/tournaments/... → 'tournaments' (포맷 세그먼트 없음)
   * - /champions/{format}/{section}/... → section 세그먼트로 매칭
   * - /champions/{format} → 'home'
   */
  const isActive = (section: SubNavSection) => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments[0] !== 'champions') return false
    if (segments[1] === 'tournaments') return section === 'tournaments'
    const sectionSegment = segments[2]
    if (section === 'home') return !sectionSegment
    return sectionSegment === section
  }

  return (
    <nav className="w-full h-12 bg-primary-2 sticky top-16 z-30">
      <ul className="w-full h-full flex items-center justify-center gap-1 px-2 border-t border-solid border-primary-1">
        {navItems.map((item) => {
          const active = isActive(item.section)
          return (
            <li key={item.section} className="flex-1">
              <Link
                href={item.defaultHref}
                aria-current={active ? 'page' : undefined}
                className={`block px-2 py-2 text-xs text-center whitespace-nowrap ${
                  active
                    ? 'text-primary-4 font-bold border-b-2 border-primary-4'
                    : 'text-primary-3'
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

export default ChampionsSubNavMobile
