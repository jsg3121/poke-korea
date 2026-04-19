'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const HeaderNav = () => {
  const pathname = usePathname()

  return (
    <nav className="w-full h-16 flex-shrink-0 self-end px-8 mt-6 bg-primary-1 border-b border-solid border-primary-2">
      <ul className="w-full h-16 max-w-[1280px] mx-auto flex items-center flex-row gap-4">
        <li
          className={`min-w-fit h-full px-4 ${pathname === '/' ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/"
            className={`w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 ${pathname === '/' ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            홈
          </Link>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname === '/list' || pathname.includes('/detail') ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/list"
            className={`w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 ${pathname === '/list' || pathname.includes('/detail') ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            포켓몬 도감
          </Link>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname === '/moves' || pathname.match(/\/moves\/[0-9]/) ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/moves"
            className={`w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 ${pathname === '/moves' || pathname.match(/\/moves\/[0-9]/) ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            기술 도감
          </Link>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname.includes('/ability') ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/ability"
            className={`w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 ${pathname.includes('/ability') ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            특성 도감
          </Link>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname === '/type-effectiveness' ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/type-effectiveness"
            className={`w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 ${pathname === '/type-effectiveness' ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            상성 계산기
          </Link>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname.includes('/quiz') ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/quiz"
            className={`w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 ${pathname.includes('/quiz') ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            포켓몬 퀴즈
          </Link>
        </li>
        <li
          className={`group relative min-w-fit h-full px-4 ${pathname.includes('/champions') ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/champions"
            className={`w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 ${pathname.includes('/champions') ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            챔피언스
          </Link>
          {!pathname.includes('/champions') && (
            <ul className="absolute top-full left-0 w-32 bg-primary-1 border border-solid border-primary-2 rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <li>
                <Link
                  href="/champions"
                  className="block px-4 py-3 text-sm text-primary-4 hover:bg-primary-2"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/champions/pokedex"
                  className="block px-4 py-3 text-sm text-primary-4 hover:bg-primary-2"
                >
                  포켓몬 도감
                </Link>
              </li>
              <li>
                <Link
                  href="/champions/tier"
                  className="block px-4 py-3 text-sm text-primary-4 hover:bg-primary-2 rounded-b-lg"
                >
                  티어 리스트
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default HeaderNav
