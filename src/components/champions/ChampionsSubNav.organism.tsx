'use client'

import { usePathname } from 'next/navigation'
import TabItem from '~/components/tab/TabItem.component'
import { CHAMPIONS_DEFAULT_FORMAT_SLUG } from '~/utils/championsFormat.util'

/**
 * 챔피언스 상단 서브네비 (organism). TabItem(underline) 원자를 배열로 조립한다.
 *
 * 데/모 2벌(ChampionsSubNav + ChampionsSubNavMobile)을 CSS 반응형 단일로 통합한다
 * (UA 분기·display:none 없음, ADR-0007). 모바일 퍼스트 — base가 모바일.
 *
 * 모바일은 항목을 flex-1 균등 배분해 스크롤 없이 화면을 꽉 채운다(상용 검증: 12px로 4개
 * 항목이 340px 폭에 들어감). 데스크톱은 폭이 넉넉하므로 좌측 정렬 자연폭이다.
 *
 * 도메인 로직(navItems, pathname 매칭)은 이 organism이 담당하고, 시각/상태 표현은
 * TabItem 원자에 위임한다.
 */

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

/**
 * 활성 매칭:
 * - /champions/tournaments/... → 'tournaments'
 * - /champions/{format}/{section}/... → section 세그먼트로 매칭
 * - /champions/{format} → 'home'
 */
const matchSection = (pathname: string, section: SubNavSection): boolean => {
  const segments = pathname.split('/').filter(Boolean) // ['champions', 'vgc', 'list', ...]
  if (segments[0] !== 'champions') return false
  if (segments[1] === 'tournaments') return section === 'tournaments'
  const sectionSegment = segments[2] // 'list' | 'tier' | undefined
  if (section === 'home') return !sectionSegment
  return sectionSegment === section
}

const ChampionsSubNavOrganism = () => {
  const pathname = usePathname()

  return (
    <nav
      aria-label="챔피언스 하위 메뉴"
      className="w-full h-9 desktop:h-10 bg-primary-1 border-b border-solid border-primary-2 sticky top-12 desktop:top-28 z-10"
    >
      {/* 모바일: flex-1 균등 배분(스크롤 없이 꽉). 데스크톱: 좌측 정렬 자연폭 */}
      <ul className="flex items-center h-full px-2 desktop:max-w-[1280px] desktop:mx-auto desktop:px-8 desktop:gap-1">
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

export default ChampionsSubNavOrganism
