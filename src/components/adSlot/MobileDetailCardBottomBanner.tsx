import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileDetailCardBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <Div ref={slotRef}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="5619127337"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </Div>
  )
}

export default MobileDetailCardBottomBanner

const Div = styled.div`
  width: calc(100% - 3rem);
  height: fit-content;
  text-align: center;
  margin: 0 auto;

  & > ins {
    width: 100%;
    display: block;
    margin: 0 auto;
    text-align: center;
    margin: 0 auto 0;
  }
`
