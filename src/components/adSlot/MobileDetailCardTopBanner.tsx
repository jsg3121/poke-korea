import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileDetailCardTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <Div ref={slotRef}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="5619127337"
      ></ins>
    </Div>
  )
}

export default MobileDetailCardTopBanner

const Div = styled.div`
  width: calc(100% - 3rem);
  height: fit-content;
  text-align: center;
  margin: 0 auto;

  & > ins {
    width: 100%;
    height: 90px;
    display: block;
    margin: 0 auto;
    text-align: center;
    margin: 2rem auto 0;
  }
`
