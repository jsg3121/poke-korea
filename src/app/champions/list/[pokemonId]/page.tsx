import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { GetChampionsPokemonDetailDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import ChampionsDetailDesktop from '~/views/desktop/champions/ChampionsDetail.desktop'
import ChampionsDetailMobile from '~/views/mobile/champions/ChampionsDetail.mobile'
import { generateChampionsDetailMetadata } from './_metadata/generateChampionsDetailMetadata'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ pokemonId: string }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { pokemonId } = await params
  const parsedPokemonId = parseInt(pokemonId, 10)
  return generateChampionsDetailMetadata(parsedPokemonId)
}

const ChampionsDetailPage = async ({ params }: PageProps) => {
  const { pokemonId } = await params
  const externalDexId = parseInt(pokemonId, 10)

  if (isNaN(externalDexId) || externalDexId <= 0) {
    notFound()
  }

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetChampionsPokemonDetailQuery,
    GetChampionsPokemonDetailQueryVariables
  >({
    query: GetChampionsPokemonDetailDocument,
    variables: { externalDexId },
  })

  const detail = data?.getChampionsPokemonDetail

  if (!detail?.pokemon) {
    notFound()
  }

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
        name: '챔피언스',
        item: 'https://poke-korea.com/champions',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '도감',
        item: 'https://poke-korea.com/champions/list',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: detail.pokemon.name,
        item: `https://poke-korea.com/champions/list/${pokemonId}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="w-full min-h-screen">
        {isMobile ? (
          <ChampionsDetailMobile detail={detail} />
        ) : (
          <ChampionsDetailDesktop detail={detail} />
        )}
      </main>
    </>
  )
}

export default ChampionsDetailPage
