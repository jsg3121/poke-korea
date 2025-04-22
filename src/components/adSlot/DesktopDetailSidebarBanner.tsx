import styled from 'styled-components'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopDetailSidebarBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <Div ref={slotRef}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="9075172521"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </Div>
  )
}

export default DesktopDetailSidebarBanner

const Div = styled.div`
  width: 160px;
  max-height: 600px;
  position: absolute;
  right: -200px;
  background-color: red;

  @media screen and (min-width: 1281px) and (max-width: 1649px) {
    max-height: 600px;
    position: unset;
    right: 0;
  }

  @media screen and (max-width: 1280px) {
    width: 0;
    height: 0;
    display: none;
  }

  & > ins {
    width: 100%;
    max-height: 600px;
    display: block;
  }
`
