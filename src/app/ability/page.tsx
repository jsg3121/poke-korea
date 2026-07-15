import { headers } from 'next/headers'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import { ABILITY_WEBPAGE_JSON_LD } from '~/constants/abilityJsonLd'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { GetAbilityListPaginatedDocument } from '~/graphql/gqlGenerated'
import {
  AbilityEdge,
  GetAbilityListPaginatedQuery,
  GetAbilityListPaginatedQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import AbilityListView from '~/views/ability/AbilityList.view'
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
  const totalCount = data.getAbilityListPaginated.totalCount

  return (
    <Fragment>
      {/* 콘텐츠는 반응형 단일(AbilityListView, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(list·홈 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <AbilityListView
            initialAbilities={abilityList}
            totalCount={totalCount}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이. 검색바 sticky(desktop:top-30)와 맞춤
        <main className="w-full min-h-screen pt-30">
          <DesktopHeaderContainer />
          <AbilityListView
            initialAbilities={abilityList}
            totalCount={totalCount}
          />
          <DesktopFooterContainer />
        </main>
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
