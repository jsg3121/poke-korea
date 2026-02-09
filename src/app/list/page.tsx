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
import ListDesktop from '~/views/desktop/list/List.desktop'
import ListMobile from '~/views/mobile/list/List.mobile'
import { generateListMetadata } from './_metadata/generateListMetadata'

export const revalidate = 31536000 // 1년

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
      <main className="w-full min-h-screen">
        {isMobile ? (
          <ListMobile
            pokemonList={pokemonList}
            initialFilter={filterInput}
            hasNextPage={hasNextPage}
          />
        ) : (
          <ListDesktop
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
