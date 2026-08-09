import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetPokemonListPaginatedDocument } from '~/graphql/gqlGenerated'
import {
  GetPokemonListPaginatedQuery,
  GetPokemonListPaginatedQueryVariables,
  PokemonEdge,
  PokemonFilterInput,
} from '~/graphql/typeGenerated'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { extractApolloState, initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import {
  changeTypeArrayToString,
  getGenerationParams,
  toBooleanOrUndefined,
} from '~/module/filter.module'
import { getDailyRandomPokemon } from '~/module/list.module'
import Providers from '~/app/providers'
import ListView from '~/views/list/List.view'
import { generateListMetadata } from './_metadata/generateListMetadata'

// 이 페이지는 동적 렌더다: headers() UA 감지(크롬 선택)와 searchParams 필터가
// 매 요청 평가된다. 기존의 revalidate=1년 선언은 headers() 때문에 실효가 없던
// 거짓 신호라 제거(UX-004 M1). ISR 재도입은 크롬 통합(UA 제거) 이후 검토.

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { type, isMega, isRegion, isGigantamax, isEvolution, generation } =
    await searchParams

  return generateListMetadata({
    type,
    isMega,
    isRegion,
    isGigantamax,
    isEvolution,
    generation,
  })
}

type searchParamsKey =
  | 'name'
  | 'type'
  | 'isMega'
  | 'isRegion'
  | 'isGigantamax'
  | 'isEvolution'
  | 'generation'

type PageProps = {
  searchParams: Promise<{
    [key in searchParamsKey]: string
  }>
}

const ListPage = async ({ searchParams }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const {
    type,
    isMega,
    isRegion,
    isGigantamax,
    isEvolution,
    generation,
    name,
  } = await searchParams

  const filterInput: PokemonFilterInput = {
    ...(name && {
      name,
    }),
    ...(generation && {
      generation: getGenerationParams(generation),
    }),
    ...(type && { types: changeTypeArrayToString(type as string) }),
    isMegaEvolution: toBooleanOrUndefined(isMega as string),
    isRegionForm: toBooleanOrUndefined(isRegion as string),
    isGigantamax: toBooleanOrUndefined(isGigantamax as string),
    isEvolution: toBooleanOrUndefined(isEvolution as string),
  }

  const { data } = await apolloClient.query<
    GetPokemonListPaginatedQuery,
    GetPokemonListPaginatedQueryVariables
  >({
    query: GetPokemonListPaginatedDocument,
    variables: {
      input: {
        filter: filterInput,
        pagination: {
          first: 20,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const pokemonList =
    data?.getPokemonList?.edges.map((edge: PokemonEdge) => {
      return edge.node
    }) || []
  const hasNextPage = !!data?.getPokemonList.pageInfo.hasNextPage

  // SSR로 실행한 GetPokemonListPaginated 결과를 클라이언트 캐시로 하이드레이트해
  // ListProvider의 useQuery가 초기 재요청 없이 캐시를 읽도록 한다.
  const initialApolloState = extractApolloState(apolloClient)

  // Breadcrumb JSON-LD for SEO
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://poke-korea.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '포켓몬 도감',
        item: 'https://poke-korea.com/list',
      },
    ],
  }

  const dailyPokemonNumbers = getDailyRandomPokemon()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '포켓몬 도감',
    description: '모든 세대의 포켓몬을 한눈에 확인할 수 있는 포켓몬 도감',
    numberOfItems: 10,
    itemListElement: dailyPokemonNumbers.map((number, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: `포켓몬 #${number}`,
        url: `https://poke-korea.com/detail/${number}`,
        image: `https://image.poke-korea.com/origin/${number}.png`,
        description: `포켓몬 도감 번호 ${number}`,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* 콘텐츠는 반응형 단일(ListView, ADR-0007). UA 분기는 전역 크롬(헤더/푸터/
          탭바)과 디바이스별 AdSense 유닛 선택으로만 남는다(홈 개편과 동일 패턴). */}
      <Providers initialApolloState={initialApolloState}>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeaderContainer />
            <ListView
              pokemonList={pokemonList}
              initialFilter={filterInput}
              hasNextPage={hasNextPage}
            />
            <MobileFooterContainer />
            <MobileTabBar />
          </main>
        ) : (
          // pt-30(120px) = 데스크톱 fixed 헤더 실높이(pt-3 12 + 로고행 48 +
          // nav mt-3 12 + nav 48). pt-28(112px)은 8px 겹쳐 필터바 상단이 잘렸다
          <main className="w-full min-h-screen pt-30">
            <DesktopHeaderContainer />
            <ListView
              pokemonList={pokemonList}
              initialFilter={filterInput}
              hasNextPage={hasNextPage}
            />
            <DesktopFooterContainer />
          </main>
        )}
      </Providers>
    </>
  )
}

export default ListPage
