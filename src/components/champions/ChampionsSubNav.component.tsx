'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ChampionsSubNav = () => {
  const pathname = usePathname()

  const navItems = [
    { href: '/champions', label: '홈', exact: true },
    { href: '/champions/pokedex', label: '포켓몬 도감', exact: false },
    { href: '/champions/tier', label: '티어 리스트', exact: false },
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="w-full bg-primary-2 border-b border-solid border-primary-3">
      <ul className="w-full max-w-[1280px] mx-auto flex items-center gap-1 px-5">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                isActive(item.href, item.exact)
                  ? 'text-primary-4 font-bold border-b-2 border-primary-4'
                  : 'text-primary-3 hover:text-primary-4'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default ChampionsSubNav
