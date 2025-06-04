import Link from 'next/link'
import { Fragment, useState } from 'react'
import styled, { css } from 'styled-components'
import GithubIcon from '~/assets/icons/github.svg'
import GmailIcon from '~/assets/icons/gmail.svg'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

type StyleProps = {
  isAnimating: boolean
  isOpenHamburger: boolean
}

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
      <Button aria-label="햄버거 네비게이션 버튼" onClick={handleClickButton}>
        <i></i>
      </Button>
      <Aside
        isAnimating={isAnimating}
        isOpenHamburger={isOpenHamburger}
        data-is-open={isOpenHamburger ? 'open' : 'close'}
      >
        <div>
          <nav>
            <ul>
              <li>
                <Link href="/">메인 화면</Link>
              </li>
              <li>
                <Link href="/type-effectiveness">상성 계산기</Link>
              </li>
            </ul>
          </nav>
          <div>
            <a
              href="https://github.com/jsg3121"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon />
              GitHub 프로필
            </a>
            <a href="mailto:xodm95@gmail.com">
              <GmailIcon />
              Gmail
            </a>
          </div>
        </div>
      </Aside>
    </Fragment>
  )
}

export default HeaderHamburgerNavigation

const Button = styled.button`
  width: 1.75rem;
  height: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > i,
  &::before,
  &::after {
    width: 100%;
    height: 0.25rem;
    border-radius: 999px;
    background-color: var(--color-white-1);
  }

  &::before,
  &::after {
    content: '';
    display: block;
  }
`
const Aside = styled.aside<StyleProps>`
  @keyframes slideIn {
    0% {
      right: -100%;
    }
    100% {
      right: 0;
    }
  }

  @keyframes slideOut {
    0% {
      right: 0;
      display: flex;
    }
    100% {
      right: -100%;
      display: none;
    }
  }

  ${({ isAnimating, isOpenHamburger }) => css`
    width: 100vw;
    height: calc(100vh - 4rem);
    position: absolute;
    top: 4rem;
    right: 0;
    ${isOpenHamburger || isAnimating ? 'display: block;' : 'display: none;'}

    & > div {
      width: 12rem;
      height: calc(100% - 4rem);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: fixed;
      background-color: var(--color-primary-1);
      top: 4rem;
      right: -12rem;
      animation: 0.3s ease 0s 1 forwards
        ${isOpenHamburger ? 'slideIn' : 'slideOut'};
      z-index: 1000;

      & > nav {
        width: 100%;
        margin-top: 1rem;
        padding: 0 1.25rem;

        & > ul {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;

          & > li {
            width: 100%;

            & > a {
              width: 100%;
              height: 1.5rem;
              font-size: 1rem;
              line-height: calc(1.5rem + 2px);
              color: var(--color-primary-4);
            }
          }
        }
      }

      & > div {
        width: 100%;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        & > a {
          width: 2rem;
          height: 2rem;
          font-size: 0;
        }
      }
    }

    &[data-is-open='open'] {
      display: block;

      &::before {
        content: '';
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.45);
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 900;
      }
    }
  `}
`
