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

export const revalidate = 21600

/**
 * 빌드 시점 타임스탬프 (배포 시에만 갱신)
 *
 * Why: 매 요청마다 new Date()를 사용하면 모든 페이지가 "방금 수정됨"으로 표시되어
 * 구글이 lastmod 신호를 신뢰하지 않게 됨. 배포 시점에 고정된 값을 사용하여
 * 실제 변경이 있을 때(=재배포)에만 lastmod가 갱신되도록 함.
 *
 * 챔피언스 페이지는 외부 데이터 갱신이 별도 주기로 일어나므로
 * GraphQL 응답의 updatedAt을 별도로 사용한다.
 *
 * 근거: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
 */
const BUILD_TIME = new Date(process.env.BUILD_TIME ?? new Date().toISOString())

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apolloClient = initializeApollo()

  // 기본 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://poke-korea.com',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://poke-korea.com/list',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://poke-korea.com/type-effectiveness',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/moves',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/ability',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz/silhouette',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz/ability',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz/pokemon-type',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/quiz/type-effectiveness',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/list',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/tier',
      lastModified: BUILD_TIME,
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
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    // 샤이니 모드 페이지들
    const shinyPages = data.getPokemonList.map((pokemon: PokemonList) => ({
      url: `https://poke-korea.com/detail/${pokemon.number}?shinyMode=shiny`,
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.7,
    }))

    const megaPages = megaData.getPokemonList.map((pokemon: PokemonList) => ({
      url: `https://poke-korea.com/detail/${pokemon.number}/mega`,
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.7,
    }))

    const regionPages = regionData.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/region`,
        lastModified: BUILD_TIME,
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
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.7,
    }))

    // 기본폼 변환 가능 포켓몬 상세 페이지들 (isFormChange가 true인 포켓몬)
    const formChangePages = data.getPokemonList
      .filter((pokemon: PokemonList) => pokemon.isFormChange)
      .map((pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/form`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }))

    // 기본폼 변환 가능 포켓몬 기술 페이지들
    const formChangeMovesPages = data.getPokemonList
      .filter((pokemon: PokemonList) => pokemon.isFormChange)
      .map((pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/moves/form`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }))

    // 리전폼 포켓몬 기술 페이지들
    const regionMovesPages = regionData.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/moves/region`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    const typeFilterMovesPages = Object.values(PokemonType).map((type) => {
      return {
        url: `https://poke-korea.com/moves?typeFilter=${type}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }
    })

    // 포켓몬 리스트 타입별 필터 페이지들
    const typeFilterListPages = Object.values(PokemonType).map((type) => {
      return {
        url: `https://poke-korea.com/list?type=${type}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      }
    })

    // 포켓몬 리스트 세대별 필터 페이지들
    const generationFilterListPages = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      (gen) => ({
        url: `https://poke-korea.com/list?generation=${gen}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      }),
    )

    // 포켓몬 리스트 Boolean 필터 페이지들
    const booleanFilterListPages = [
      {
        url: 'https://poke-korea.com/list?isMega=true',
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://poke-korea.com/list?isRegion=true',
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://poke-korea.com/list?isGigantamax=true',
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://poke-korea.com/list?isEvolution=true',
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://poke-korea.com/list?isEvolution=false',
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]

    const damageTypeFilterMovesPages = [
      {
        url: `https://poke-korea.com/moves?damageTypeFilter=%EB%AC%BC%EB%A6%AC`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      },
      {
        url: `https://poke-korea.com/moves?damageTypeFilter=%ED%8A%B9%EC%88%98`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      },
      {
        url: `https://poke-korea.com/moves?damageTypeFilter=%EB%B3%80%ED%99%94`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      },
    ]

    const basicDetailMovesPages = data.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/moves`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    // 특성 상세 페이지들
    const abilityDetailPages = abilityData.getAbilityListPaginated.edges.map(
      (edge: AbilityEdge) => ({
        url: `https://poke-korea.com/ability/${edge.node.abilityId}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    // 기술 상세 페이지들
    const moveDetailPages = skillsData.getPokemonSkillList.edges.map(
      (edge: PokemonSkillEdge) => ({
        url: `https://poke-korea.com/moves/${edge.node.id}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    // 챔피언스 포켓몬 상세 페이지들 (모바일 출시 대비 크롤링 우선순위 상향)
    // lastmod는 외부 데이터(battle_meta.json) 기준 갱신 시각을 사용
    // Why: 챔피언스 메타는 외부 소스에서 주기적으로 갱신되므로, 빌드 시점이 아닌
    // 실제 콘텐츠 변경 시점이 lastmod에 반영되어야 한다.
    const championsListResponse = championsData.getChampionsPokemonList
    const championsLastModified = new Date(championsListResponse.updatedAt)

    const championsDetailPages = championsListResponse.edges.map(
      (edge: ChampionsPokemonEdge) => ({
        url: `https://poke-korea.com/champions/list/${edge.node.externalDexId}`,
        lastModified: championsLastModified,
        changeFrequency: 'daily',
        priority: 0.8,
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
