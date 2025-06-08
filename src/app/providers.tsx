'use client'

import { ApolloProvider } from '@apollo/client'
import { ReactNode } from 'react'
import { DeviceProvider } from '~/context/Device.context'
import { useApollo } from '~/module/apolloClient'

interface ProvidersProps {
  children: ReactNode
  userAgent: string
  initialApolloState?: any
}

export default function Providers({ 
  children, 
  userAgent, 
  initialApolloState 
}: ProvidersProps) {
  const { client: apolloClient } = useApollo(initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <DeviceProvider userAgent={userAgent}>
        {children}
      </DeviceProvider>
    </ApolloProvider>
  )
}