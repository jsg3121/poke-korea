import { Metadata } from 'next'
import { Fragment } from 'react'
import { headers } from 'next/headers'
import { detectUserAgent } from '~/module/device.module'
import TypeEffectivenessDesktop from '~/views/desktop/TypeEffectiveness.desktop'
import TypeEffectivenessMobile from '~/views/mobile/TypeEffectiveness.mobile'

export const metadata: Metadata = {
  title: '포켓몬 타입 상성 - 포케 코리아',
  description: '포켓몬의 타입별 상성을 확인하고 효과적인 전략을 세워보세요. 각 타입의 강점과 약점을 한눈에 파악할 수 있습니다.',
  openGraph: {
    title: '포켓몬 타입 상성 - 포케 코리아',
    description: '포켓몬의 타입별 상성을 확인하고 효과적인 전략을 세워보세요.',
    url: 'https://poke-korea.com/type-effectiveness',
    siteName: '포케 코리아',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: 'poke-korea',
      },
      {
        url: 'https://poke-korea.com/assets/image/kakaoOg.png',
        width: 800,
        height: 800,
        alt: 'poke-korea',
      },
    ],
  },
  canonical: 'https://poke-korea.com/type-effectiveness',
}

const TypeEffectivenessPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {isMobile ? <TypeEffectivenessMobile /> : <TypeEffectivenessDesktop />}
    </Fragment>
  )
}

export default TypeEffectivenessPage