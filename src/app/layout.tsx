import { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { ReactNode } from 'react'
import { getRobotsConfig } from '~/module/metadata.module'
import { WEBSITE_JSON_LD } from '~/constants/websiteJsonLd'
import Providers from './providers'
import { headers } from 'next/headers'
import { detectUserAgent } from '~/module/device.module'
import { DeviceProvider } from '~/context/Device.context'
import { getCssFiles, getFontFiles } from '~/utils/getCssFiles'

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
    default: '포켓몬의 모든 정보 포케 코리아',
    template: '%s',
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
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  // 빌드된 CSS 파일 가져오기
  const cssFiles = getCssFiles()
  // 폰트 파일 가져오기
  const fontFiles = getFontFiles()

  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history)history.scrollRestoration='manual'`,
          }}
        />
        {/* Font preload - 최우선 */}
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
        {/* CSS preload - 최우선 */}
        {cssFiles.map((cssFile) => (
          <link
            key={`preload-${cssFile}`}
            rel="preload"
            href={cssFile}
            as="style"
            fetchPriority="high"
          />
        ))}
        {/* CSS stylesheet - 실제 적용 */}
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
            {/* 이미지 CDN - 최우선 (실제 사용됨) */}
            <link
              rel="preconnect"
              href="https://image-cdn.poke-korea.com"
              crossOrigin=""
            />
            <link rel="dns-prefetch" href="https://image-cdn.poke-korea.com" />
            {/* og 이미지 CDN - SSR에서만 사용 */}
            <link rel="dns-prefetch" href="https://image.poke-korea.com" />
            {/* GraphQL API - SSR에서 사용 */}
            <link rel="dns-prefetch" href="https://api.poke-korea.com" />
          </>
        )}
      </head>
      <body>
        <Providers>
          <DeviceProvider isMobile={isMobile}>{children}</DeviceProvider>
        </Providers>
        <script
          id="website-jsonLd"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE_JSON_LD),
          }}
        />
        {isProduction && (
          <>
            {/* Google Analytics */}
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
            {/* Naver Analytics */}
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
            {/* Google AdSense */}
            <Script
              id="adsbygoogle-init"
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6481622724376761"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          </>
        )}
      </body>
    </html>
  )
}
