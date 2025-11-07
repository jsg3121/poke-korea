import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetAbilityListPaginatedDocument } from '~/graphql/gqlGenerated'
import {
  GetAbilityListPaginatedQuery,
  GetAbilityListPaginatedQueryVariables,
  AbilityEdge,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import AbilityListDesktop from '~/views/desktop/ability/AbilityList.desktop'
import AbilityListMobile from '~/views/mobile/ability/AbilityList.mobile'

export const revalidate = 31536000 // 1년

export const metadata: Metadata = {
  title: '특성 도감 - 포케 코리아',
  description:
    '포켓몬의 모든 특성 정보를 확인하세요. 각 특성의 효과와 해당 특성을 가진 포켓몬 목록을 한눈에 볼 수 있습니다.',
  openGraph: {
    type: 'website',
    url: 'https://poke-korea.com/ability',
    title: '특성 도감 - 포케 코리아',
    locale: 'ko_KR',
    description:
      '포켓몬의 모든 특성 정보를 확인하세요. 각 특성의 효과와 해당 특성을 가진 포켓몬 목록을 한눈에 볼 수 있습니다.',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '특성 도감 - 포케 코리아',
        type: 'image/png',
      },
    ],
    siteName: '포케 코리아',
  },
  alternates: {
    canonical: 'https://poke-korea.com/ability',
  },
  twitter: {
    card: 'summary_large_image',
    title: '특성 도감 - 포케 코리아',
    description:
      '포켓몬의 모든 특성 정보를 확인하세요. 각 특성의 효과와 해당 특성을 가진 포켓몬 목록을 한눈에 볼 수 있습니다.',
    images: ['https://poke-korea.com/assets/image/ogImage.png'],
  },
}

const AbilityPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetAbilityListPaginatedQuery,
    GetAbilityListPaginatedQueryVariables
  >({
    query: GetAbilityListPaginatedDocument,
    variables: {
      input: {
        pagination: {
          first: 20,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const abilityList =
    data?.getAbilityListPaginated?.edges.map((edge: AbilityEdge) => {
      return edge.node
    }) || []

  return (
    <main className="w-full min-h-screen">
      {isMobile ? (
        <AbilityListMobile initialAbilities={abilityList} />
      ) : (
        <AbilityListDesktop initialAbilities={abilityList} />
      )}
    </main>
  )
}

export default AbilityPage
