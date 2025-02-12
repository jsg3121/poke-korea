import isEqual from 'fast-deep-equal'
import { memo } from 'react'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'

const Article = styled.article`
  width: 25rem;
  margin: 0 auto;

  & > .header-title {
    font-size: 2.5rem;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    color: var(--color-primary-1);
    z-index: -1;
    pointer-events: none;
    user-select: none;
  }
`

const LogoComponent = () => {
  return (
    <Article>
      <h1 className="header-title">포켓몬의 모든 정보 Poke Korea</h1>
      <LogoIcon />
    </Article>
  )
}

export default memo(LogoComponent, isEqual)
