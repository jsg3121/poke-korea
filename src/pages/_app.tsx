import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import type { AppProps } from 'next/app'
import { GqlMode } from '~/common'
import { GlobalStyle } from '~/styles/Global'
import '~/styles/common.css'

const GQLMode = GqlMode

const client = new ApolloClient({
  uri: GQLMode,
  cache: new InMemoryCache(),
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  )
}
