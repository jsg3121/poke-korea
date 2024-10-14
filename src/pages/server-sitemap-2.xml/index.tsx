import { gql } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { Pokemon } from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module'

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

  query getPokemonListSiteMap {
    getPokemonFilter {
      ...PokemonInfo
    }
  }
`

export const getServerSideProps: GetServerSideProps = async (props) => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query({
    query: QUERY,
  })

  const dynamicSiteMapIdsWithQuery = data.getPokemonFilter.map(
    (pokemon: Pokemon) => {
      return {
        loc: `https://poke-korea.com/detail/${pokemon.number}?shinyMode=shiny`, // 페이지 경로
        lastmod: new Date().toISOString(), // 최근변경일자
        changefreq: 'daily', // 페이지 주소 변경 빈도 (검색엔진에 제공됨) - always, daily, hourly, monthly, never, weekly, yearly 중 택 1
        priority: 0.7, // 페이지 주소 우선순위 (검색엔진에 제공됨, 우선순위가 높은 순서대로 크롤링함)
      }
    },
  )

  return getServerSideSitemapLegacy(props, dynamicSiteMapIdsWithQuery)
}

export default function SitemapIndex() {}
