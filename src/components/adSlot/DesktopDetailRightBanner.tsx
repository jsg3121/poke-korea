import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopDetailRightBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return <Div ref={slotRef}></Div>
}

export default DesktopDetailRightBanner

const Div = styled.div`
  width: 100%;
  height: 160px;
  background-color: #666666;
  margin: -1rem 0;
`
