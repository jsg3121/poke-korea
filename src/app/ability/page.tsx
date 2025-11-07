import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import { ABILITY_WEBPAGE_JSON_LD } from '~/constants/abilityJsonLd'
import { GetAbilityListPaginatedDocument } from '~/graphql/gqlGenerated'
import {
  GetAbilityListPaginatedQuery,
  GetAbilityListPaginatedQueryVariables,
  AbilityEdge,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import AbilityListDesktop from '~/views/desktop/ability/AbilityList.desktop'
import AbilityListMobile from '~/views/mobile/ability/AbilityList.mobile'

export const revalidate = 31536000 // 1년

type PageProps = {
  searchParams: Promise<{
    search: string
  }>
}

export const metadata: Metadata = {
  title: '포켓몬 특성 도감 - 포케코리아',
  description:
    '포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고, 어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요.',
  robots: getRobotsConfig(),
  openGraph: {
    type: 'website',
    url: 'https://poke-korea.com/ability',
    title: '포켓몬 특성 도감 - 포케코리아',
    description:
      '포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고, 어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요.',
    locale: 'ko_KR',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '포켓몬 특성 도감 - 포케코리아',
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
    title: '포켓몬 특성 도감 - 포케코리아',
    description:
      '포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고, 어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요.',
    images: ['https://poke-korea.com/assets/image/ogImage.png'],
  },
}

const AbilityPage = async ({ searchParams }: PageProps) => {
  const headersList = await headers()
  const { search } = await searchParams
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
        filter: {
          name: search,
        },
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
    <Fragment>
      {isMobile ? (
        <AbilityListMobile
          initialAbilities={abilityList}
          totalCount={data.getAbilityListPaginated.totalCount}
        />
      ) : (
        <AbilityListDesktop
          initialAbilities={abilityList}
          totalCount={data.getAbilityListPaginated.totalCount}
        />
      )}
      <script
        id="ability-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ABILITY_WEBPAGE_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default AbilityPage
