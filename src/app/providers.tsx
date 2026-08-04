'use client'

import { ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import { ReactNode } from 'react'
import { useApollo } from '~/module/apolloClient'

interface ProvidersProps {
  children: ReactNode
  initialApolloState?: NormalizedCacheObject | null
}

export default function Providers({
  children,
  initialApolloState,
}: ProvidersProps) {
  const { client: apolloClient } = useApollo(initialApolloState)

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
