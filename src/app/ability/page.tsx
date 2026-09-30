import { Fragment } from 'react'

import { ABILITY_WEBPAGE_JSON_LD } from '~/constants/abilityJsonLd'
import { GetAbilityListPaginatedDocument } from '~/graphql/gqlGenerated'
import {
  AbilityEdge,
  GetAbilityListPaginatedQuery,
  GetAbilityListPaginatedQueryVariables,
} from '~/graphql/typeGenerated'
import {
  extractApolloState,
  initializeApollo,
} from '~/modules/apolloClient.module'
import AbilityList from '~/views/ability/AbilityList.view'
import Providers from '~/app/providers'

import { ABILITY_LIST_META } from './_metadata/abilityListMetadata'

type PageProps = {
  searchParams: Promise<{
    search: string
  }>
}

export const metadata = ABILITY_LIST_META

const AbilityPage = async ({ searchParams }: PageProps) => {
  const { search } = await searchParams

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
  const totalCount = data.getAbilityListPaginated.totalCount

  const initialApolloState = extractApolloState(apolloClient)

  return (
    <Fragment>
      <Providers initialApolloState={initialApolloState}>
        <AbilityList initialAbilities={abilityList} totalCount={totalCount} />
      </Providers>
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
