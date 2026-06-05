import Link from 'next/link'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsQuickLinksProps {
  /**
   * 현재 포맷 슬러그. 각 진입 카드 href 에서 포맷별 라우트 분기에 사용된다.
   * Phase 2: /champions/[format]/list 적용 완료.
   * Phase 3: /champions/[format]/tier 확정 시 적용 예정.
   */
  formatSlug: ChampionsFormatSlug
}

const ChampionsQuickLinks = ({ formatSlug }: ChampionsQuickLinksProps) => {
  const items: Array<{
    href: string
    title: string
    description: string
    icon: string
  }> = [
    {
      href: `/champions/${formatSlug}/list`,
      title: '챔피언스 도감',
      description: '전체 포켓몬 목록과 상세 정보',
      icon: '📖',
    },
    {
      href: `/champions/tier`,
      title: '티어 리스트',
      description: 'S/A/B/C/D 티어 분류와 사용률',
      icon: '🏆',
    },
    {
      href: `/champions/tournaments`,
      title: '최근 대회',
      description: '입상팀 풀빌드와 메타 분석',
      icon: '⚔️',
    },
  ]

  return (
    <nav aria-label="챔피언스 주요 메뉴" className="w-full mb-8 desktop:mb-12">
      <ul className="grid grid-cols-1 desktop:grid-cols-3 gap-4 desktop:gap-6">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block w-full h-24 bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 relative hover:scale-105 transition-transform"
              aria-label={`${item.title}로 이동`}
            >
              <div className="flex items-center gap-4 h-full">
                <span
                  className="w-16 h-16 shrink-0 flex items-center justify-center bg-primary-3 text-white rounded-md text-3xl"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-base desktop:text-lg font-bold text-primary-1 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs desktop:text-sm text-gray-600 mt-1 truncate">
                    {item.description}
                  </p>
                </div>
                <span
                  className="text-primary-1 text-xl shrink-0 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default ChampionsQuickLinks
