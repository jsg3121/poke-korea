import type { MetadataRoute } from 'next'
import {
  GetPokemonListDocument,
  GetAbilityListPaginatedDocument,
  GetPokemonSkillListDocument,
  GetPokemonGigantamaxListDocument,
  GetChampionsPokemonListDocument,
} from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
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
      url: 'https://poke-korea.com/champions/vgc',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/bss',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/vgc/list',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/bss/list',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/vgc/tier',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/bss/tier',
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
      { data: championsVgcData },
      { data: championsBssData },
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
            format: ChampionsFormat.VGC_DOUBLES,
            pagination: {
              first: 300, // 챔피언스 포켓몬 전체 (271종 + 여유분)
            },
          },
        },
      }),
      apolloClient.query({
        query: GetChampionsPokemonListDocument,
        variables: {
          input: {
            format: ChampionsFormat.BSS_SINGLES,
            pagination: {
              first: 300, // BSS 메타에만 등장하는 포켓몬도 별도 색인 대상
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

    // NOTE: 샤이니 모드 페이지(?shinyMode=shiny) 는 sitemap 에서 제외.
    // Why: canonical URL 이 아닌 query parameter 변형은 Google 이 중복 페이지로
    //      처리하여 크롤링 예산을 낭비한다. 사용자 인터랙션으로만 접근 가능.

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
    // Phase 4: VGC/BSS 는 별개 메타이며 등장 포켓몬도 다르다.
    //          또한 각 포켓몬의 폼(메가/리전/거다이맥스/일반) 라우트도 별도 색인 대상.
    const vgcListResponse = championsVgcData.getChampionsPokemonList
    const bssListResponse = championsBssData.getChampionsPokemonList
    const vgcLastModified = new Date(vgcListResponse.updatedAt)
    const bssLastModified = new Date(bssListResponse.updatedAt)

    /**
     * 챔피언스 포켓몬의 formType + formCode 를 라우트 경로로 변환.
     * buildChampionsDetailHref 와 동일 매핑 (utils 의존성 회피 위해 sitemap 내부 인라인).
     */
    const buildFormPath = (
      formatSlug: 'vgc' | 'bss',
      pokemonId: number,
      formType: string,
      formCode: string | null,
    ): string => {
      const base = `/champions/${formatSlug}/list/${pokemonId}`
      switch (formType) {
        case 'BASE':
          return base
        case 'MEGA':
          return formCode ? `${base}/mega/${formCode}` : `${base}/mega`
        case 'REGION':
          return formCode ? `${base}/region/${formCode}` : `${base}/region`
        case 'NORMAL':
          return formCode ? `${base}/form/${formCode}` : `${base}/form`
        default:
          return base
      }
    }

    const buildChampionsPagesForFormat = (
      formatSlug: 'vgc' | 'bss',
      edges: { node: ChampionsPokemonEdge['node'] }[],
      lastModified: Date,
    ) =>
      edges.map((edge) => ({
        url: `https://poke-korea.com${buildFormPath(
          formatSlug,
          edge.node.externalDexId,
          edge.node.formType,
          edge.node.formCode ?? null,
        )}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))

    const championsDetailPages = [
      ...buildChampionsPagesForFormat(
        'vgc',
        vgcListResponse.edges,
        vgcLastModified,
      ),
      ...buildChampionsPagesForFormat(
        'bss',
        bssListResponse.edges,
        bssLastModified,
      ),
    ]

    // 모든 페이지들을 합쳐서 반환
    return [
      ...staticPages,
      ...basicDetailPages,
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
