import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopDetailRightBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return <Div ref={slotRef}></Div>
}

export default DesktopDetailRightBanner

const Div = styled.div``
