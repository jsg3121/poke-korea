'use client'

import { ApolloProvider } from '@apollo/client'
import { ReactNode } from 'react'
import { DeviceProvider } from '~/context/Device.context'
import { useRouteChangeCache } from '~/hook/useRouteChangeCache'
import { useApollo } from '~/module/apolloClient'

interface ProvidersProps {
  children: ReactNode
  userAgent: string
  initialApolloState?: any
}

function CacheManager({ children }: { children: ReactNode }) {
  // 전역에서 페이지 이동 시 캐시 초기화
  useRouteChangeCache()
  return <>{children}</>
}

export default function Providers({
  children,
  userAgent,
  initialApolloState,
}: ProvidersProps) {
  const { client: apolloClient } = useApollo(initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <DeviceProvider userAgent={userAgent}>
        <CacheManager>{children}</CacheManager>
      </DeviceProvider>
    </ApolloProvider>
  )
}
