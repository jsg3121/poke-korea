import { ApolloProvider } from '@apollo/client'
import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import App from 'next/app'
import { DeviceProvider } from '~/context/src/Device.context'
import { useApollo } from '~/module/apolloClient'
import { GlobalStyle } from '~/styles/Global'
import '~/styles/common.css'

type AppType = AppProps & {
  userAgent: string
}

const MyApp = ({ Component, pageProps, userAgent }: AppType) => {
  const { client: apolloClient } = useApollo(pageProps.initialApolloState)

  return (
    <>
      <GlobalStyle />
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
