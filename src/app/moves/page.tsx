import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import {
  MOVES_TYPE_ITEMLIST_JSON_LD,
  MOVES_WEBPAGE_JSON_LD,
} from '~/constants/movesJsonLd'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import Providers from '~/app/providers'
import { MovesProvider } from '~/context/Moves.context'
import { GetPokemonSkillListDocument } from '~/graphql/gqlGenerated'
import {
  PokemonSkillEdge,
  PokemonSkillFilterInput,
  PokemonType,
} from '~/graphql/typeGenerated'
import { extractApolloState, initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { getDamageTypeEnglish } from '~/utils/skill.util'
import MovesListView from '~/views/moves/MovesList.view'
import { generateMovesListMetadata } from './_metadata/generateMovesListMetadata'

// 이 페이지는 동적 렌더다: headers() UA 감지(크롬 선택)와 searchParams 필터가
// 매 요청 평가된다. 기존 revalidate=1년 선언은 headers() 때문에 실효가 없던
// 거짓 신호라 제거(UX-008, ability·list와 동일). ISR 재도입은 크롬 통합 이후 검토.

interface MovesPageProps {
  searchParams: Promise<{
    typeFilter: PokemonType
    damageTypeFilter: string
    search: string
    firstGenerationId: string
  }>
}

export const generateMetadata = async ({
  searchParams,
}: MovesPageProps): Promise<Metadata> => {
  const { damageTypeFilter, typeFilter, firstGenerationId } = await searchParams
  const parsedGenId = parseInt(firstGenerationId, 10)

  return generateMovesListMetadata({
    typeFilter,
    damageTypeFilter,
    firstGenerationId: parsedGenId || undefined,
  })
}

export default async function MovesPage({ searchParams }: MovesPageProps) {
  const client = initializeApollo()
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)
  const { damageTypeFilter, typeFilter, search, firstGenerationId } =
    await searchParams

  const parsedGenerationId = parseInt(firstGenerationId, 10)
  const movesFilter: PokemonSkillFilterInput = {
    damageType: getDamageTypeEnglish(damageTypeFilter),
    type: typeFilter,
    name: search,
    ...(parsedGenerationId && {
      generationId: parsedGenerationId,
    }),
  }

  const { data } = await client.query({
    query: GetPokemonSkillListDocument,
    variables: {
      input: {
        filter: movesFilter,
        pagination: {
          first: 20,
        },
      },
    },
  })

  const skillList =
    data?.getPokemonSkillList?.edges?.map(
      (edge: PokemonSkillEdge) => edge.node,
    ) || []
  const totalCount = data?.getPokemonSkillList?.totalCount || 0

  // SSR로 실행한 GetPokemonSkillList 결과를 클라이언트 캐시로 하이드레이트해
  // MovesProvider의 useQuery가 초기 재요청 없이 캐시를 읽도록 한다.
  const initialApolloState = extractApolloState(client)

  return (
    <Fragment>
      <Providers initialApolloState={initialApolloState}>
        <MovesProvider
          initialSkills={skillList}
          totalCount={totalCount}
          movesFilter={movesFilter}
        >
          {/* 콘텐츠는 반응형 단일(MovesListView, ADR-0007). UA 분기는 전역 크롬
            (헤더/푸터/탭바) 선택으로만 남는다(list·ability 개편과 동일 패턴). */}
          {isMobile ? (
            <main className="w-full min-h-screen">
              <MobileHeaderContainer />
              <MovesListView />
              <MobileFooterContainer />
              <MobileTabBar />
            </main>
          ) : (
            // pt-30(120px) = 데스크톱 fixed 헤더 실높이. sticky(desktop:top-30)와 맞춤
            <main className="w-full min-h-screen pt-30">
              <DesktopHeaderContainer />
              <MovesListView />
              <DesktopFooterContainer />
            </main>
          )}
        </MovesProvider>
      </Providers>
      <script
        id="moves-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(MOVES_WEBPAGE_JSON_LD),
        }}
      />
      <script
        id="moves-type-itemlist-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(MOVES_TYPE_ITEMLIST_JSON_LD),
        }}
      />
    </Fragment>
  )
}
