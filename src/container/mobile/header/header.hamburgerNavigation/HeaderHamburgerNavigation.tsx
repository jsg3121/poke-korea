import Link from 'next/link'
import { Fragment, useState } from 'react'
import styled from 'styled-components'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

const HeaderHamburgerNavigation = () => {
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  useBodyScrollLock(isOpenHamburger)

  const handleClickButton = () => {
    setIsOpenHamburger((prev) => !prev)
  }

  return (
    <Fragment>
      <Button aria-label="햄버거 네비게이션 버튼" onClick={handleClickButton}>
        <i></i>
      </Button>
      <Aside data-is-open={isOpenHamburger ? 'open' : 'close'}>
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
            <button>깃헙 프로필</button>
            <button>gmail</button>
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
const Aside = styled.aside`
  width: 100vw;
  height: calc(100vh - 4rem);
  position: absolute;
  top: 4rem;
  right: 0;

  & > div {
    width: 12rem;
    height: calc(100% - 4rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    background-color: var(--color-primary-1);
    top: 4rem;
    right: -45vw;
    z-index: 1000;
    transition: right 0.25s;

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
    }
  }

  &[data-is-open='open'] {
    & > div {
      right: 0;
    }

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
`
