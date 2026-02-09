import { headers } from 'next/headers'
import { Fragment } from 'react'
import { TYPE_EFFECTIVENESS_META } from '~/constants/seoMetaData'
import {
  TYPE_EFFECTIVENESS_ITEMLIST_JSON_LD,
  TYPE_EFFECTIVENESS_WEBPAGE_JSON_LD,
} from '~/constants/typeEffectivenessJsonLd'
import { detectUserAgent } from '~/module/device.module'
import TypeEffectivenessDesktop from '~/views/desktop/typeEffectiveness/TypeEffectiveness.desktop'
import TypeEffectivenessMobile from '~/views/mobile/typeEffectiveness/TypeEffectiveness.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata = TYPE_EFFECTIVENESS_META

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
