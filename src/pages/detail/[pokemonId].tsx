import { GetServerSideProps, NextPage } from 'next'
import { DetailProvider } from '~/context/src/Detail.context'
import { useDevice } from '~/context/src/Device.context'
import { initializeApollo } from '~/module/apolloClient'
import { IFDetailPokemonInfo } from '~/types/detailInfo.types'
import { DesktopView, MobileView } from '~/views'

const PokemonId: NextPage<IFDetailPokemonInfo> = (props) => {
  const { isMobile } = useDevice()

  return (
    <DetailProvider {...props}>
      {isMobile ? <MobileView.DetailViews /> : <DesktopView.DetailViews />}
    </DetailProvider>
  )
}

export default PokemonId

export const getServerSideProps: GetServerSideProps = async (props) => {
  const { resolvedUrl, query } = props

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query({
    query: GET_POKEMON,
    variables: {
      number: parseInt(String(query.pokemonId), 10),
    },
    fetchPolicy: 'cache-first',
  })

  const changeRedirect = () => {
    if (
      !data.getSinglePokemon.isMega &&
      (query.activeType as string) === 'mega'
    ) {
      return {
        destination: resolvedUrl.replace('mega', 'normal'),
        statusCode: 301,
      }
    } else if (
      !data.getSinglePokemon.isRegion &&
      (query.activeType as string) === 'region'
    ) {
      return {
        destination: resolvedUrl.replace('region', 'normal'),
        statusCode: 301,
      }
    }
  }

  const redirectOption = changeRedirect()

  return {
    redirect: redirectOption,
    props: {
      pokemonBaseInfo: data.getSinglePokemon,
      regionFormInfo: data.getRegionForm ?? null,
      megaEvolutions: data.getMegaEvolution ?? null,
      normalForm: data.getNormalForm ?? null,
    },
  }
}
