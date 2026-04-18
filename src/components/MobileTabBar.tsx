'use client'

import Link from 'next/link'
import TabHomeIcon from '~/assets/icons/tabHome.svg'
import QuizIcon from '~/assets/icons/quiz.svg'
import MovesListIcon from '~/assets/icons/movesList.svg'
import TypeEffectivenessIcon from '~/assets/icons/typeEffectiveness.svg'
import AbilityIcon from '~/assets/icons/ability.svg'
import PokeballIcon from '~/assets/icons/pokeball.svg'
import ChampionsIcon from '~/assets/icons/champions.svg'
import { usePathname } from 'next/navigation'

const MobileTabBar = () => {
  const pathname = usePathname()

  return (
    <nav className="w-full h-16 bg-primary-1 border-t border-solid border-primary-2 fixed bottom-0 left-0 z-50 safe-area-bottom">
      <ul className="w-full h-full grid grid-cols-7">
        <li
          className={`w-full h-full ${pathname === '/' ? 'border-t-2 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/"
            className={`w-full h-full flex flex-col justify-center gap-1 items-center text-[9px] text-primary-4 [&>svg]:h-5 [&>svg]:w-5 ${pathname === '/' ? 'font-bold' : ''}`}
          >
            <TabHomeIcon />
            <span>홈</span>
          </Link>
        </li>
        <li
          className={`w-full h-full ${pathname === '/list' || pathname.includes('/detail') ? 'border-t-2 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/list"
            className={`w-full h-full flex flex-col justify-center gap-1 items-center text-[9px] text-primary-4 [&>svg]:h-5 [&>svg]:w-5 ${pathname === '/list' || pathname.includes('/detail') ? 'font-bold' : ''}`}
          >
            <PokeballIcon />
            <span>도감</span>
          </Link>
        </li>
        <li
          className={`w-full h-full ${pathname === '/moves' || pathname.match(/\/moves\/[0-9]/) ? 'border-t-2 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/moves"
            className={`w-full h-full flex flex-col justify-center gap-1 items-center text-[9px] text-primary-4 [&>svg]:h-5 [&>svg]:w-5 ${pathname === '/moves' || pathname.match(/\/moves\/[0-9]/) ? 'font-bold' : ''}`}
          >
            <MovesListIcon />
            <span>기술</span>
          </Link>
        </li>
        <li
          className={`w-full h-full ${pathname.includes('/ability') ? 'border-t-2 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/ability"
            className={`w-full h-full flex flex-col justify-center gap-1 items-center text-[9px] text-primary-4 [&>svg]:h-5 [&>svg]:w-5 ${pathname.includes('/ability') ? 'font-bold' : ''}`}
          >
            <AbilityIcon />
            <span>특성</span>
          </Link>
        </li>
        <li
          className={`w-full h-full ${pathname === '/type-effectiveness' ? 'border-t-2 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/type-effectiveness"
            className={`w-full h-full flex flex-col justify-center gap-1 items-center text-[9px] text-primary-4 [&>svg]:h-5 [&>svg]:w-5 ${pathname === '/type-effectiveness' ? 'font-bold' : ''}`}
          >
            <TypeEffectivenessIcon />
            <span>상성</span>
          </Link>
        </li>
        <li
          className={`w-full h-full ${pathname.includes('/quiz') ? 'border-t-2 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/quiz"
            className={`w-full h-full flex flex-col justify-center gap-1 items-center text-[9px] text-primary-4 [&>svg]:h-5 [&>svg]:w-5 ${pathname.includes('/quiz') ? 'font-bold' : ''}`}
          >
            <QuizIcon />
            <span>퀴즈</span>
          </Link>
        </li>
        <li
          className={`w-full h-full ${pathname.includes('/champions') ? 'border-t-2 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/champions"
            className={`w-full h-full flex flex-col justify-center gap-1 items-center text-[9px] text-primary-4 [&>svg]:h-5 [&>svg]:w-5 ${pathname.includes('/champions') ? 'font-bold' : ''}`}
          >
            <ChampionsIcon />
            <span>챔피언스</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default MobileTabBar
