import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetPokemonListPaginatedDocument } from '~/graphql/gqlGenerated'
import {
  GetPokemonListPaginatedQuery,
  GetPokemonListPaginatedQueryVariables,
  PokemonEdge,
  PokemonFilterInput,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import {
  changeTypeArrayToString,
  getGenerationParams,
  toBooleanOrUndefined,
} from '~/module/filter.module'
import { getDailyRandomPokemon } from '~/module/list.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import MainDesktop from '~/views/desktop/main/Main.desktop'
import MainMobile from '~/views/mobile/main/Main.mobile'

export const revalidate = 31536000 // 1년

// 동적 메타데이터 생성 함수
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { type, isMega, isRegion, isEvolution, generation } = await searchParams

  // 필터에 따른 타이틀 및 설명 생성 (const 기반 불변 로직)
  const buildMetadata = () => {
    // 타입 배열 처리 (쉼표로 구분된 문자열 -> 배열)
    const typeArray = type ? changeTypeArrayToString(type) : []
    const typeNames = typeArray.map((t) => PokemonTypes[t]).filter(Boolean)

    // 각 필터 데이터 구성
    const typeData =
      typeNames.length > 0
        ? {
            titlePrefix:
              typeNames.length === 1
                ? `${typeNames[0]} 타입 포켓몬 도감`
                : `${typeNames.join('·')} 타입 포켓몬 도감`,
            descPrefix:
              typeNames.length === 1
                ? `${typeNames[0]} 타입 포켓몬`
                : `${typeNames.join('·')} 타입 포켓몬`,
            filter:
              typeNames.length === 1
                ? `${typeNames[0]} 타입`
                : `${typeNames.join('·')} 타입`,
          }
        : null

    const generationData = generation
      ? {
          titleSuffix: `${generation}세대`,
          descPrefix:
            typeNames.length > 0
              ? `${generation}세대 ${typeNames.join('·')} 타입 포켓몬`
              : `${generation}세대 포켓몬`,
          filter: `${generation}세대`,
        }
      : null

    const megaData =
      isMega === 'true'
        ? {
            titleSuffix: '메가진화',
            descPrefix: '메가진화 포켓몬',
            filter: '메가진화',
          }
        : null

    const regionData =
      isRegion === 'true'
        ? {
            titleSuffix: '리전폼',
            descPrefix: '리전폼 포켓몬',
            filter: '리전폼',
          }
        : null

    const evolutionData =
      isEvolution === 'true'
        ? { suffix: '(진화 가능)', filter: '진화 가능' }
        : isEvolution === 'false'
          ? { suffix: '(진화 불가)', filter: '진화 불가' }
          : null

    // 타이틀 기본값 결정
    const baseTitlePrefix =
      typeData?.titlePrefix ||
      (generationData ? `${generationData.titleSuffix} 포켓몬 도감` : null) ||
      (megaData ? `${megaData.titleSuffix} 포켓몬 도감` : null) ||
      (regionData ? `${regionData.titleSuffix} 포켓몬 도감` : null) ||
      '포켓몬 도감'

    // 타이틀 접미사 조합
    const titleSuffixes = [
      generationData && typeData ? generationData.titleSuffix : null,
      megaData && (typeData || generationData) ? megaData.titleSuffix : null,
      regionData && (typeData || generationData || megaData)
        ? regionData.titleSuffix
        : null,
    ].filter(Boolean) as string[]

    const finalTitle =
      titleSuffixes.length > 0
        ? `${baseTitlePrefix} - ${titleSuffixes.join(' ')}`
        : baseTitlePrefix

    // 설명 조합
    const baseDescPrefix =
      regionData?.descPrefix ||
      megaData?.descPrefix ||
      generationData?.descPrefix ||
      typeData?.descPrefix ||
      '모든 세대의 포켓몬'

    const finalDescPrefix = evolutionData
      ? `${baseDescPrefix} ${evolutionData.suffix}`
      : baseDescPrefix

    // 필터 목록 구성
    const filters = [
      typeData?.filter,
      generationData?.filter,
      megaData?.filter,
      regionData?.filter,
      evolutionData?.filter,
    ].filter(Boolean) as string[]

    return {
      titlePrefix: finalTitle,
      descriptionPrefix: finalDescPrefix,
      filters,
    }
  }

  const { titlePrefix, descriptionPrefix, filters } = buildMetadata()

  const title = `${titlePrefix} | 포케 코리아`
  const description =
    filters.length > 0
      ? `${descriptionPrefix}을 한눈에 확인하세요. ${filters.join(', ')} 포켓몬을 빠르게 찾아보세요.`
      : `모든 세대의 포켓몬을 한눈에! 타입, 진화 여부, 세대별로 필터링하여 원하는 포켓몬을 빠르게 찾아보세요.`

  // Canonical URL 생성
  const queryString = new URLSearchParams(
    Object.entries({ type, isMega, isRegion, isEvolution, generation }).filter(
      ([_, v]) => v !== undefined,
    ) as [string, string][],
  ).toString()
  const canonicalUrl = queryString
    ? `https://poke-korea.com/list?${queryString}`
    : 'https://poke-korea.com/list'

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
}

type searchParamsKey =
  | 'name'
  | 'type'
  | 'isMega'
  | 'isRegion'
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

  const { type, isMega, isRegion, isEvolution, generation, name } =
    await searchParams

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
        image: `https://image.poke-korea.com/image/pokemon/${number}.png`,
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
      <main className="w-full min-h-screen">
        {isMobile ? (
          <MainMobile
            pokemonList={pokemonList}
            initialFilter={filterInput}
            hasNextPage={hasNextPage}
          />
        ) : (
          <MainDesktop
            pokemonList={pokemonList}
            initialFilter={filterInput}
            hasNextPage={hasNextPage}
          />
        )}
      </main>
    </>
  )
}

export default ListPage
