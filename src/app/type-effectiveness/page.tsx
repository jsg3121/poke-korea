import { Metadata } from 'next'
import { Fragment } from 'react'
import { headers } from 'next/headers'
import { detectUserAgent } from '~/module/device.module'
import TypeEffectivenessDesktop from '~/views/desktop/TypeEffectiveness.desktop'
import TypeEffectivenessMobile from '~/views/mobile/TypeEffectiveness.mobile'
import { TYPE_EFFECTIVNESS_SEO_META } from '~/constants/seoMetaData'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata: Metadata = {
  title: TYPE_EFFECTIVNESS_SEO_META.title,
  description: TYPE_EFFECTIVNESS_SEO_META.description,
  openGraph: {
    title: TYPE_EFFECTIVNESS_SEO_META.title,
    description: TYPE_EFFECTIVNESS_SEO_META.description,
    url: TYPE_EFFECTIVNESS_SEO_META.caninicalUrl,
    type: 'website',
    siteName: '포케 코리아',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: 'poke-korea',
        type: 'image/png',
      },
      {
        url: 'https://poke-korea.com/assets/image/kakaoOg.png',
        width: 800,
        height: 800,
        alt: 'poke-korea',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: TYPE_EFFECTIVNESS_SEO_META.caninicalUrl,
  },
}

const TypeEffectivenessPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {isMobile ? <TypeEffectivenessMobile /> : <TypeEffectivenessDesktop />}
    </Fragment>
  )
}

export default TypeEffectivenessPage
