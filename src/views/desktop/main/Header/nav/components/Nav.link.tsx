import { useRouter } from 'next/router'
import styled from 'styled-components'

const Nav = styled.nav`
  height: 100%;
  padding: 0 1.66666667rem;
  border-radius: 1.66666667rem;
  background-color: var(--color-primary-4);

  > ul {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;

    > li {
      height: 2.11111111rem;
      display: flex;
      align-items: center;

      &[data-isActive='true'] {
        > p {
          font-weight: bold;
          color: var(--color-primary-1);
          text-decoration: underline;
        }
      }

      > p {
        height: 1.5rem;
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: normal;
        color: var(--color-primary-1);
        padding: 0 1.11111111rem;
      }
    }
  }
`

const NavLink = () => {
  const { pathname } = useRouter()

  return (
    <Nav>
      <ul>
        <li data-isActive={pathname === '/'}>
          <p>리스트 화면</p>
        </li>
        <li>
          <p>상성 계산기</p>
        </li>
        <li>
          <p>공지사항</p>
        </li>
      </ul>
    </Nav>
  )
}

export default NavLink
