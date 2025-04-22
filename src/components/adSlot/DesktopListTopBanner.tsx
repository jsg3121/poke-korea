import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <Div ref={slotRef}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="9835534510"
      ></ins>
    </Div>
  )
}

export default DesktopListTopBanner

const Div = styled.div`
  width: 100%;
  max-width: 1280px;
  height: fit-content;
  margin: 2rem auto 0;

  & > ins {
    width: 100%;
    height: 140px;
    display: block;
    margin: 0 auto;
    text-align: center;
  }
`
