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

// 이 페이지는 동적 렌더다: headers() UA 감지(크롬 선택)와 searchParams 검색이
// 매 요청 평가된다. 기존 revalidate=1년 선언은 headers() 때문에 실효가 없던
// 거짓 신호라 제거(UX-007, list와 동일). ISR 재도입은 크롬 통합(UA 제거) 이후 검토.

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

  // SSR로 실행한 GetAbilityListPaginated 결과를 클라이언트 캐시로 하이드레이트해
  // useAbilityList의 useQuery가 초기 재요청 없이 캐시를 읽도록 한다.
  const initialApolloState = extractApolloState(apolloClient)

  return (
    <Fragment>
      {/* 콘텐츠는 반응형 단일(AbilityList, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(list·홈 개편과 동일 패턴). */}
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
