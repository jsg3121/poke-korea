import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const ListTopBanner = () => {
  const listBannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bannerElement =
      listBannerRef.current?.querySelector<HTMLDivElement>('.adsbygoogle')

    if (
      typeof window !== 'undefined' &&
      bannerElement &&
      bannerElement.getAttribute('data-adsbygoogle-status') !== 'done'
    ) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error('AdSense push error:', e)
      }
    }
  }, [])

  return (
    <Div ref={listBannerRef}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="9835534510"
      ></ins>
    </Div>
  )
}

export default ListTopBanner

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
