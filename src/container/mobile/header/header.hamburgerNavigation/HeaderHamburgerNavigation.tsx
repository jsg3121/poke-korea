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
      <Div data-is-open={isOpenHamburger ? 'open' : 'close'}>
        <nav>
          <ul>
            <li>메인 화면</li>
            <li>상성 게산기</li>
            <li>특성 검색기</li>
          </ul>
        </nav>
        <aside>
          <button>깃헙 프로필</button>
          <button>gmail</button>
        </aside>
      </Div>
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
const Div = styled.div`
  width: 45vw;
  height: calc(100vh - 4rem);
  position: absolute;
  background-color: var(--color-white-1);
  top: 4rem;
  right: -45vw;
  z-index: 1000;
  transition: right 0.25s;

  &[data-is-open='open'] {
    right: 0;
  }
`
