import { ReactNode } from 'react'
import { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'

import { getCssFiles, getFontFiles } from '~/utils/getCssFiles'
import { detectUserAgent } from '~/modules/device.module'
import { getRobotsConfig } from '~/modules/metadata.module'
import { DeviceProvider } from '~/context/Device.context'
import MobileTabBar from '~/components/MobileTabBar.component'
import DesktopFooter from '~/containers/desktop/footer/Footer.container'
import DesktopHeader from '~/containers/desktop/header/Header.container'
import MobileFooter from '~/containers/mobile/footer/Footer.container'
import MobileHeader from '~/containers/mobile/header/Header.container'

import Providers from './providers'

if (process.env.NODE_ENV === 'development') {
  require('~/styles/globals.css')
}

export const viewport: Viewport = {
  themeColor: '#27374D',
  width: 'device-width',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://poke-korea.com'),
  title: {
    default: '포케 코리아 - 포켓몬의 모든 정보',
    template: '%s - 포케 코리아',
  },
  description:
    '한국어 포켓몬 도감과 타입 상성 계산기, 기술·특성 도구를 무료로 제공하는 포켓몬 백과사전.',
  icons: {
    icon: '/favicon.ico',
  },
  robots: getRobotsConfig(),
}

interface RootLayoutProps {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const isProduction = process.env.NODE_ENV === 'production'
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const cssFiles = getCssFiles()
  const fontFiles = getFontFiles()

  return (
    <html lang="ko">
      <head>
        {fontFiles.map((font) => (
          <link
            key={`preload-font-${font.href}`}
            rel="preload"
            href={font.href}
            as="font"
            type={font.type}
            crossOrigin="anonymous"
          />
        ))}
        {cssFiles.map((cssFile) => (
          <link
            key={`preload-${cssFile}`}
            rel="preload"
            href={cssFile}
            as="style"
            fetchPriority="high"
          />
        ))}
        {cssFiles.map((cssFile) => (
          <link key={`style-${cssFile}`} rel="stylesheet" href={cssFile} />
        ))}
        {isProduction && (
          <>
            <meta
              name="naver-site-verification"
              content="28fbf8b85e4e80ff37d5a2338991716ae74de83f"
            />
            <meta
              name="google-adsense-account"
              content="ca-pub-6481622724376761"
            />
            <link
              rel="preconnect"
              href="https://image-cdn.poke-korea.com"
              crossOrigin=""
            />
            <link rel="dns-prefetch" href="https://image-cdn.poke-korea.com" />
            <link rel="dns-prefetch" href="https://image.poke-korea.com" />
            <link rel="dns-prefetch" href="https://api.poke-korea.com" />
          </>
        )}
      </head>
      <body>
        <Providers>
          <DeviceProvider isMobile={isMobile}>
            {isMobile ? <MobileHeader /> : <DesktopHeader />}
            <main className="w-full min-h-screen">{children}</main>
            {isMobile ? <MobileFooter /> : <DesktopFooter />}
            {isMobile && <MobileTabBar />}
          </DeviceProvider>
        </Providers>
        {isProduction && (
          <>
            <Script
              id="adsbygoogle-init"
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6481622724376761"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <Script
              id="gtag-base"
              src="https://www.googletagmanager.com/gtag/js?id=G-28P8TKSR5M"
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-28P8TKSR5M');
                `,
              }}
            />
            <Script id="naver-analytics" src="//wcs.naver.net/wcslog.js" />
            <Script
              id="naver-analytics-init"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  if(!wcs_add) var wcs_add = {};
                  wcs_add["wa"] = "7c0a94c9c2ab1c";
                  if(window.wcs) {
                    wcs_do();
                  }
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
