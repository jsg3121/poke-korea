import { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { ReactNode } from 'react'
import '~/styles/globals.css'
import Providers from './providers'

export const viewport: Viewport = {
  themeColor: '#27374D',
  width: 'device-width',
}

export const metadata: Metadata = {
  title: {
    default: '포켓몬의 모든 정보 포케 코리아',
    template: '%s',
  },
  description:
    '언제, 어디서든, 포켓몬의 정보를 빠르고 편리하게 확인하실 수 있습니다.',
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
}

interface RootLayoutProps {
  children: ReactNode
}

const gmarket = localFont({
  src: [
    {
      path: '../assets/font/GmarketSansMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/font/GmarketSansBold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-gmarket-sans',
})

export default async function RootLayout({ children }: RootLayoutProps) {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <html lang="ko" className={gmarket.className}>
      <head>
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
            {/* --- Preconnect / DNS Prefetch (초기 호출 도메인만) --- */}
            <link
              rel="preconnect"
              href="https://www.googletagmanager.com"
              crossOrigin=""
            />
            <link
              rel="preconnect"
              href="https://www.google-analytics.com"
              crossOrigin=""
            />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />

            {/* 네이버 애널리틱스 사용 시 */}
            <link
              rel="preconnect"
              href="https://wcs.naver.net"
              crossOrigin=""
            />
            <link rel="dns-prefetch" href="https://wcs.naver.net" />
            {/* (선택) origin-hint를 확실하게 하기 위한 referrer-policy */}
            <meta name="referrer" content="strict-origin-when-cross-origin" />
          </>
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
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
              rel="preconnect"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          </>
        )}
      </body>
    </html>
  )
}
