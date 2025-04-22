import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <Div ref={slotRef}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1410249585"
      ></ins>
    </Div>
  )
}

export default MobileListTopBanner

const Div = styled.div`
  width: 100%;
  height: fit-content;
  margin: 2rem auto 0;

  & > ins {
    width: calc(100% - 3rem);
    height: 90px;
    display: block;
    margin: 0 auto;
    text-align: center;
  }
`
