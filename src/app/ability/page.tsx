import { headers } from 'next/headers'
import { Fragment } from 'react'
import { ABILITY_WEBPAGE_JSON_LD } from '~/constants/abilityJsonLd'
import { ABILITY_LIST_META } from './_metadata/abilityListMetadata'
import { GetAbilityListPaginatedDocument } from '~/graphql/gqlGenerated'
import {
  AbilityEdge,
  GetAbilityListPaginatedQuery,
  GetAbilityListPaginatedQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import AbilityListDesktop from '~/views/desktop/ability/AbilityList.desktop'
import AbilityListMobile from '~/views/mobile/ability/AbilityList.mobile'

export const revalidate = 31536000 // 1년

type PageProps = {
  searchParams: Promise<{
    search: string
  }>
}

export const metadata = ABILITY_LIST_META

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
