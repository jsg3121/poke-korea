'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ChampionsSubNavMobile = () => {
  const pathname = usePathname()

  const navItems = [
    { href: '/champions', label: '홈', exact: true },
    { href: '/champions/pokedex', label: '도감', exact: false },
    { href: '/champions/tier', label: '티어', exact: false },
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="w-full bg-primary-2 border-b border-solid border-primary-3">
      <ul className="w-full flex items-center justify-center gap-2 px-4">
        {navItems.map((item) => (
          <li key={item.href} className="flex-1">
            <Link
              href={item.href}
              className={`block px-3 py-2 text-sm text-center transition-colors duration-200 ${
                isActive(item.href, item.exact)
                  ? 'text-primary-4 font-bold border-b-2 border-primary-4'
                  : 'text-primary-3'
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

export default ChampionsSubNavMobile
