import type { MetadataRoute } from 'next'
import {
  GetPokemonListDocument,
  GetAbilityListPaginatedDocument,
  GetPokemonSkillListDocument,
  GetPokemonGigantamaxListDocument,
  GetChampionsPokemonListDocument,
} from '~/graphql/gqlGenerated'
import {
  PokemonList,
  PokemonType,
  AbilityEdge,
  PokemonSkillEdge,
  PokemonGigantamax,
  ChampionsPokemonEdge,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

export const revalidate = 0

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
    {
      url: 'https://poke-korea.com/champions',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/list',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/tier',
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
      { data: gigantamaxData },
      { data: abilityData },
      { data: skillsData },
      { data: championsData },
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
        query: GetPokemonGigantamaxListDocument,
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
      apolloClient.query({
        query: GetPokemonSkillListDocument,
        variables: {
          input: {
            pagination: {
              first: 1000, // 모든 기술을 가져오기 위해 충분히 큰 숫자
            },
          },
        },
      }),
      apolloClient.query({
        query: GetChampionsPokemonListDocument,
        variables: {
          input: {
            pagination: {
              first: 200, // 챔피언스 포켓몬 전체
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
      url: `https://poke-korea.com/detail/${pokemon.number}/mega`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }))

    const regionPages = regionData.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/region`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    // 거다이맥스 페이지들 (pokemonId 기준 중복 제거)
    const uniqueGigantamaxPokemonIds = [
      ...new Set(
        gigantamaxData.getPokemonGigantamaxList?.map(
          (gmax: PokemonGigantamax) => gmax.pokemonId,
        ) ?? [],
      ),
    ]
    const gigantamaxPages = uniqueGigantamaxPokemonIds.map((pokemonId) => ({
      url: `https://poke-korea.com/detail/${pokemonId}/gigantamax`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }))

    // 기본폼 변환 가능 포켓몬 상세 페이지들 (isFormChange가 true인 포켓몬)
    const formChangePages = data.getPokemonList
      .filter((pokemon: PokemonList) => pokemon.isFormChange)
      .map((pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/form`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }))

    // 기본폼 변환 가능 포켓몬 기술 페이지들
    const formChangeMovesPages = data.getPokemonList
      .filter((pokemon: PokemonList) => pokemon.isFormChange)
      .map((pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/moves/form`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }))

    // 리전폼 포켓몬 기술 페이지들
    const regionMovesPages = regionData.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/moves/region`,
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
        url: 'https://poke-korea.com/list?isGigantamax=true',
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

    // 기술 상세 페이지들
    const moveDetailPages = skillsData.getPokemonSkillList.edges.map(
      (edge: PokemonSkillEdge) => ({
        url: `https://poke-korea.com/moves/${edge.node.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    // 챔피언스 포켓몬 상세 페이지들
    const championsDetailPages =
      championsData.getChampionsPokemonList.edges.map(
        (edge: ChampionsPokemonEdge) => ({
          url: `https://poke-korea.com/champions/list/${edge.node.externalDexId}`,
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
      ...gigantamaxPages,
      ...formChangePages,
      ...typeFilterListPages,
      ...generationFilterListPages,
      ...booleanFilterListPages,
      ...typeFilterMovesPages,
      ...damageTypeFilterMovesPages,
      ...basicDetailMovesPages,
      ...formChangeMovesPages,
      ...regionMovesPages,
      ...abilityDetailPages,
      ...moveDetailPages,
      ...championsDetailPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 에러 발생 시 기본 정적 페이지들만 반환
    return staticPages
  }
}
