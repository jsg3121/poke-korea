import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopDetailCardBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return <Div ref={slotRef}></Div>
}

export default DesktopDetailCardBanner

const Div = styled.div`
  width: 160px;
  height: 100%;
  max-height: 600px;
  background-color: #666666;
  position: absolute;
  right: -200px;

  @media screen and (min-width: 1281px) and (max-width: 1649px) {
    position: relative;
    right: 0;
  }

  @media screen and (max-width: 1280px) {
    width: 0;
    height: 0;
    display: none;
  }
`
