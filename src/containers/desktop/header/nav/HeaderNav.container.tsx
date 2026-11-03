'use client'

import { usePathname } from 'next/navigation'

import IntentLink from '~/components/link/IntentLink.component'

const HeaderNav = () => {
  const pathname = usePathname()

  return (
    <nav className="w-full h-12 flex-shrink-0 self-end px-8 mt-3 bg-primary-1 border-b border-solid border-primary-2">
      <ul className="w-full h-12 max-w-[1280px] mx-auto flex items-center flex-row gap-4">
        <li
          className={`min-w-fit h-full px-4 ${pathname === '/' ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <IntentLink
            href="/"
            className={`w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-4 ${pathname === '/' ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            홈
          </IntentLink>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname === '/list' || pathname.includes('/detail') ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <IntentLink
            href="/list"
            className={`w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-4 ${pathname === '/list' || pathname.includes('/detail') ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            포켓몬 도감
          </IntentLink>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname === '/moves' || pathname.match(/\/moves\/[0-9]/) ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <IntentLink
            href="/moves"
            className={`w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-4 ${pathname === '/moves' || pathname.match(/\/moves\/[0-9]/) ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            기술 도감
          </IntentLink>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname.includes('/ability') ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <IntentLink
            href="/ability"
            className={`w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-4 ${pathname.includes('/ability') ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            특성 도감
          </IntentLink>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname === '/type-effectiveness' ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <IntentLink
            href="/type-effectiveness"
            className={`w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-4 ${pathname === '/type-effectiveness' ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            상성 계산기
          </IntentLink>
        </li>
        <li
          className={`min-w-fit h-full px-4 ${pathname.includes('/quiz') ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <IntentLink
            href="/quiz"
            className={`w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-4 ${pathname.includes('/quiz') ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            포켓몬 퀴즈
          </IntentLink>
        </li>
        <li
          className={`group relative min-w-fit h-full px-4 ${pathname.includes('/champions') ? 'border-b-4 border-solid border-primary-4' : ''}`}
        >
          <IntentLink
            href="/champions"
            className={`w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-4 ${pathname.includes('/champions') ? 'font-bold' : 'hover:scale-110 transition-transform duration-200'}`}
          >
            챔피언스
          </IntentLink>
          {!pathname.includes('/champions') && (
            <ul className="absolute top-full left-0 w-32 bg-primary-1 border border-solid border-primary-2 rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <li>
                <IntentLink
                  href="/champions"
                  className="block px-4 py-3 text-sm text-primary-4 hover:bg-primary-2"
                >
                  홈
                </IntentLink>
              </li>
              <li>
                <IntentLink
                  href="/champions/list"
                  className="block px-4 py-3 text-sm text-primary-4 hover:bg-primary-2"
                >
                  포켓몬 도감
                </IntentLink>
              </li>
              <li>
                <IntentLink
                  href="/champions/tier"
                  className="block px-4 py-3 text-sm text-primary-4 hover:bg-primary-2"
                >
                  티어 리스트
                </IntentLink>
              </li>
              <li>
                <IntentLink
                  href="/champions/tournaments"
                  className="block px-4 py-3 text-sm text-primary-4 hover:bg-primary-2 rounded-b-lg"
                >
                  대회
                </IntentLink>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default HeaderNav
