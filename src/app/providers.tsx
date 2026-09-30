'use client'

import { ReactNode } from 'react'
import { ApolloProvider, NormalizedCacheObject } from '@apollo/client'

import { useApollo } from '~/modules/apolloClient.module'

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
