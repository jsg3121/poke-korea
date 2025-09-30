'use client'

import { ApolloProvider } from '@apollo/client'
import { ReactNode } from 'react'
import { useApollo } from '~/module/apolloClient'

interface ProvidersProps {
  children: ReactNode
  initialApolloState?: any
}

export default function Providers({
  children,
  initialApolloState,
}: ProvidersProps) {
  const { client: apolloClient } = useApollo(initialApolloState)

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
