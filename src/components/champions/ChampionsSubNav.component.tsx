'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CHAMPIONS_DEFAULT_FORMAT_SLUG } from '~/utils/championsFormat.util'

type SubNavSection = 'home' | 'list' | 'tier'

interface NavItem {
  /** 라우트 매칭에 사용되는 챔피언스 영역 구분자 */
  section: SubNavSection
  label: string
  /** 클릭 시 이동할 기본 URL — 포맷 슬러그 기본값 사용 */
  defaultHref: string
}

const ChampionsSubNav = () => {
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
  ]

  /**
   * 활성 매칭: /champions/{format}/{section}/... 패턴에서 세 번째 세그먼트로 결정.
   * 홈은 세 번째 세그먼트가 없는 경우.
   */
  const isActive = (section: SubNavSection) => {
    const segments = pathname.split('/').filter(Boolean) // ['champions', 'vgc', 'list', ...]
    if (segments[0] !== 'champions') return false
    const sectionSegment = segments[2] // 'list' | 'tier' | undefined
    if (section === 'home') return !sectionSegment
    return sectionSegment === section
  }

  return (
    <nav className="w-full h-10 bg-primary-1 border-b border-solid border-primary-2 px-8 sticky top-28 z-10">
      <ul className="w-full h-full max-w-[1280px] mx-auto flex items-center gap-1">
        {navItems.map((item) => {
          const active = isActive(item.section)
          return (
            <li key={item.section}>
              <Link
                href={item.defaultHref}
                aria-current={active ? 'page' : undefined}
                className={`block px-4 py-1.5 text-sm transition-colors duration-200 ${
                  active
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

export default ChampionsSubNav
