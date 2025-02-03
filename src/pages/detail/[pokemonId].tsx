import { GetServerSideProps, NextPage } from 'next'
import { DetailProvider } from '~/context/src/Detail.context'
import { useDevice } from '~/context/src/Device.context'
import {
  GetPokemonNormalFormDocument,
  PokemonDetailDocument,
} from '~/graphql/gqlGenerated'
import { PokemonDetail, PokemonNormalForm } from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { DesktopView, MobileView } from '~/views'

interface IFDetailPokemonInfo {
  pokemonBaseInfo: PokemonDetail
  normalForm: Array<PokemonNormalForm>
}

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
    query: PokemonDetailDocument,
    variables: {
      pokemonId: parseInt(String(query.pokemonId), 10),
    },
    fetchPolicy: 'cache-first',
  })

  const { data: normalFormData } = await apolloClient.query({
    query: GetPokemonNormalFormDocument,
    variables: {
      pokemonId: parseInt(String(query.pokemonId), 10),
    },
    fetchPolicy: 'cache-first',
  })

  const changeRedirect = () => {
    if (
      !data.getPokemonDetail.isMegaEvolution &&
      (query.activeType as string) === 'mega'
    ) {
      return {
        destination: resolvedUrl.replace('mega', 'normal'),
        statusCode: 301,
      }
    } else if (
      !data.getPokemonDetail.isRegionForm &&
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
      pokemonBaseInfo: data.getPokemonDetail,
      normalForm: normalFormData.getPokemonNormalForm,
    },
  }
}
