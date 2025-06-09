import Link from 'next/link'
import GithubIcon from '~/assets/icons/github.svg'
import GmailIcon from '~/assets/icons/gmail.svg'
import LogoIcon from '~/assets/logo.svg'
import HeaderSearchContainer from './header.search/HeaderSearchContainer'
import { useRouter } from 'next/navigation'

const HeaderContainer = () => {
  const router = useRouter()

  return (
    <header className="h-30 bg-primary-2 flex items-center justify-between flex-wrap sticky top-0 left-0 z-[500]">
      <Link href="/" className="w-56 h-8 block ml-8">
        <i className="icon-logo-link">
          <LogoIcon />
        </i>
      </Link>
      <div className="w-128 h-16 flex items-center justify-center gap-4 mr-8">
        <HeaderSearchContainer key={`search-key-${router.asPath}`} />
        <a
          href="https://github.com/jsg3121"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 text-[0px]"
        >
          <GithubIcon />
          GitHub 프로필
        </a>
        <a href="mailto:xodm95@gmail.com" className="w-8 h-8 text-[0px]">
          <GmailIcon />
          Gmail
        </a>
      </div>
      <nav className="w-full h-12 flex-shrink-0 self-end bg-primary-3 px-8">
        <ul className="w-full h-full flex items-center flex-row gap-4">
          <li className="min-w-fit h-full px-4">
            <Link
              href="/"
              className="w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-1"
            >
              홈 화면
            </Link>
          </li>
          <li className="min-w-fit h-full px-4">
            <Link
              href="/type-effectiveness"
              className="w-full h-12 text-base leading-[calc(3rem+2px)] text-primary-1"
            >
              상성 계산기
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default HeaderContainer
