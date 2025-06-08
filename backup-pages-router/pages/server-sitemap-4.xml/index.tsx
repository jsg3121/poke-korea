import { GetServerSideProps } from 'next'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { GetPokemonListDocument } from '~/graphql/gqlGenerated'
import { PokemonList } from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

export const getServerSideProps: GetServerSideProps = async (props) => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query({
    query: GetPokemonListDocument,
    variables: {
      filter: {
        isRegionForm: true,
      },
    },
  })

  const dynamicSiteMapIdsWithQuery = data.getPokemonList.map(
    (pokemon: PokemonList) => {
      return {
        loc: `https://poke-korea.com/detail/${pokemon.number}?activeType=region`, // 페이지 경로
        lastmod: new Date().toISOString(), // 최근변경일자
        changefreq: 'daily', // 페이지 주소 변경 빈도 (검색엔진에 제공됨) - always, daily, hourly, monthly, never, weekly, yearly 중 택 1
        priority: 0.7, // 페이지 주소 우선순위 (검색엔진에 제공됨, 우선순위가 높은 순서대로 크롤링함)
      }
    },
  )

  return getServerSideSitemapLegacy(props, dynamicSiteMapIdsWithQuery)
}

export default function SitemapIndex() {}
