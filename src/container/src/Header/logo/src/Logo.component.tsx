import React, { useContext } from 'react'
import isEqual from 'fast-deep-equal'
import LogoIcon from '~/assets/logo.svg'
import styled from 'styled-components'
import { ListContext } from '~/context'

const Logo = styled.div`
  width: 100%;
  max-width: 1280px;
  height: 8.44444444rem;
  position: relative;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: top left;
  /* transition: height 0.3s, top 0.3s; */
  transition: all 0.3s;
  will-change: height, top;

  &[data-scrolling='true'] {
    height: 3.33333333rem;
    top: -3.33333333rem;
    z-index: 10;

    & > .logo {
      width: 15rem;
      left: 0;
      transform: translateX(0);
      margin: 0;
    }
  }

  & > .logo {
    width: 100%;
    max-width: 41.66666667rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    /* transition: width 0.3s , left 0.3s, transform 0.3s; */
    transition: all 0.3s;
    will-change: transform, width;
  }
`

const LogoComponent: React.FC = () => {
  const { scrolling } = useContext(ListContext)

  return (
    <Logo data-scrolling={scrolling}>
      {/* <h1 className="header-title">포켓몬의 모든 정보 Poke Korea</h1> */}
      <div className="logo">
        <LogoIcon />
      </div>
    </Logo>
  )
}

export default React.memo(LogoComponent, isEqual)
