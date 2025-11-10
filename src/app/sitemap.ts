import type { MetadataRoute } from 'next'
import {
  GetPokemonListDocument,
  GetAbilityListPaginatedDocument,
} from '~/graphql/gqlGenerated'
import { PokemonList, PokemonType, AbilityEdge } from '~/graphql/typeGenerated'
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
      url: 'https://poke-korea.com/list',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
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
      url: 'https://poke-korea.com/ability',
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
    const [
      { data },
      { data: megaData },
      { data: regionData },
      { data: abilityData },
    ] = await Promise.all([
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
      apolloClient.query({
        query: GetAbilityListPaginatedDocument,
        variables: {
          input: {
            pagination: {
              first: 1000, // 모든 특성을 가져오기 위해 충분히 큰 숫자
            },
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

    // 포켓몬 리스트 타입별 필터 페이지들
    const typeFilterListPages = Object.values(PokemonType).map((type) => {
      return {
        url: `https://poke-korea.com/list?type=${type}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      }
    })

    // 포켓몬 리스트 세대별 필터 페이지들
    const generationFilterListPages = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      (gen) => ({
        url: `https://poke-korea.com/list?generation=${gen}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      }),
    )

    // 포켓몬 리스트 Boolean 필터 페이지들
    const booleanFilterListPages = [
      {
        url: 'https://poke-korea.com/list?isMega=true',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://poke-korea.com/list?isRegion=true',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://poke-korea.com/list?isEvolution=true',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://poke-korea.com/list?isEvolution=false',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]

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

    // 특성 상세 페이지들
    const abilityDetailPages = abilityData.getAbilityListPaginated.edges.map(
      (edge: AbilityEdge) => ({
        url: `https://poke-korea.com/ability/${edge.node.abilityId}`,
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
      ...typeFilterListPages,
      ...generationFilterListPages,
      ...booleanFilterListPages,
      ...typeFilterMovesPages,
      ...damageTypeFilterMovesPages,
      ...basicDetailMovesPages,
      ...abilityDetailPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 에러 발생 시 기본 정적 페이지들만 반환
    return staticPages
  }
}
