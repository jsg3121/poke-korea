'use client'

import { usePathname } from 'next/navigation'

import { CHAMPIONS_DEFAULT_FORMAT_SLUG } from '~/utils/championsFormat.util'
import TabItem from '~/components/tab/TabItem.component'

type SubNavSection = 'home' | 'list' | 'tier' | 'tournaments'

interface NavItem {
  section: SubNavSection
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  {
    section: 'home',
    label: '챔피언스',
    href: `/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}`,
  },
  {
    section: 'list',
    label: '챔피언스 도감',
    href: `/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}/list`,
  },
  {
    section: 'tier',
    label: '티어 리스트',
    href: `/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}/tier`,
  },
  { section: 'tournaments', label: '대회', href: '/champions/tournaments' },
]

const matchSection = (pathname: string, section: SubNavSection): boolean => {
  const segments = pathname.split('/').filter(Boolean) // ['champions', 'double', 'list', ...]
  if (segments[0] !== 'champions') return false
  if (segments[1] === 'tournaments') return section === 'tournaments'
  const sectionSegment = segments[2] // 'list' | 'tier' | undefined
  if (section === 'home') return !sectionSegment
  return sectionSegment === section
}

const ChampionsSubNav = () => {
  const pathname = usePathname()

  return (
    <nav
      aria-label="챔피언스 하위 메뉴"
      className="w-full h-9 desktop:h-10 bg-primary-1 border-b border-solid border-primary-2 sticky top-12 desktop:top-28 z-[500]"
    >
      <ul className="flex items-center h-full mobile:px-2 desktop:max-w-[1280px] desktop:mx-auto desktop:gap-1">
        {NAV_ITEMS.map((item) => {
          const active = matchSection(pathname, item.section)
          return (
            <li key={item.section} className="flex-1 desktop:flex-none">
              <TabItem
                variant="underline"
                href={item.href}
                active={active}
                fullWidth
              >
                {item.label}
              </TabItem>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default ChampionsSubNav
