import Link from 'next/link'

const HeaderNav = () => {
  return (
    <nav className="w-full h-16 flex-shrink-0 self-end px-8 mt-4 bg-primary-2 border-t border-primary-3 border-solid">
      <ul className="w-full h-16 max-w-[1280px] mx-auto flex items-center flex-row gap-4">
        <li className="min-w-fit h-full px-4 border-b-4 border-solid border-primary-4">
          <Link
            href="/"
            className="w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 font-bold"
          >
            홈 화면
          </Link>
        </li>
        <li className="min-w-fit h-full px-4">
          <Link
            href="/type-effectiveness"
            className="w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 "
          >
            상성 계산기
          </Link>
        </li>
        <li className="min-w-fit h-full px-4">
          <Link
            href="/moves"
            className="w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 "
          >
            기술 도감
          </Link>
        </li>
        <li className="min-w-fit h-full px-4">
          <Link
            href="/quiz"
            className="w-full h-12 text-base leading-[calc(4rem+2px)] text-primary-4 "
          >
            포켓몬 퀴즈
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default HeaderNav
