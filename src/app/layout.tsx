import { ReactNode } from 'react'
import { headers } from 'next/headers'
import Script from 'next/script'
import Providers from './providers'
import '~/styles/common.css'
import '~/styles/globals.css'
import { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#27374D',
  userScalable: false,
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''

  return (
    <html lang="ko">
      <head>
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-28P8TKSR5M"
            />
            <script
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
            <script type="text/javascript" src="//wcs.naver.net/wcslog.js" />
            <script
              type="text/javascript"
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
            <meta
              name="naver-site-verification"
              content="28fbf8b85e4e80ff37d5a2338991716ae74de83f"
            />
            <meta
              name="google-adsense-account"
              content="ca-pub-6481622724376761"
            />
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6481622724376761"
              crossOrigin="anonymous"
            />
          </>
        )}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="adsbygoogle-init"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6481622724376761"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body>
        <Providers userAgent={userAgent}>{children}</Providers>
      </body>
    </html>
  )
}
