import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { Fragment } from 'react'
import { DetailProvider } from '~/context/Detail.context'
import { useDevice } from '~/context/Device.context'
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
import { SHINY_QNA_JSON_LD } from '../../constants/shinyJsonLd'

interface IFDetailPokemonInfo {
  pokemonBaseInfo: PokemonDetail
  normalForm: Array<PokemonNormalForm>
  megaEvolutionData?: Array<PokemonMegaEvolution>
  regionFormData?: Array<PokemonRegionForm>
  isShinyInfo: boolean
}

const PokemonId: NextPage<IFDetailPokemonInfo> = (props) => {
  const { isShinyInfo } = props
  const { isMobile } = useDevice()

  return (
    <Fragment>
      {isShinyInfo && (
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

export default PokemonId

export const getServerSideProps: GetServerSideProps = async (props) => {
  const { resolvedUrl, query } = props

  const apolloClient = initializeApollo()

  const [{ data: defaultPokemonData }, { data: normalFormData }] =
    await Promise.all([
      apolloClient.query<PokemonDetailQuery>({
        query: PokemonDetailDocument,
        variables: {
          pokemonId: parseInt(String(query.pokemonId), 10),
        },
        fetchPolicy: 'cache-first',
      }),
      apolloClient.query<GetPokemonNormalFormQuery>({
        query: GetPokemonNormalFormDocument,
        variables: {
          pokemonId: parseInt(String(query.pokemonId), 10),
        },
        fetchPolicy: 'cache-first',
      }),
    ])

  const changeRedirect = () => {
    if (
      !defaultPokemonData.getPokemonDetail?.isMegaEvolution &&
      (query.activeType as string) === 'mega'
    ) {
      return {
        destination: resolvedUrl.replace('mega', 'normal'),
        statusCode: 301,
      }
    } else if (
      !defaultPokemonData.getPokemonDetail?.isRegionForm &&
      (query.activeType as string) === 'region'
    ) {
      return {
        destination: resolvedUrl.replace('region', 'normal'),
        statusCode: 301,
      }
    }
  }

  const redirectOption = changeRedirect()

  if (query.activeType === 'mega') {
    const { data: megaEvolutionData } =
      await apolloClient.query<GetPokemonMegaEvolutionQuery>({
        query: GetPokemonMegaEvolutionDocument,
        variables: {
          pokemonId: parseInt(String(query.pokemonId), 10),
        },
        fetchPolicy: 'cache-first',
      })

    return {
      redirect: redirectOption,
      props: {
        pokemonBaseInfo: defaultPokemonData.getPokemonDetail,
        normalForm: normalFormData.getPokemonNormalForm,
        megaEvolutionData: megaEvolutionData.getPokemonMegaEvolution,
      },
    }
  }

  if (query.activeType === 'region') {
    const { data: regionFormData } =
      await apolloClient.query<GetPokemonRegionFormQuery>({
        query: GetPokemonRegionFormDocument,
        variables: {
          pokemonId: parseInt(String(query.pokemonId), 10),
        },
        fetchPolicy: 'cache-first',
      })

    return {
      redirect: redirectOption,
      props: {
        pokemonBaseInfo: defaultPokemonData.getPokemonDetail,
        normalForm: normalFormData.getPokemonNormalForm,
        regionFormData: regionFormData.getPokemonRegionForm,
      },
    }
  }

  const isShinyInfo = query.shinyMode === 'shiny'

  return {
    redirect: redirectOption,
    props: {
      pokemonBaseInfo: defaultPokemonData.getPokemonDetail,
      normalForm: normalFormData.getPokemonNormalForm,
      isShinyInfo,
    },
  }
}
