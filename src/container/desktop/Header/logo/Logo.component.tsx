import React from 'react'
import isEqual from 'fast-deep-equal'
import LogoIcon from '~/assets/logo.svg'
import styled from 'styled-components'
import { ListContext } from '~/context'

const Article = styled.article`
  width: 100%;
  max-width: 1280px;
  height: 8.44444444rem;
  position: relative;
  transition: height 0.3s;
  will-change: height;
  margin: 0 auto;

  &[data-scrolling='true'],
  &[data-searching='has-query'] {
    height: 0;

    & > .logo {
      top: -5.5rem;
      left: 0;
      transform-origin: left;
      transform: translate3d(0, 0, 0) scale(0.4);
    }
  }

  & > .header-title {
    font-size: 2.5rem;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    color: var(--color-primary-2);
    pointer-events: none;
    user-select: none;
  }

  & > .logo {
    width: 100%;
    max-width: 41.66666667rem;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate3d(-50%, 0, 0) scale(1);
    transform-origin: left;
    transition:
      top 0.3s,
      left 0.3s,
      transform 0.3s;
    will-change:
      top left,
      transform;
  }
`

const LogoComponent: React.FC = () => {
  const { scrolling, searching } = React.useContext(ListContext)

  return (
    <Article
      data-scrolling={scrolling}
      data-searching={searching ? 'has-query' : ''}
    >
      <h1 className="header-title">포켓몬의 모든 정보 Poke Korea</h1>
      <div className="logo">
        <LogoIcon />
      </div>
    </Article>
  )
}

export default React.memo(LogoComponent, isEqual)
