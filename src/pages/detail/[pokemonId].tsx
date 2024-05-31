import { gql } from '@apollo/client'
import { GetServerSideProps, NextPage } from 'next'
import { DetailProvider } from '~/context/src/Detail.context'

import { initializeApollo } from '~/module/apolloClient'
import { IFDetailPokemonInfo } from '~/types/detailInfo.types'
import DetailViews from '~/views/src/Detail.views'

const GET_POKEMON = gql`
  query GetPokemonDetailInfo($number: Float!, $isMega: Boolean!) {
    getSinglePokemon(number: $number) {
      id
      number
      name
      type
      isRegion
      isMega
      typeSingle1
      typeSingle2
      isEvolution
      evolutionId
      generation
      isForm
      abilities {
        name
        description
        isHidden
      }
      stats {
        pokemonId
        hp
        attack
        defense
        specialAttack
        specialDefense
        speed
        total
      }
    }

    getRegionForm(number: $number) {
      pokemonId
      region
      type
      pokemonNumber
      regionStats {
        id
        statCode
        hp
        attack
        defense
        specialAttack
        specialDefense
        speed
        total
      }
      abilities {
        name
        description
        isHidden
      }
    }

    getMegaEvolution(number: $number) @include(if: $isMega) {
      id
      pokemonId
      pokemonNumber
      type
      typeSingle1
      typeSingle2
      megaStats {
        id
        statCode
        hp
        attack
        defense
        specialAttack
        specialDefense
        speed
        total
      }
      abilities {
        name
        description
        isHidden
      }
    }

    getNormalForm(number: $number) {
      id
      pokemonId
      type
      typeSingle1
      typeSingle2
      imagePath
      name
      formStats {
        id
        statCode
        hp
        attack
        defense
        specialAttack
        specialDefense
        speed
        total
      }
      abilities {
        name
        description
        isHidden
      }
    }
  }
`

const PokemonId: NextPage<IFDetailPokemonInfo> = (props) => {
  return (
    <DetailProvider {...props}>
      <DetailViews />;
    </DetailProvider>
  )
}

export default PokemonId

export const getServerSideProps: GetServerSideProps = async (props) => {
  const { resolvedUrl, query } = props

  const isMega = query.activeType === 'mega' ? true : false

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query({
    query: GET_POKEMON,
    variables: {
      number: parseInt(String(query.pokemonId), 10),
      isMega,
    },
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
