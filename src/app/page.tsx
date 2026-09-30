import { Fragment } from 'react'
import { permanentRedirect } from 'next/navigation'

import { WEBSITE_JSON_LD } from '~/constants/websiteJsonLd'
import {
  GetChampionsMetaSummaryByFilterDocument,
  GetDailyQuizPreviewDocument,
  GetDailyRandomPokemonDocument,
} from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetChampionsMetaSummaryByFilterQuery,
  GetChampionsMetaSummaryByFilterQueryVariables,
  GetDailyQuizPreviewQuery,
  GetDailyQuizPreviewQueryVariables,
  GetDailyRandomPokemonQuery,
  GetDailyRandomPokemonQueryVariables,
} from '~/graphql/typeGenerated'
import { compareByUsageRank } from '~/utils/championsFormat.util'
import { initializeApollo } from '~/modules/apolloClient.module'
import HomeBottomBanner from '~/components/adSlot/HomeBottomBanner.component'
import HomeTopBanner from '~/components/adSlot/HomeTopBanner.component'
import Home from '~/views/home/Home.view'

import { HOME_META } from './_metadata/homeMetadata'

export const dynamic = 'force-dynamic'

export const metadata = HOME_META

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

const HomePage = async ({ searchParams }: PageProps) => {
  const apolloClient = initializeApollo()

  const params = await searchParams
  const hasFilters = Object.keys(params).length > 0

  if (hasFilters) {
    const queryString = new URLSearchParams(params).toString()
    permanentRedirect(`/list?${queryString}`)
  }

  const { data: pokemonData } = await apolloClient.query<
    GetDailyRandomPokemonQuery,
    GetDailyRandomPokemonQueryVariables
  >({
    query: GetDailyRandomPokemonDocument,
    fetchPolicy: 'network-only',
  })

  const { data: quizData } = await apolloClient.query<
    GetDailyQuizPreviewQuery,
    GetDailyQuizPreviewQueryVariables
  >({
    query: GetDailyQuizPreviewDocument,
    fetchPolicy: 'network-only',
  })

  const { data: championsTopData } = await apolloClient.query<
    GetChampionsMetaSummaryByFilterQuery,
    GetChampionsMetaSummaryByFilterQueryVariables
  >({
    query: GetChampionsMetaSummaryByFilterDocument,
    variables: {
      filter: {
        format: ChampionsFormat.VGC_DOUBLES,
        tier: 'S',
        limit: 3,
      },
    },
    fetchPolicy: 'network-only',
  })

  const dailyPokemon = pokemonData?.getDailyRandomPokemon?.pokemons || []
  const dailyQuiz = quizData?.getDailyQuizPreview
  const topChampionsPokemons = [
    ...(championsTopData?.getChampionsMetaSummary || []),
  ].sort(compareByUsageRank)

  return (
    <Fragment>
      <div className="w-full max-w-[1280px] mx-auto">
        <Home
          dailyPokemon={dailyPokemon}
          dailyQuiz={dailyQuiz}
          topChampionsPokemons={topChampionsPokemons}
          topBanner={<HomeTopBanner />}
          bottomBanner={<HomeBottomBanner />}
        />
      </div>
      <script
        id="website-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(WEBSITE_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default HomePage
