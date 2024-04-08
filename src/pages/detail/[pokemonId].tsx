import { gql } from '@apollo/client'
import { GetServerSideProps, NextPage } from 'next'

import { initializeApollo } from '~/module/apolloClient'
import { IFDetailPokemonInfo } from '~/types/detailInfo.types'
import DetailViews from '~/views/src/Detail.views'

const GET_POKEMON = gql`
  query GetPokemonDetailInfo($number: Float!) {
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
    }

    getMegaEvolution(number: $number) {
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
    }
  }
`

const PokemonId: NextPage<IFDetailPokemonInfo> = (props) => {
  return (
    <>
      <DetailViews {...props} />
    </>
  )
}

export default PokemonId

export const getServerSideProps: GetServerSideProps = async (props) => {
  const { query } = props

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query({
    query: GET_POKEMON,
    variables: {
      number: parseInt(String(query.pokemonId), 10),
    },
  })

  return {
    props: {
      pokemonBaseInfo: data.getSinglePokemon,
      regionFormInfo: data.getRegionForm,
      megaEvolutions: data.getMegaEvolution,
      normalForm: data.getNormalForm,
    },
  }
}
