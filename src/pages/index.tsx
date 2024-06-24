import { gql } from '@apollo/client'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import { useDevice } from '~/context/src/Device.context'
import { Pokemon } from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import {
  changeTypeArrayToString,
  toBooleanOrUndefined,
} from '~/module/filter.module'
import { DesktopView } from '~/views'

const QUERY = gql`
  fragment PokemonInfo on Pokemon {
    id
    typeSingle1
    typeSingle2
    isEvolution
    evolutionId
    generation
    isForm
    ...PokemonCard
  }

  fragment PokemonCard on Pokemon {
    id
    number
    name
    type
    isRegion
    isMega
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

  query getPokemonList(
    $pokemonNumber: Int
    $type: [String!]
    $isMega: Boolean
    $isRegion: Boolean
    $isEvolution: Boolean
    $name: String
    $generation: [String!]
  ) {
    getPokemonFilter(
      pokemonNumber: $pokemonNumber
      type: $type
      isMega: $isMega
      isRegion: $isRegion
      isEvolution: $isEvolution
      name: $name
      generation: $generation
    ) {
      ...PokemonInfo
    }
  }
`

interface HomeProps {
  loading: boolean
  pokemonList: Array<Pokemon>
}

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
`

const Home: NextPage<HomeProps> = ({ pokemonList, loading }) => {
  const { isMobile } = useDevice()
  if (loading) return <></>

  return (
    <>
      <Head>
        <title>포켓몬의 모든 정보 포케 코리아</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        {isMobile ? <></> : <DesktopView.MainViews pokemonList={pokemonList} />}
      </Main>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (props) => {
  const { query } = props
  const apolloClient = initializeApollo()

  const { type, isMega, isRegion, isEvolution, ...restQuery } = query

  const filterInput = {
    ...restQuery,
    ...(isMega && { isMega: toBooleanOrUndefined(isMega as string) }),
    ...(isRegion && { isRegion: toBooleanOrUndefined(isRegion as string) }),
    ...(isEvolution && {
      isEvolution: toBooleanOrUndefined(isEvolution as string),
    }),
    ...(type && { type: changeTypeArrayToString(type as string) }),
  }

  const { data, loading } = await apolloClient.query({
    query: QUERY,
    variables: filterInput,
  })

  return {
    props: {
      loading,
      ...(data && {
        pokemonList: data.getPokemonFilter || [],
      }),
    },
  }
}
