'use client'

import Link from 'next/link'
import TabHomeIcon from '~/assets/icons/tabHome.svg'
import QuizIcon from '~/assets/icons/quiz.svg'
import MovesListIcon from '~/assets/icons/movesList.svg'
import TypeEffectivenessIcon from '~/assets/icons/typeEffectiveness.svg'
import { usePathname } from 'next/navigation'

const MobileTabBar = () => {
  const pathname = usePathname()

  return (
    <nav className="w-full h-20 bg-primary-1 border-t border-solid border-primary-2 fixed bottom-0 left-0 z-50">
      <ul className="w-full h-full grid grid-cols-4">
        <li
          className={`w-full h-full text-center ${pathname === '/' || pathname.includes('/detail') ? 'border-t-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/"
            className={`w-full h-full flex flex-col justify-end gap-2 items-center text-base leading-[calc(1.5rem+2px)] text-primary-4 [&>svg]:h-8 ${pathname === '/' ? 'font-bold' : ''}`}
          >
            <TabHomeIcon />홈
          </Link>
        </li>
        <li
          className={`w-full h-full text-center ${pathname === '/type-effectiveness' ? 'border-t-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/type-effectiveness"
            className={`w-full h-full flex flex-col justify-end gap-2 items-center text-base leading-[calc(1.5rem+2px)] text-primary-4 [&>svg]:h-8 ${pathname === '/type-effectiveness' ? 'font-bold' : ''}`}
          >
            <TypeEffectivenessIcon />
            상성 계산기
          </Link>
        </li>
        <li
          className={`w-full h-full text-center ${pathname === '/moves' ? 'border-t-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/moves"
            className={`w-full h-full flex flex-col justify-end gap-2 items-center text-base leading-[calc(1.5rem+2px)] text-primary-4 [&>svg]:h-8 ${pathname === '/moves' ? 'font-bold' : ''}`}
          >
            <MovesListIcon />
            기술 도감
          </Link>
        </li>
        <li
          className={`w-full h-full text-center ${pathname.includes('/quiz') ? 'border-t-4 border-solid border-primary-4' : ''}`}
        >
          <Link
            href="/quiz"
            className={`w-full h-full flex flex-col justify-end gap-2 items-center text-base leading-[calc(1.5rem+2px)] text-primary-4 [&>svg]:h-8 ${pathname.includes('/quiz') ? 'font-bold' : ''}`}
          >
            <QuizIcon />
            포켓몬 퀴즈
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default MobileTabBar
