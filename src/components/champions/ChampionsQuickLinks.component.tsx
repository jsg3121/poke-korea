import Link from 'next/link'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsQuickLinksProps {
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
      href: `/champions/list`,
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
    <nav
      aria-label="챔피언스 주요 메뉴"
      className="w-full mb-8 desktop:mb-12"
    >
      <ul className="grid grid-cols-1 desktop:grid-cols-3 gap-3 desktop:gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block bg-primary-4 border border-solid border-primary-3 rounded-xl p-4 desktop:p-5 transition-all duration-200 hover:bg-primary-3 hover:border-primary-2 hover:shadow-lg"
              aria-label={`${item.title}로 이동`}
            >
              <div className="flex items-center gap-3 desktop:gap-4">
                <span
                  className="text-2xl desktop:text-3xl flex-shrink-0"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm desktop:text-base font-bold text-primary-1 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs desktop:text-sm text-primary-2 mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
                <span
                  className="text-primary-2 text-lg desktop:text-xl flex-shrink-0 transition-transform group-hover:translate-x-1"
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
