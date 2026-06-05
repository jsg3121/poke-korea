import { Metadata } from 'next'
import {
  ChampionsPokemonDetailFragment,
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables,
  PokemonType,
} from '~/graphql/typeGenerated'
import { GetChampionsPokemonDetailDocument } from '~/graphql/gqlGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'

import { OG_IMAGE_BASE, SITE_NAME, SITE_URL } from '~/constants/seo.constant'

// fragment 기반 타입 (응답에 실제 포함되는 필드만 사용)
type DetailPokemon = ChampionsPokemonDetailFragment['pokemon']
type DetailMeta = ChampionsPokemonDetailFragment['meta']
type DetailStats = DetailPokemon['stats']

/** 포켓몬 타입을 한국어로 변환 (예: ['FIRE', 'DRAGON'] → '불꽃·드래곤') */
const getKoreanTypesText = (types: Array<PokemonType>): string =>
  types.map((type) => PokemonTypes[type]).join('·')

/**
 * 6스탯 중 상위 1~2개를 한국어 라벨과 값으로 반환
 * description 다양화 시 포켓몬마다 강조 포인트가 달라지도록 함
 */
const getStatHighlights = (stats: DetailStats): string => {
  const statEntries: Array<{ label: string; value: number }> = [
    { label: 'HP', value: stats.hp },
    { label: '공격', value: stats.attack },
    { label: '방어', value: stats.defense },
    { label: '특수공격', value: stats.specialAttack },
    { label: '특수방어', value: stats.specialDefense },
    { label: '스피드', value: stats.speed },
  ]
  const sorted = [...statEntries].sort((a, b) => b.value - a.value)
  return `${sorted[0].label} ${sorted[0].value}, ${sorted[1].label} ${sorted[1].value}`
}

/**
 * 메타 통계를 활용 가능한 경우 인기 기술/특성을 한 줄로 반환
 * topMoves/topAbilities가 비어있으면 null 반환 → 호출 측에서 폴백 사용
 */
const getMetaHighlight = (meta: DetailMeta): string | null => {
  if (!meta) return null
  const topMove = meta.topMoves?.[0]?.name
  const topAbility = meta.topAbilities?.[0]?.name
  if (!topMove && !topAbility) return null
  if (topMove && topAbility) return `인기 기술 ${topMove}, ${topAbility} 특성`
  return topMove ? `인기 기술 ${topMove}` : `${topAbility} 특성`
}

/**
 * 챔피언스 상세 페이지 title 생성
 *
 * Why: 백엔드가 폼 정보를 포함한 완성된 name 을 응답 (예: "메가리자몽X", "켄타로스 (팔데아 워터종)").
 *      프론트에서 추가 합성 시 중첩 발생하므로 백엔드 name 그대로 사용. (Phase 2/3 결정)
 */
const buildDetailTitle = (pokemon: DetailPokemon): string => {
  return `${pokemon.name.replace('_', ' ')} 챔피언스 도감 - 스탯·기술·특성 | 포케코리아`
}

/**
 * 챔피언스 상세 페이지 description 생성
 * - 메타 데이터(topMoves, topAbilities)가 있으면 활용
 * - 없으면 스탯 하이라이트로 폴백
 * - tier 정보는 사용하지 않음 (공식 티어가 아닌 내부 분류이므로 description에 명시 시 사용자 오인 가능)
 * - 백엔드 name 그대로 사용 (폼 정보 포함). Phase 2/3 결정 위반 (formName 합성) 제거됨.
 * - 80자 이내 목표 (네이버 가이드라인)
 */
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
      title: '포켓몬을 찾을 수 없습니다 | 포케코리아',
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
      title: '포켓몬을 찾을 수 없습니다 | 포케코리아',
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
      title,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: ogImages.large,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
        {
          url: ogImages.medium,
          width: 800,
          height: 800,
          alt: title,
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
      title,
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
