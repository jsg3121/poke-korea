import { Metadata } from 'next'
import { Fragment } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Head from 'next/head'
import { DetailProvider } from '~/context/Detail.context'
import { detectUserAgent } from '~/module/device.module'
import {
  GetPokemonMegaEvolutionDocument,
  GetPokemonNormalFormDocument,
  GetPokemonRegionFormDocument,
  PokemonDetailDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonMegaEvolutionQuery,
  GetPokemonNormalFormQuery,
  GetPokemonRegionFormQuery,
  PokemonDetail,
  PokemonDetailQuery,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import DetailDesktop from '~/views/desktop/Detail.desktop'
import DetailMobile from '~/views/mobile/Detail.mobile'
import { SHINY_QNA_JSON_LD } from '../../../constants/shinyJsonLd'

interface DetailPageProps {
  params: { pokemonId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

interface DetailPokemonInfo {
  pokemonBaseInfo: PokemonDetail
  normalForm: Array<PokemonNormalForm>
  megaEvolutionData?: Array<PokemonMegaEvolution>
  regionFormData?: Array<PokemonRegionForm>
  isShinyInfo: boolean
}

export async function generateMetadata(
  { params, searchParams }: DetailPageProps,
): Promise<Metadata> {
  const pokemonId = parseInt(params.pokemonId, 10)
  const apolloClient = initializeApollo()

  try {
    const { data } = await apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId },
      fetchPolicy: 'cache-first',
    })

    const pokemon = data.getPokemonDetail
    const pokemonName = pokemon?.name || `포켓몬 ${pokemonId}`

    return {
      title: `${pokemonName} - 포케 코리아`,
      description: `${pokemonName}의 상세 정보를 확인하세요. 능력치, 타입, 특성, 진화 정보를 제공합니다.`,
      openGraph: {
        title: `${pokemonName} - 포케 코리아`,
        description: `${pokemonName}의 상세 정보를 확인하세요.`,
        url: `https://poke-korea.com/detail/${pokemonId}`,
        siteName: '포케 코리아',
        images: [
          {
            url: 'https://poke-korea.com/assets/image/ogImage.png',
            width: 1200,
            height: 630,
            alt: 'poke-korea',
          },
        ],
      },
      canonical: `https://poke-korea.com/detail/${pokemonId}`,
    }
  } catch (error) {
    return {
      title: '포켓몬 상세 정보 - 포케 코리아',
      description: '포켓몬의 상세 정보를 확인하세요.',
    }
  }
}

const DetailPage = async ({ params, searchParams }: DetailPageProps) => {
  const pokemonId = parseInt(params.pokemonId, 10)
  const activeType = searchParams.activeType as string
  const shinyMode = searchParams.shinyMode as string

  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  // Fetch base data
  const [{ data: defaultPokemonData }, { data: normalFormData }] =
    await Promise.all([
      apolloClient.query<PokemonDetailQuery>({
        query: PokemonDetailDocument,
        variables: { pokemonId },
        fetchPolicy: 'cache-first',
      }),
      apolloClient.query<GetPokemonNormalFormQuery>({
        query: GetPokemonNormalFormDocument,
        variables: { pokemonId },
        fetchPolicy: 'cache-first',
      }),
    ])

  const pokemonDetail = defaultPokemonData.getPokemonDetail
  
  if (!pokemonDetail) {
    redirect('/')
  }

  // Handle redirects
  if (
    !pokemonDetail.isMegaEvolution &&
    activeType === 'mega'
  ) {
    const url = new URL(`/detail/${pokemonId}`, 'https://poke-korea.com')
    url.searchParams.set('activeType', 'normal')
    if (shinyMode) url.searchParams.set('shinyMode', shinyMode)
    redirect(url.pathname + url.search)
  }

  if (
    !pokemonDetail.isRegionForm &&
    activeType === 'region'
  ) {
    const url = new URL(`/detail/${pokemonId}`, 'https://poke-korea.com')
    url.searchParams.set('activeType', 'normal')
    if (shinyMode) url.searchParams.set('shinyMode', shinyMode)
    redirect(url.pathname + url.search)
  }

  let props: DetailPokemonInfo = {
    pokemonBaseInfo: pokemonDetail,
    normalForm: normalFormData.getPokemonNormalForm,
    isShinyInfo: shinyMode === 'shiny',
  }

  // Fetch additional data based on activeType
  if (activeType === 'mega') {
    const { data: megaEvolutionData } =
      await apolloClient.query<GetPokemonMegaEvolutionQuery>({
        query: GetPokemonMegaEvolutionDocument,
        variables: { pokemonId },
        fetchPolicy: 'cache-first',
      })

    props.megaEvolutionData = megaEvolutionData.getPokemonMegaEvolution
  }

  if (activeType === 'region') {
    const { data: regionFormData } =
      await apolloClient.query<GetPokemonRegionFormQuery>({
        query: GetPokemonRegionFormDocument,
        variables: { pokemonId },
        fetchPolicy: 'cache-first',
      })

    props.regionFormData = regionFormData.getPokemonRegionForm
  }

  return (
    <Fragment>
      {props.isShinyInfo && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(SHINY_QNA_JSON_LD),
            }}
          />
        </Head>
      )}
      <DetailProvider {...props}>
        {isMobile ? <DetailMobile /> : <DetailDesktop />}
      </DetailProvider>
    </Fragment>
  )
}

export default DetailPage