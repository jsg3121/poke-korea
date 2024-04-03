import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'
import { useApollo } from '~/module/apolloClient'
import { GlobalStyle } from '~/styles/Global'
import '~/styles/common.css'

export default function App({ Component, pageProps }: AppProps) {
  const { client: apolloClient } = useApollo(pageProps.initialApolloState)

  return (
    <>
      <GlobalStyle />
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  )
}
