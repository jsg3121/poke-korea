import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import { TYPE_EFFECTIVNESS_SEO_META } from '~/constants/seoMetaData'
import {
  TYPE_EFFECTIVENESS_ITEMLIST_JSON_LD,
  TYPE_EFFECTIVENESS_WEBPAGE_JSON_LD,
} from '~/constants/typeEffectivenessJsonLd'
import { detectUserAgent } from '~/module/device.module'
import TypeEffectivenessDesktop from '~/views/desktop/TypeEffectiveness.desktop'
import TypeEffectivenessMobile from '~/views/mobile/TypeEffectiveness.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata: Metadata = {
  title: TYPE_EFFECTIVNESS_SEO_META.title,
  description: TYPE_EFFECTIVNESS_SEO_META.description,
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  openGraph: {
    title: TYPE_EFFECTIVNESS_SEO_META.title,
    description: TYPE_EFFECTIVNESS_SEO_META.description,
    url: TYPE_EFFECTIVNESS_SEO_META.canonicalUrl,
    type: 'website',
    siteName: '포케 코리아',
    locale: 'ko_KR',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: TYPE_EFFECTIVNESS_SEO_META.title,
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: TYPE_EFFECTIVNESS_SEO_META.canonicalUrl,
  },
}

const TypeEffectivenessPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {isMobile ? <TypeEffectivenessMobile /> : <TypeEffectivenessDesktop />}
      <script
        id="type-effectiveness-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_WEBPAGE_JSON_LD),
        }}
      />
      <script
        id="type-effectiveness-itemlist-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_ITEMLIST_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default TypeEffectivenessPage
