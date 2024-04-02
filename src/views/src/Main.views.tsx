import { gql } from '@apollo/client'
import React from 'react'
import { Header, List } from '~/container'
import { ListProvider } from '~/context'
import { initializeApollo } from '~/module/apolloClient'

const QUERY = gql`
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
      id
      typeSingle1
      typeSingle2
      isEvolution
      evolutionId
      generation
      isForm
    }
  }
`

const MainViews: React.FC = () => {
  return (
    <ListProvider>
      <Header />
      <List />
    </ListProvider>
  )
}

export default MainViews

export const getServerSideProps = async ({
  params: { type },
}: {
  params: { type: Array<string> }
}) => {
  console.log('ssss')
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query({
    query: QUERY,
  })

  return {
    props: { type },
  }
}
