import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopDetailCardBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <Div ref={slotRef}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="5945596249"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </Div>
  )
}

export default DesktopDetailCardBanner

const Div = styled.div`
  width: 100%;
  height: fit-content;
  max-width: 1280px;
  margin: -1.5rem 0;

  & > ins {
    width: 100%;
    height: 160px;
    display: block;
    text-align: center;
    margin: 1rem 0;
  }
`
