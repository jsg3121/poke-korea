import { Metadata } from 'next'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { OG_IMAGE_BASE, SITE_NAME, SITE_URL } from '~/constants/seo.constant'
import { GetChampionsPokemonDetailDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsPokemonDetailFragment,
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables,
  PokemonType,
} from '~/graphql/typeGenerated'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import { initializeApollo } from '~/modules/apolloClient.module'

type DetailPokemon = ChampionsPokemonDetailFragment['pokemon']
type DetailMeta = ChampionsPokemonDetailFragment['meta']
type DetailStats = DetailPokemon['stats']

const getKoreanTypesText = (types: Array<PokemonType>): string =>
  types.map((type) => PokemonTypes[type]).join('·')

const getStatHighlights = (stats: DetailStats): string => {
  const statEntries: Array<{ label: string; value: number }> = [
    { label: 'HP', value: stats.hp },
    { label: '공격', value: stats.attack },
    { label: '방어', value: stats.defense },
    { label: '특수공격', value: stats.specialAttack },
    { label: '특수방어', value: stats.specialDefense },
    { label: '스피드', value: stats.speed },
  ]
  const [top, second] = [...statEntries].sort((a, b) => b.value - a.value)
  if (!top || !second) {
    return ''
  }
  return `${top.label} ${top.value}, ${second.label} ${second.value}`
}

const getMetaHighlight = (meta: DetailMeta): string | null => {
  if (!meta) return null
  const topMove = meta.topMoves?.[0]?.name
  const topAbility = meta.topAbilities?.[0]?.name
  if (!topMove && !topAbility) return null
  if (topMove && topAbility) return `인기 기술 ${topMove}, ${topAbility} 특성`
  return topMove ? `인기 기술 ${topMove}` : `${topAbility} 특성`
}

const buildDetailTitle = (pokemon: DetailPokemon): string => {
  return `${pokemon.name} 챔피언스 도감 - 스탯·기술·특성`
}

const buildDetailDescription = (
  pokemon: DetailPokemon,
  meta: DetailMeta,
): string => {
  const typesText = getKoreanTypesText(pokemon.types)
  const metaHighlight = getMetaHighlight(meta)

  if (metaHighlight) {
    return `${typesText} 타입 ${pokemon.name} 챔피언스 정보. ${metaHighlight}, 추천 파트너·스탯 확인.`
  }

  const statHighlight = getStatHighlights(pokemon.stats)
  return `${typesText} 타입 ${pokemon.name} 챔피언스 정보. ${statHighlight} 등 스탯·기술·특성 확인.`
}

function getOgImageUrls(
  pokemonNumber: number,
  formType: string,
  formIndex: number,
) {
  const normalizedFormType = formType.toLowerCase()

  const folder =
    normalizedFormType === 'base' || normalizedFormType === 'normal'
      ? formIndex > 0
        ? 'form'
        : 'default'
      : normalizedFormType

  const fileId =
    folder === 'default' || folder === 'gigantamax'
      ? `${pokemonNumber}`
      : `${pokemonNumber}-${formIndex}`

  return {
    large: `${OG_IMAGE_BASE}/${folder}/${fileId}-large.png`,
    medium: `${OG_IMAGE_BASE}/${folder}/${fileId}-medium.png`,
  }
}

interface GenerateMetadataArgs {
  pokemonId: number
  formatSlug: ChampionsFormatSlug
  formCode?: string | null
}

export const generateChampionsDetailMetadata = async ({
  pokemonId,
  formatSlug,
  formCode,
}: GenerateMetadataArgs): Promise<Metadata> => {
  if (isNaN(pokemonId) || pokemonId <= 0) {
    return {
      title: '포켓몬을 찾을 수 없습니다',
      description: '요청하신 포켓몬 정보를 찾을 수 없습니다.',
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetChampionsPokemonDetailQuery,
    GetChampionsPokemonDetailQueryVariables
  >({
    query: GetChampionsPokemonDetailDocument,
    variables: {
      pokemonId,
      format: resolveFormatEnum(formatSlug),
      ...(formCode ? { formCode } : {}),
    },
  })

  const detail = data?.getChampionsPokemonDetail
  const pokemon = detail?.pokemon

  if (!pokemon) {
    return {
      title: '포켓몬을 찾을 수 없습니다',
      description: '요청하신 포켓몬 정보를 찾을 수 없습니다.',
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  const title = buildDetailTitle(pokemon)
  const description = buildDetailDescription(pokemon, detail?.meta)

  const ogImages = getOgImageUrls(
    pokemon.pokemonNumber,
    pokemon.formType ?? 'normal',
    pokemon.formIndex ?? 0,
  )

  const canonicalPath = buildChampionsDetailHref({
    formatSlug,
    pokemonId,
    formType: pokemon.formType,
    formCode: pokemon.formCode,
  })

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${canonicalPath}`,
      title: `${title} - 포케 코리아`,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: ogImages.large,
          width: 1200,
          height: 630,
          alt: `${title} - 포케 코리아`,
          type: 'image/png',
        },
        {
          url: ogImages.medium,
          width: 800,
          height: 800,
          alt: `${title} - 포케 코리아`,
          type: 'image/png',
        },
      ],
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - 포케 코리아`,
      description,
      images: [ogImages.large],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  }
}
