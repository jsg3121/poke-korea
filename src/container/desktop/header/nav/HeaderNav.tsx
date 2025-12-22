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
      </ul>
    </nav>
  )
}

export default HeaderNav
