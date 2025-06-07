import { ApolloProvider } from '@apollo/client'
import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { DeviceProvider } from '~/context/Device.context'
import { useApollo } from '~/module/apolloClient'
import '~/styles/common.css'
import '~/styles/globals.css'

type AppType = AppProps & {
  userAgent: string
}

const MyApp = ({ Component, pageProps, userAgent }: AppType) => {
  const { client: apolloClient } = useApollo(pageProps.initialApolloState)

  return (
    <>
      {process.env.NODE_ENV === 'production' && (
        <Script
          id="adsbygoogle-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6481622724376761"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      )}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <DeviceProvider userAgent={userAgent}>
          <Component {...pageProps} />
        </DeviceProvider>
      </ApolloProvider>
    </>
  )
}

MyApp.getInitialProps = async (
  appContext: AppContext,
): Promise<AppInitialProps & { userAgent: string }> => {
  const appProps = await App.getInitialProps(appContext)
  const userAgent = appContext.ctx.req
    ? appContext.ctx.req.headers['user-agent'] || ''
    : navigator.userAgent

  return {
    ...appProps,
    userAgent,
  }
}

export default MyApp
