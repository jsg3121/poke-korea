import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getChampionsHomeJsonLd } from '~/constants/championsJsonLd'
import {
  GetBestChampionsPokemonDocument,
  GetChampionsTeamCoresDocument,
  GetChampionsTournamentsWithTopTeamDocument,
} from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetBestChampionsPokemonQuery,
  GetBestChampionsPokemonQueryVariables,
  GetChampionsTeamCoresQuery,
  GetChampionsTeamCoresQueryVariables,
  GetChampionsTournamentsWithTopTeamQuery,
  GetChampionsTournamentsWithTopTeamQueryVariables,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  getFormatDescription,
  getFormatShortLabel,
  parseFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import { initializeApollo } from '~/modules/apolloClient.module'
import ChampionsHome from '~/views/champions/ChampionsHome.view'

import { generateChampionsHomeMetadata } from '../_metadata/championsMetadata'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ format: string }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { format } = await params
  const formatSlug = parseFormatSlug(format)

  if (!formatSlug) {
    return {
      title: '포켓몬 챔피언스 도감',
      robots: { index: false, follow: false },
    }
  }

  return generateChampionsHomeMetadata(formatSlug)
}

const ChampionsFormatHomePage = async ({ params }: PageProps) => {
  const { format } = await params
  const formatSlug = parseFormatSlug(format)

  if (!formatSlug) {
    notFound()
  }

  const formatEnum = resolveFormatEnum(formatSlug)

  const apolloClient = initializeApollo()

  const [
    { data: bestData },
    { data: teamCoresData },
    { data: tournamentsData },
  ] = await Promise.all([
    apolloClient.query<
      GetBestChampionsPokemonQuery,
      GetBestChampionsPokemonQueryVariables
    >({
      query: GetBestChampionsPokemonDocument,
      variables: { format: formatEnum },
      fetchPolicy: 'network-only',
    }),
    apolloClient.query<
      GetChampionsTeamCoresQuery,
      GetChampionsTeamCoresQueryVariables
    >({
      query: GetChampionsTeamCoresDocument,
      variables: { format: formatEnum, limit: 30 },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }),
    formatSlug === 'double'
      ? apolloClient.query<
          GetChampionsTournamentsWithTopTeamQuery,
          GetChampionsTournamentsWithTopTeamQueryVariables
        >({
          query: GetChampionsTournamentsWithTopTeamDocument,
          variables: { format: ChampionsFormat.VGC_DOUBLES, limit: 3 },
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        })
      : Promise.resolve({
          data: {
            championsTournaments: [],
          } as GetChampionsTournamentsWithTopTeamQuery,
        }),
  ])

  const topPokemons = bestData?.getBestChampionsPokemon ?? []
  const teamCores = teamCoresData?.championsTeamCores ?? []
  const recentTournaments = tournamentsData?.championsTournaments ?? []

  const formatShort = getFormatShortLabel(formatSlug)
  const webPageJsonLd = getChampionsHomeJsonLd({
    formatSlug,
    name: `포켓몬 챔피언스 ${formatShort} 도감`,
    description: `${getFormatDescription(formatSlug)} 분석 — 포켓몬 채택 순위와 티어, 인기 기술·도구·특성, 팀 조합 정보를 확인하세요.`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <ChampionsHome
        topPokemons={topPokemons}
        teamCores={teamCores}
        recentTournaments={recentTournaments}
        formatSlug={formatSlug as ChampionsFormatSlug}
      />
    </>
  )
}

export default ChampionsFormatHomePage
