'use client'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import GithubIcon from '~/assets/icons/github.svg'
import GmailIcon from '~/assets/icons/gmail.svg'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

const HeaderHamburgerNavigation = () => {
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  useBodyScrollLock(isOpenHamburger)

  const handleClickButton = () => {
    if (isOpenHamburger) {
      setIsAnimating(() => true) // 애니메이션 시작
      setIsOpenHamburger(() => false)
      setTimeout(() => {
        setIsAnimating(() => false)
      }, 300) // 애니메이션 시간에 맞춤
    } else {
      setIsOpenHamburger(() => true)
    }
  }

  return (
    <Fragment>
      <button
        className="w-7 h-6 flex flex-col justify-between before:content-[''] before:w-full before:h-1 before:rounded-full before:bg-white-1 before:block after:content-[''] after:w-full after:h-1 after:rounded-full after:bg-white-1 after:block"
        aria-label="햄버거 네비게이션 버튼"
        onClick={handleClickButton}
      >
        <i className="w-full h-1 rounded-full bg-white-1"></i>
      </button>
      <aside
        className={`w-screen h-[calc(100vh-4rem)] absolute top-16 right-0 ${
          isOpenHamburger || isAnimating ? 'block' : 'hidden'
        }`}
      >
        <div
          className={`w-48 h-[calc(100%-4rem)] flex flex-col justify-between fixed bg-primary-1 top-16 -right-48 z-[500] animate-[0.3s_ease_0s_1_forwards] ${
            isOpenHamburger
              ? 'animate-[slide-in_0.3s_ease_0s_1_forwards]'
              : 'animate-[slide-out_0.3s_ease_0s_1_forwards]'
          }`}
        >
          <nav className="w-full mt-4 px-5">
            <ul className="w-full flex flex-col gap-4">
              <li className="w-full">
                <Link
                  href="/"
                  className="w-full h-6 text-base leading-[calc(1.5rem+2px)] text-primary-4"
                >
                  홈
                </Link>
              </li>
              <li className="w-full">
                <Link
                  href="/type-effectiveness"
                  className="w-full h-6 text-base leading-[calc(1.5rem+2px)] text-primary-4"
                >
                  상성 계산기
                </Link>
              </li>
              <li className="w-full">
                <Link
                  href="/moves"
                  className="w-full h-6 text-base leading-[calc(1.5rem+2px)] text-primary-4"
                >
                  기술 도감
                </Link>
              </li>
              <li className="w-full">
                <Link
                  href="/quiz"
                  className="w-full h-6 text-base leading-[calc(1.5rem+2px)] text-primary-4"
                >
                  포켓몬 퀴즈
                </Link>
              </li>
            </ul>
          </nav>
          <div className="w-full h-12 flex items-center justify-center gap-4">
            <a
              href="https://github.com/jsg3121"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 text-[0]"
            >
              <GithubIcon />
              GitHub 프로필
            </a>
            <a href="mailto:xodm95@gmail.com" className="w-8 h-8 text-[0]">
              <GmailIcon />
              Gmail
            </a>
          </div>
        </div>
        {isOpenHamburger && (
          <div className="w-full h-full bg-black/45 absolute top-0 right-0 z-[400]" />
        )}
      </aside>
    </Fragment>
  )
}

export default HeaderHamburgerNavigation
