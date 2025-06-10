import type { MetadataRoute } from 'next'
import { GetPokemonListDocument } from '~/graphql/gqlGenerated'
import { PokemonList } from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apolloClient = initializeApollo()

  // 기본 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://poke-korea.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://poke-korea.com/type-effectiveness',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  try {
    // 모든 포켓몬 데이터 가져오기
    const { data } = await apolloClient.query({
      query: GetPokemonListDocument,
      variables: {
        filter: {},
      },
    })

    // 1. 기본 포켓몬 상세 페이지들
    const basicDetailPages = data.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }),
    )

    // 2. 샤이니 모드 페이지들
    const shinyPages = data.getPokemonList.map((pokemon: PokemonList) => ({
      url: `https://poke-korea.com/detail/${pokemon.number}?shinyMode=shiny`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

    // 3. 메가 진화 포켓몬 페이지들 (메가 진화가 있는 포켓몬만)
    const { data: megaData } = await apolloClient.query({
      query: GetPokemonListDocument,
      variables: {
        filter: {
          isMegaEvolution: true,
        },
      },
    })

    const megaPages = megaData.getPokemonList.map((pokemon: PokemonList) => ({
      url: `https://poke-korea.com/detail/${pokemon.number}?activeType=mega`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

    // 4. 지역 폼 포켓몬 페이지들 (지역 폼이 있는 포켓몬만)
    const { data: regionData } = await apolloClient.query({
      query: GetPokemonListDocument,
      variables: {
        filter: {
          isRegionForm: true,
        },
      },
    })

    const regionPages = regionData.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}?activeType=region`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }),
    )

    // 모든 페이지들을 합쳐서 반환
    return [
      ...staticPages,
      ...basicDetailPages,
      ...shinyPages,
      ...megaPages,
      ...regionPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 에러 발생 시 기본 정적 페이지들만 반환
    return staticPages
  }
}
