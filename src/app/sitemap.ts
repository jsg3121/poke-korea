import type { MetadataRoute } from 'next'
import { GetPokemonListDocument } from '~/graphql/gqlGenerated'
import { PokemonList, PokemonType } from '~/graphql/typeGenerated'
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
    {
      url: 'https://poke-korea.com/moves',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz/silhouette',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz/ability',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz/pokemon-type',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz/type-effectiveness',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  try {
    const [{ data }, { data: megaData }, { data: regionData }] =
      await Promise.all([
        apolloClient.query({
          query: GetPokemonListDocument,
          variables: {
            filter: {},
          },
        }),
        apolloClient.query({
          query: GetPokemonListDocument,
          variables: {
            filter: {
              isMegaEvolution: true,
            },
          },
        }),
        apolloClient.query({
          query: GetPokemonListDocument,
          variables: {
            filter: {
              isRegionForm: true,
            },
          },
        }),
      ])

    // 기본 포켓몬 상세 페이지들
    const basicDetailPages = data.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    // 샤이니 모드 페이지들
    const shinyPages = data.getPokemonList.map((pokemon: PokemonList) => ({
      url: `https://poke-korea.com/detail/${pokemon.number}?shinyMode=shiny`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }))

    const megaPages = megaData.getPokemonList.map((pokemon: PokemonList) => ({
      url: `https://poke-korea.com/detail/${pokemon.number}?activeType=mega`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }))

    const regionPages = regionData.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}?activeType=region`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    const typeFilterMovesPages = Object.values(PokemonType).map((type) => {
      return {
        url: `https://poke-korea.com/moves?typeFilter=${type}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }
    })

    const damageTypeFilterMovesPages = [
      {
        url: `https://poke-korea.com/moves?damageTypeFilter=%EB%AC%BC%EB%A6%AC`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
      {
        url: `https://poke-korea.com/moves?damageTypeFilter=%ED%8A%B9%EC%88%98`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
      {
        url: `https://poke-korea.com/moves?damageTypeFilter=%EB%B3%80%ED%99%94`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
    ]

    const basicDetailMovesPages = data.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/moves`,
        lastModified: new Date(),
        changeFrequency: 'daily',
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
      ...typeFilterMovesPages,
      ...damageTypeFilterMovesPages,
      ...basicDetailMovesPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 에러 발생 시 기본 정적 페이지들만 반환
    return staticPages
  }
}
