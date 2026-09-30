import type { MetadataRoute } from 'next'

import {
  GetAbilityListPaginatedDocument,
  GetAllSkillIdsDocument,
  GetChampionsPokemonListDocument,
  GetChampionsTournamentsDocument,
  GetPokemonGigantamaxListDocument,
  GetPokemonListDocument,
} from '~/graphql/gqlGenerated'
import {
  AbilityEdge,
  ChampionsFormat,
  ChampionsPokemonEdge,
  ChampionsTournamentSummaryFragment,
  PokemonGigantamax,
  PokemonList,
  PokemonType,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/modules/apolloClient.module'
import { TYPE_SLUGS } from '~/modules/typeParams.module'

export const revalidate = 21600

const BUILD_TIME = new Date(process.env.BUILD_TIME ?? new Date().toISOString())

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apolloClient = initializeApollo()

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
    ...TYPE_SLUGS.map((slug) => ({
      url: `https://poke-korea.com/type-effectiveness/${slug}`,
      lastModified: BUILD_TIME,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
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
      url: 'https://poke-korea.com/champions/double',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/single',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/double/list',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/single/list',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/double/tier',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/single/tier',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/champions/tournaments',
      lastModified: BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://poke-korea.com/privacy',
      lastModified: BUILD_TIME,
      changeFrequency: 'yearly',
      priority: 0.3,
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
      { data: tournamentsData },
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
        query: GetAllSkillIdsDocument,
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
      apolloClient.query({
        query: GetChampionsTournamentsDocument,
        variables: {
          format: ChampionsFormat.VGC_DOUBLES,
          limit: 200,
        },
        errorPolicy: 'all',
      }),
    ])

    const basicDetailPages = data.getPokemonList.map(
      (pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

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

    const formChangePages = data.getPokemonList
      .filter((pokemon: PokemonList) => pokemon.isFormChange)
      .map((pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/form`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }))

    const formChangeMovesPages = data.getPokemonList
      .filter((pokemon: PokemonList) => pokemon.isFormChange)
      .map((pokemon: PokemonList) => ({
        url: `https://poke-korea.com/detail/${pokemon.number}/moves/form`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }))

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

    const typeFilterListPages = Object.values(PokemonType).map((type) => {
      return {
        url: `https://poke-korea.com/list?type=${type}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      }
    })

    const generationFilterListPages = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      (gen) => ({
        url: `https://poke-korea.com/list?generation=${gen}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.8,
      }),
    )

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

    const abilityDetailPages = abilityData.getAbilityListPaginated.edges.map(
      (edge: AbilityEdge) => ({
        url: `https://poke-korea.com/ability/${edge.node.abilityId}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    const moveDetailPages = skillsData.getAllSkillIds.map(
      (skillId: number) => ({
        url: `https://poke-korea.com/moves/${skillId}`,
        lastModified: BUILD_TIME,
        changeFrequency: 'daily',
        priority: 0.7,
      }),
    )

    const vgcListResponse = championsVgcData.getChampionsPokemonList
    const bssListResponse = championsBssData.getChampionsPokemonList
    const vgcLastModified = new Date(vgcListResponse.updatedAt)
    const bssLastModified = new Date(bssListResponse.updatedAt)

    const buildFormPath = (
      formatSlug: 'double' | 'single',
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
      formatSlug: 'double' | 'single',
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
        'double',
        vgcListResponse.edges,
        vgcLastModified,
      ),
      ...buildChampionsPagesForFormat(
        'single',
        bssListResponse.edges,
        bssLastModified,
      ),
    ]

    const resolveTournamentLastModified = (date: string | null | undefined) => {
      if (!date) return BUILD_TIME
      const parsed = new Date(date)
      return Number.isNaN(parsed.getTime()) ? BUILD_TIME : parsed
    }

    const tournamentDetailPages =
      tournamentsData?.championsTournaments?.map(
        (tournament: ChampionsTournamentSummaryFragment) => ({
          url: `https://poke-korea.com/champions/tournaments/${tournament.externalId}`,
          lastModified: resolveTournamentLastModified(tournament.date),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }),
      ) ?? []

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
      ...tournamentDetailPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
